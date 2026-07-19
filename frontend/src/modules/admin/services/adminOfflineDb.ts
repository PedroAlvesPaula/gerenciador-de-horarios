import { openDB, type DBSchema, type IDBPDatabase } from "idb";

export type AdminResource =
  | "catalog"
  | "inventory"
  | "business-hours"
  | "days-off"
  | "appointments"
  | "appointment-clients";

export type AdminMutationMethod = "POST" | "PUT" | "PATCH" | "DELETE";
export type AdminMutationStatus = "pending" | "processing";

export interface AdminMutation {
  queueId?: number;
  id: string;
  resource: AdminResource;
  method: AdminMutationMethod;
  path: string;
  body?: unknown;
  token: string;
  createdAt: string;
  status: AdminMutationStatus;
  processingStartedAt?: string;
}

interface AdminSnapshot {
  resource: AdminResource;
  data: unknown;
  updatedAt: string;
}

interface AdminOfflineDatabase extends DBSchema {
  mutations: {
    key: number;
    value: AdminMutation;
    indexes: {
      "by-resource": AdminResource;
    };
  };
  snapshots: {
    key: AdminResource;
    value: AdminSnapshot;
  };
}

const DATABASE_NAME = "phbarber-admin-offline";
const DATABASE_VERSION = 1;
const PROCESSING_LEASE_MS = 60_000;

let databasePromise: Promise<IDBPDatabase<AdminOfflineDatabase>> | null = null;

const getDatabase = (): Promise<IDBPDatabase<AdminOfflineDatabase>> => {
  if (!databasePromise) {
    databasePromise = openDB<AdminOfflineDatabase>(
      DATABASE_NAME,
      DATABASE_VERSION,
      {
        upgrade(database) {
          const mutationStore = database.createObjectStore("mutations", {
            keyPath: "queueId",
            autoIncrement: true,
          });
          mutationStore.createIndex("by-resource", "resource");
          database.createObjectStore("snapshots", { keyPath: "resource" });
        },
      },
    ).catch((error: unknown) => {
      databasePromise = null;
      throw error;
    });
  }

  return databasePromise;
};

export const getAdminSnapshot = async <T>(
  resource: AdminResource,
): Promise<T | null> => {
  try {
    const snapshot = await (await getDatabase()).get("snapshots", resource);
    return snapshot ? (snapshot.data as T) : null;
  } catch {
    return null;
  }
};

export const setAdminSnapshot = async <T>(
  resource: AdminResource,
  data: T,
): Promise<void> => {
  try {
    await (await getDatabase()).put("snapshots", {
      resource,
      data,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    // O cache é auxiliar; falhas de armazenamento não bloqueiam a aplicação.
  }
};

export const invalidateAdminSnapshots = async (
  resources: AdminResource[],
): Promise<void> => {
  if (resources.length === 0) return;

  try {
    const transaction = (await getDatabase()).transaction(
      "snapshots",
      "readwrite",
    );
    await Promise.all([
      ...resources.map((resource) => transaction.store.delete(resource)),
      transaction.done,
    ]);
  } catch {
    // A fila já foi sincronizada; a invalidação do cache é best effort.
  }
};

export const addAdminMutation = async (
  mutation: AdminMutation,
): Promise<void> => {
  await (await getDatabase()).add("mutations", mutation);
};

export const getPendingAdminMutationsCount = async (
  resource?: AdminResource,
): Promise<number> => {
  try {
    const database = await getDatabase();
    if (resource) {
      const mutations = await database.getAllFromIndex(
        "mutations",
        "by-resource",
        resource,
      );
      return mutations.length;
    }
    return database.count("mutations");
  } catch {
    return 0;
  }
};

const recoverExpiredMutation = async (
  mutation: AdminMutation,
): Promise<void> => {
  if (
    mutation.status !== "processing" ||
    !mutation.processingStartedAt ||
    Date.now() - new Date(mutation.processingStartedAt).getTime() <
      PROCESSING_LEASE_MS
  ) {
    return;
  }

  await (await getDatabase()).put("mutations", {
    ...mutation,
    status: "pending",
    processingStartedAt: undefined,
  });
};

export const claimNextAdminMutation = async (): Promise<AdminMutation | null> => {
  const database = await getDatabase();
  const candidates = await database.getAll("mutations");
  const candidate = candidates[0];
  if (!candidate || candidate.queueId === undefined) return null;

  await recoverExpiredMutation(candidate);
  const transaction = database.transaction("mutations", "readwrite");
  const current = await transaction.store.get(candidate.queueId);

  if (current?.status !== "pending") {
    await transaction.done;
    return null;
  }

  const claimed: AdminMutation = {
    ...current,
    status: "processing",
    processingStartedAt: new Date().toISOString(),
  };
  await transaction.store.put(claimed);
  await transaction.done;
  return claimed;
};

export const releaseAdminMutation = async (queueId: number): Promise<void> => {
  const database = await getDatabase();
  const mutation = await database.get("mutations", queueId);
  if (!mutation) return;

  await database.put("mutations", {
    ...mutation,
    status: "pending",
    processingStartedAt: undefined,
  });
};

export const completeAdminMutation = async (queueId: number): Promise<void> => {
  await (await getDatabase()).delete("mutations", queueId);
};
