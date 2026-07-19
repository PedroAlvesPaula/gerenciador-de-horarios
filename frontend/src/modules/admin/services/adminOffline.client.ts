import axios from "axios";
import {
  addAdminMutation,
  getPendingAdminMutationsCount,
  type AdminMutationMethod,
  type AdminResource,
} from "./adminOfflineDb";
import {
  processAdminMutationQueue,
  type AdminSyncResult,
} from "./adminQueueProcessor";
import {
  ADMIN_SYNC_REQUEST,
  ADMIN_SYNC_RESULT,
  ADMIN_SYNC_TAG,
} from "./adminSync.constants";

interface BackgroundSyncRegistration extends ServiceWorkerRegistration {
  sync?: { register: (tag: string) => Promise<void> };
}

interface QueueAdminMutationInput {
  resource: AdminResource;
  method: AdminMutationMethod;
  path: string;
  body?: unknown;
}

type AdminSyncListener = (result: AdminSyncResult) => void;

const listeners = new Set<AdminSyncListener>();
let bridgeInitialized = false;
let pageFlushPromise: Promise<void> | null = null;
let retryTimer: number | null = null;

const emitSyncResult = (result: AdminSyncResult): void => {
  listeners.forEach((listener) => listener(result));
};

const handleSyncResult = (result: AdminSyncResult): void => {
  emitSyncResult(result);

  if (!result.networkUnavailable) {
    if (retryTimer !== null) window.clearTimeout(retryTimer);
    retryTimer = null;
    return;
  }

  if (retryTimer !== null) return;
  retryTimer = window.setTimeout(() => {
    retryTimer = null;
    if (navigator.onLine) void requestAdminBackgroundSync();
  }, 15_000);
};

const processQueueInPage = (): Promise<void> => {
  pageFlushPromise ??= processAdminMutationQueue()
    .then(handleSyncResult)
    .finally(() => {
      pageFlushPromise = null;
    });
  return pageFlushPromise;
};

export const requestAdminBackgroundSync = async (): Promise<void> => {
  if (!navigator.onLine) {
    const registration = (await navigator.serviceWorker?.getRegistration()) as
      | BackgroundSyncRegistration
      | undefined;
    await registration?.sync?.register(ADMIN_SYNC_TAG);
    return;
  }

  if (navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: ADMIN_SYNC_REQUEST,
    });
    return;
  }

  await processQueueInPage();
};

const initializeBridge = (): void => {
  if (bridgeInitialized) return;
  bridgeInitialized = true;

  window.addEventListener("online", () => {
    void requestAdminBackgroundSync();
  });

  navigator.serviceWorker?.addEventListener("message", (event) => {
    const message = event.data as
      | { type?: string; result?: AdminSyncResult }
      | undefined;
    if (message?.type === ADMIN_SYNC_RESULT && message.result) {
      handleSyncResult(message.result);
    }
  });
};

export const subscribeToAdminSync = (
  listener: AdminSyncListener,
): (() => void) => {
  initializeBridge();
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const queueAdminMutation = async ({
  resource,
  method,
  path,
  body,
}: QueueAdminMutationInput): Promise<void> => {
  const token = localStorage.getItem("@phbarber:token");
  if (!token) throw new Error("Sessão administrativa não encontrada.");

  await addAdminMutation({
    id: crypto.randomUUID(),
    resource,
    method,
    path,
    body,
    token,
    createdAt: new Date().toISOString(),
    status: "pending",
  });

  try {
    await requestAdminBackgroundSync();
  } catch {
    // A mutação já está persistida. O evento `online` fará uma nova tentativa.
  }
};

export const isNetworkUnavailableError = (error: unknown): boolean =>
  axios.isAxiosError(error) && !error.response;

export { getPendingAdminMutationsCount };
export type { AdminSyncResult };
