import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  enqueueInventoryQuantityChange,
  flushInventoryQuantityQueue,
  getPendingInventoryChangesCount,
} from "../services/inventoryOffline.service";
import {
  createInventoryItem,
  deleteInventoryItem,
  listInventoryItems,
  updateInventoryItem,
  type InventoryItemData,
} from "../services/inventory.service";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifyInfo, notifySuccess } from "../../../utils/toast";
import { useInventoryContext } from "./Inventory.context";
import type { InventoryItemFormData } from "./inventorySchema";

const sortInventoryItems = (
  items: InventoryItemData[],
): InventoryItemData[] =>
  [...items].sort((first, second) =>
    first.name.localeCompare(second.name, "pt-BR"),
  );

export const useInventoryController = () => {
  const {
    items,
    setItems,
    isLoading,
    setIsLoading,
    errorMessage,
    setErrorMessage,
    isOnline,
    pendingChanges,
    setPendingChanges,
  } = useInventoryContext();
  const [isSaving, setIsSaving] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [formItem, setFormItem] = useState<InventoryItemData | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [itemToDelete, setItemToDelete] =
    useState<InventoryItemData | null>(null);
  const syncingRef = useRef(false);

  const reloadInventory = useCallback(async () => {
    if (!navigator.onLine) {
      notifyInfo("Você está offline. Exibindo o estoque salvo neste aparelho.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      setItems(sortInventoryItems(await listInventoryItems()));
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(error, "Não foi possível atualizar o estoque."),
      );
    } finally {
      setIsLoading(false);
    }
  }, [setErrorMessage, setIsLoading, setItems]);

  const synchronizePendingChanges = useCallback(async () => {
    if (syncingRef.current || !navigator.onLine) return;
    syncingRef.current = true;

    try {
      const result = await flushInventoryQuantityQueue();

      if (result.failedMutations.length > 0) {
        setItems((current) =>
          current.map((item) => {
            const failedDelta = result.failedMutations
              .filter((mutation) => mutation.itemId === item.id)
              .reduce((total, mutation) => total + mutation.delta, 0);
            return failedDelta === 0
              ? item
              : { ...item, quantity: Math.max(0, item.quantity - failedDelta) };
          }),
        );
        notifyError(
          "Algumas alterações foram recusadas pelo servidor e foram revertidas.",
        );
      }

      const remainingChanges = getPendingInventoryChangesCount();
      setPendingChanges(remainingChanges);

      if (result.networkUnavailable) {
        notifyInfo(
          "Alteração salva no aparelho. A sincronização será tentada novamente.",
        );
        return;
      }

      if (remainingChanges === 0) {
        setItems(sortInventoryItems(await listInventoryItems()));
      }
    } catch (error: unknown) {
      notifyError(
        getApiErrorMessage(error, "Não foi possível sincronizar o estoque."),
      );
    } finally {
      setPendingChanges(getPendingInventoryChangesCount());
      syncingRef.current = false;
    }
  }, [setItems, setPendingChanges]);

  useEffect(() => {
    if (!isOnline || pendingChanges === 0) return;

    void synchronizePendingChanges();
    const retryTimer = window.setInterval(() => {
      void synchronizePendingChanges();
    }, 15_000);

    return () => window.clearInterval(retryTimer);
  }, [isOnline, pendingChanges, synchronizePendingChanges]);

  const updateQuantity = useCallback(
    (item: InventoryItemData, delta: number) => {
      const nextQuantity = item.quantity + delta;
      if (nextQuantity < 0) return;

      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id
            ? { ...currentItem, quantity: nextQuantity }
            : currentItem,
        ),
      );
      enqueueInventoryQuantityChange(item.id, delta);
      setPendingChanges(getPendingInventoryChangesCount());

      if (!navigator.onLine) {
        notifyInfo(
          "Alteração salva offline e pendente de sincronização.",
        );
        return;
      }

      void synchronizePendingChanges();
    },
    [setItems, setPendingChanges, synchronizePendingChanges],
  );

  const openCreateForm = useCallback(() => {
    setFormItem(null);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback(
    (item: InventoryItemData) => {
      if (pendingChanges > 0) {
        notifyInfo(
          "Aguarde a sincronização das quantidades antes de editar o item.",
        );
        void synchronizePendingChanges();
        return;
      }

      setFormItem(item);
      setIsFormOpen(true);
    },
    [pendingChanges, synchronizePendingChanges],
  );

  const closeForm = useCallback(() => {
    if (isSaving) return;
    setIsFormOpen(false);
    setFormItem(null);
  }, [isSaving]);

  const saveItem = useCallback(
    async (data: InventoryItemFormData) => {
      if (!navigator.onLine) {
        notifyInfo("Conecte-se à internet para cadastrar ou editar um item.");
        return;
      }

      setIsSaving(true);
      try {
        const savedItem = formItem
          ? await updateInventoryItem(formItem.id, data)
          : await createInventoryItem(data);
        setItems((current) =>
          sortInventoryItems(
            formItem
              ? current.map((item) =>
                  item.id === savedItem.id ? savedItem : item,
                )
              : [...current, savedItem],
          ),
        );
        setFormItem(null);
        setIsFormOpen(false);
        notifySuccess(
          formItem
            ? "Item atualizado com sucesso."
            : "Item cadastrado com sucesso.",
        );
      } catch (error: unknown) {
        notifyError(
          getApiErrorMessage(error, "Não foi possível salvar o item."),
        );
      } finally {
        setIsSaving(false);
      }
    },
    [formItem, setItems],
  );

  const requestDelete = useCallback(
    (item: InventoryItemData) => {
      if (pendingChanges > 0) {
        notifyInfo(
          "Aguarde a sincronização das quantidades antes de excluir o item.",
        );
        void synchronizePendingChanges();
        return;
      }

      setItemToDelete(item);
    },
    [pendingChanges, synchronizePendingChanges],
  );

  const cancelDelete = useCallback(() => {
    if (!deletingItemId) setItemToDelete(null);
  }, [deletingItemId]);

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete) return;
    if (!navigator.onLine) {
      notifyInfo("Conecte-se à internet para excluir um item.");
      return;
    }

    setDeletingItemId(itemToDelete.id);
    try {
      await deleteInventoryItem(itemToDelete.id);
      setItems((current) =>
        current.filter((item) => item.id !== itemToDelete.id),
      );
      setItemToDelete(null);
      notifySuccess("Item excluído com sucesso.");
    } catch (error: unknown) {
      notifyError(
        getApiErrorMessage(error, "Não foi possível excluir o item."),
      );
    } finally {
      setDeletingItemId(null);
    }
  }, [itemToDelete, setItems]);

  const criticalItemsCount = useMemo(
    () =>
      items.filter((item) => item.quantity < item.minRecommended).length,
    [items],
  );
  const outOfStockItemsCount = useMemo(
    () =>
      items.filter(
        (item) => item.quantity === 0 && item.quantity < item.minRecommended,
      ).length,
    [items],
  );

  return {
    items,
    isLoading,
    errorMessage,
    isOnline,
    pendingChanges,
    criticalItemsCount,
    outOfStockItemsCount,
    isSaving,
    deletingItemId,
    formItem,
    isFormOpen,
    itemToDelete,
    reloadInventory,
    updateQuantity,
    openCreateForm,
    openEditForm,
    closeForm,
    saveItem,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
};
