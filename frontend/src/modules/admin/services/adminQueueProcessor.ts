import { API_BASE_URL } from "../../../services/apiConfig";
import {
  claimNextAdminMutation,
  completeAdminMutation,
  invalidateAdminSnapshots,
  releaseAdminMutation,
  type AdminResource,
} from "./adminOfflineDb";

export interface AdminSyncFailure {
  mutationId: string;
  resource: AdminResource;
  status: number;
  message: string;
}

export interface AdminSyncResult {
  processed: number;
  resources: AdminResource[];
  failures: AdminSyncFailure[];
  networkUnavailable: boolean;
}

const getResponseMessage = async (response: Response): Promise<string> => {
  try {
    const body = (await response.json()) as { message?: string | string[] };
    return Array.isArray(body.message)
      ? body.message.join(" ")
      : (body.message ?? `Erro HTTP ${response.status}`);
  } catch {
    return `Erro HTTP ${response.status}`;
  }
};

const MUTATION_TIMEOUT_MS = 20_000;

let activeQueueProcess: Promise<AdminSyncResult> | null = null;

const runAdminMutationQueue = async (): Promise<AdminSyncResult> => {
  const resources = new Set<AdminResource>();
  const failures: AdminSyncFailure[] = [];
  let processed = 0;
  let networkUnavailable = false;

  while (true) {
    const mutation = await claimNextAdminMutation();
    if (!mutation) break;
    if (mutation.queueId === undefined) break;

    try {
      const abortController = new AbortController();
      const requestTimeout = setTimeout(
        () => abortController.abort(),
        MUTATION_TIMEOUT_MS,
      );
      let response: Response;

      try {
        response = await fetch(`${API_BASE_URL}${mutation.path}`, {
          method: mutation.method,
          headers: {
            Authorization: `Bearer ${mutation.token}`,
            ...(mutation.body === undefined
              ? {}
              : { "Content-Type": "application/json" }),
          },
          body:
            mutation.body === undefined
              ? undefined
              : JSON.stringify(mutation.body),
          signal: abortController.signal,
        });
      } finally {
        clearTimeout(requestTimeout);
      }
      const deleteAlreadyApplied =
        mutation.method === "DELETE" && response.status === 404;

      if (response.ok || deleteAlreadyApplied) {
        await completeAdminMutation(mutation.queueId);
        resources.add(mutation.resource);
        processed += 1;
        continue;
      }

      failures.push({
        mutationId: mutation.id,
        resource: mutation.resource,
        status: response.status,
        message: await getResponseMessage(response),
      });
      await completeAdminMutation(mutation.queueId);
      resources.add(mutation.resource);
    } catch {
      await releaseAdminMutation(mutation.queueId);
      networkUnavailable = true;
      break;
    }
  }

  const affectedResources = [...resources];
  await invalidateAdminSnapshots(affectedResources);

  return {
    processed,
    resources: affectedResources,
    failures,
    networkUnavailable,
  };
};

export const processAdminMutationQueue = (): Promise<AdminSyncResult> => {
  activeQueueProcess ??= runAdminMutationQueue().finally(() => {
    activeQueueProcess = null;
  });
  return activeQueueProcess;
};
