import axios from "axios";
import {
  updateInventoryQuantity,
  type InventoryItemData,
} from "./inventory.service";

const CACHE_KEY = "@phbarber:inventory-cache:v1";
const QUEUE_KEY = "@phbarber:inventory-quantity-queue:v1";

export interface InventoryQuantityMutation {
  operationId: string;
  itemId: string;
  delta: number;
  createdAt: string;
}

export interface InventoryQueueFlushResult {
  failedMutations: InventoryQuantityMutation[];
  networkUnavailable: boolean;
}

let activeFlush: Promise<InventoryQueueFlushResult> | null = null;

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const readQueue = (): InventoryQuantityMutation[] =>
  readJson<InventoryQuantityMutation[]>(QUEUE_KEY, []);

const writeQueue = (queue: InventoryQuantityMutation[]): void => {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

export const readInventoryCache = (): InventoryItemData[] =>
  readJson<InventoryItemData[]>(CACHE_KEY, []);

export const writeInventoryCache = (items: InventoryItemData[]): void => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(items));
};

export const getPendingInventoryChangesCount = (): number => readQueue().length;

export const enqueueInventoryQuantityChange = (
  itemId: string,
  delta: number,
): void => {
  const mutation: InventoryQuantityMutation = {
    operationId: crypto.randomUUID(),
    itemId,
    delta,
    createdAt: new Date().toISOString(),
  };
  writeQueue([...readQueue(), mutation]);
};

const removeMutation = (operationId: string): void => {
  writeQueue(
    readQueue().filter((mutation) => mutation.operationId !== operationId),
  );
};

const runQueueFlush = async (): Promise<InventoryQueueFlushResult> => {
  const failedMutations: InventoryQuantityMutation[] = [];
  let networkUnavailable = false;

  while (true) {
    const mutation = readQueue()[0];
    if (!mutation) break;

    try {
      await updateInventoryQuantity(mutation.itemId, mutation.delta);
      removeMutation(mutation.operationId);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && !error.response) {
        networkUnavailable = true;
        break;
      }

      removeMutation(mutation.operationId);
      failedMutations.push(mutation);
    }
  }

  return { failedMutations, networkUnavailable };
};

export const flushInventoryQuantityQueue = (): Promise<InventoryQueueFlushResult> => {
  if (activeFlush) return activeFlush;

  activeFlush = runQueueFlush().finally(() => {
    activeFlush = null;
  });
  return activeFlush;
};
