import { useEffect, useMemo, useState } from "react";
import {
  getPendingInventoryChangesCount,
  readInventoryCache,
  writeInventoryCache,
} from "../services/inventoryOffline.service";
import { listInventoryItems } from "../services/inventory.service";
import type { InventoryItemData } from "../services/inventory.service";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { InventoryContext } from "./Inventory.context";
import InventoryView from "./Inventory.view";

const InventoryController = () => {
  const [items, setItems] = useState<InventoryItemData[]>(readInventoryCache);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingChanges, setPendingChanges] = useState(
    getPendingInventoryChangesCount,
  );

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
    writeInventoryCache(items);
  }, [items]);

  useEffect(() => {
    let active = true;

    const loadItems = async () => {
      if (!navigator.onLine) {
        setIsLoading(false);
        return;
      }

      try {
        const savedItems = await listInventoryItems();
        if (!active) return;
        setItems(savedItems);
        setErrorMessage(null);
      } catch (error: unknown) {
        if (!active) return;
        if (readInventoryCache().length === 0) {
          setErrorMessage(
            getApiErrorMessage(
              error,
              "Não foi possível carregar os itens do estoque.",
            ),
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadItems();
    return () => {
      active = false;
    };
  }, []);

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
    }),
    [errorMessage, isLoading, isOnline, items, pendingChanges],
  );

  return (
    <InventoryContext.Provider value={providerValue}>
      <InventoryView />
    </InventoryContext.Provider>
  );
};

export default InventoryController;
