import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getAdminSnapshot,
  setAdminSnapshot,
} from "../services/adminOfflineDb";
import {
  getPendingAdminMutationsCount,
  requestAdminBackgroundSync,
  subscribeToAdminSync,
} from "../services/adminOffline.client";
import { listInventoryItems } from "../services/inventory.service";
import type { InventoryItemData } from "../services/inventory.service";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { InventoryContext } from "./Inventory.context";
import InventoryView from "./Inventory.view";

const sortInventoryItems = (
  items: InventoryItemData[],
): InventoryItemData[] =>
  [...items].sort((first, second) =>
    first.name.localeCompare(second.name, "pt-BR"),
  );

const InventoryController = () => {
  const [items, setItems] = useState<InventoryItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingChanges, setPendingChanges] = useState(0);
  const cacheHydratedRef = useRef(false);

  const refreshPendingChanges = useCallback(async () => {
    setPendingChanges(await getPendingAdminMutationsCount("inventory"));
  }, []);

  const reloadInventory = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const cached = await getAdminSnapshot<InventoryItemData[]>("inventory");
    cacheHydratedRef.current = true;
    if (cached) setItems(sortInventoryItems(cached));

    const pending = await getPendingAdminMutationsCount("inventory");
    setPendingChanges(pending);

    if (!navigator.onLine) {
      setIsLoading(false);
      return;
    }

    if (pending > 0) {
      setIsLoading(false);
      void requestAdminBackgroundSync();
      return;
    }

    try {
      setItems(sortInventoryItems(await listInventoryItems()));
    } catch (error: unknown) {
      if (!cached) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            "Não foi possível carregar os itens do estoque.",
          ),
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadInventory();
  }, [reloadInventory]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (cacheHydratedRef.current) {
      void setAdminSnapshot("inventory", items);
    }
  }, [items]);

  useEffect(
    () =>
      subscribeToAdminSync((result) => {
        if (result.resources.includes("inventory")) {
          void refreshPendingChanges();
          if (navigator.onLine) void reloadInventory();
        }
      }),
    [refreshPendingChanges, reloadInventory],
  );

  const providerValue = useMemo(
    () => ({
      items,
      setItems,
      isLoading,
      setIsLoading,
      errorMessage,
      setErrorMessage,
      isOnline,
      pendingChanges,
      setPendingChanges,
      refreshPendingChanges,
      reloadInventory,
    }),
    [
      errorMessage,
      isLoading,
      isOnline,
      items,
      pendingChanges,
      refreshPendingChanges,
      reloadInventory,
    ],
  );

  return (
    <InventoryContext.Provider value={providerValue}>
      <InventoryView />
    </InventoryContext.Provider>
  );
};

export default InventoryController;
