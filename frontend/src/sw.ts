/// <reference lib="webworker" />

import { clientsClaim } from "workbox-core";
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import {
  ADMIN_SYNC_REQUEST,
  ADMIN_SYNC_RESULT,
  ADMIN_SYNC_TAG,
} from "./modules/admin/services/adminSync.constants";
import {
  processAdminMutationQueue,
  type AdminSyncResult,
} from "./modules/admin/services/adminQueueProcessor";

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<
    | string
    | { url: string; revision: string | null; integrity?: string }
  >;
};

interface BackgroundSyncEvent extends ExtendableEvent {
  tag: string;
}

interface SyncManagerRegistration extends ServiceWorkerRegistration {
  sync?: { register: (tag: string) => Promise<void> };
}

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();
clientsClaim();
registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html")));

self.addEventListener("install", () => {
  self.skipWaiting();
});

const notifyClients = async (result: AdminSyncResult): Promise<void> => {
  const clients = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });
  clients.forEach((client) => {
    client.postMessage({ type: ADMIN_SYNC_RESULT, result });
  });
};

const synchronize = async (retryOnNetworkFailure: boolean): Promise<void> => {
  const result = await processAdminMutationQueue();
  await notifyClients(result);

  if (result.networkUnavailable) {
    const registration = self.registration as SyncManagerRegistration;
    await registration.sync?.register(ADMIN_SYNC_TAG);

    if (retryOnNetworkFailure) {
      throw new Error("A rede continua indisponível para sincronização.");
    }
  }
};

self.addEventListener("sync", (event: Event) => {
  const syncEvent = event as BackgroundSyncEvent;
  if (syncEvent.tag === ADMIN_SYNC_TAG) {
    syncEvent.waitUntil(synchronize(true));
  }
});

self.addEventListener("message", (event: ExtendableMessageEvent) => {
  const message = event.data as { type?: string } | undefined;
  if (message?.type === ADMIN_SYNC_REQUEST) {
    event.waitUntil(synchronize(false));
  }
});
