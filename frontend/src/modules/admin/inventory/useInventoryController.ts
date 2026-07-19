import { useCallback, useMemo, useState } from "react";
import {
  createInventoryItem,
  deleteInventoryItem,
  updateInventoryItem,
  type InventoryItemData,
  type InventoryItemPayload,
} from "../services/inventory.service";
import {
  isNetworkUnavailableError,
  queueAdminMutation,
} from "../services/adminOffline.client";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../utils/toast";
import { useInventoryContext } from "./Inventory.context";
import type { InventoryItemFormData } from "./inventorySchema";

const sortInventoryItems = (
  items: InventoryItemData[],
): InventoryItemData[] =>
  [...items].sort((first, second) =>
    first.name.localeCompare(second.name, "pt-BR"),
  );

const toPayload = (
  item: Pick<
    InventoryItemData,
    "name" | "category" | "minRecommended" | "quantity"
  >,
): InventoryItemPayload => ({
  name: item.name,
  category: item.category,
  minRecommended: item.minRecommended,
  quantity: item.quantity,
});

export const useInventoryController = () => {
  const {
    items,
    setItems,
    isLoading,
    errorMessage,
    isOnline,
    pendingChanges,
    refreshPendingChanges,
    reloadInventory,
  } = useInventoryContext();
  const [isSaving, setIsSaving] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [formItem, setFormItem] = useState<InventoryItemData | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [itemToDelete, setItemToDelete] =
    useState<InventoryItemData | null>(null);

  const updateQuantity = useCallback(
    (item: InventoryItemData, delta: number) => {
      const nextQuantity = item.quantity + delta;
      if (nextQuantity < 0) return;

      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id
            ? {
                ...currentItem,
                quantity: nextQuantity,
                updatedAt: new Date().toISOString(),
              }
            : currentItem,
        ),
      );

      void (async () => {
        try {
          await queueAdminMutation({
            resource: "inventory",
            method: "PATCH",
            path: `/inventory/${item.id}`,
            body: toPayload({ ...item, quantity: nextQuantity }),
          });
          await refreshPendingChanges();
        } catch (error: unknown) {
          setItems((current) =>
            current.map((currentItem) =>
              currentItem.id === item.id
                ? {
                    ...currentItem,
                    quantity: Math.max(0, currentItem.quantity - delta),
                  }
                : currentItem,
            ),
          );
          notifyError(
            getApiErrorMessage(error, "Não foi possível alterar a quantidade."),
          );
        }
      })();
    },
    [refreshPendingChanges, setItems],
  );

  const openCreateForm = useCallback(() => {
    setFormItem(null);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback((item: InventoryItemData) => {
    setFormItem(item);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    if (isSaving) return;
    setIsFormOpen(false);
    setFormItem(null);
  }, [isSaving]);

  const saveItem = useCallback(
    async (data: InventoryItemFormData) => {
      const previousItem = formItem;
      const id = previousItem?.id ?? crypto.randomUUID();
      const now = new Date().toISOString();
      const payload: InventoryItemPayload = {
        ...(previousItem ? {} : { id }),
        ...data,
      };
      const optimisticItem: InventoryItemData = {
        id,
        ...data,
        createdAt: previousItem?.createdAt ?? now,
        updatedAt: now,
      };

      setItems((current) =>
        sortInventoryItems(
          previousItem
            ? current.map((item) =>
                item.id === id ? optimisticItem : item,
              )
            : [...current, optimisticItem],
        ),
      );
      setIsFormOpen(false);
      setFormItem(null);
      setIsSaving(true);

      const mutation = {
        resource: "inventory" as const,
        method: previousItem ? ("PATCH" as const) : ("POST" as const),
        path: previousItem ? `/inventory/${id}` : "/inventory",
        body: payload,
      };

      try {
        if (!navigator.onLine) {
          await queueAdminMutation(mutation);
          await refreshPendingChanges();
        } else {
          try {
            const savedItem = previousItem
              ? await updateInventoryItem(id, payload)
              : await createInventoryItem(payload);
            setItems((current) =>
              sortInventoryItems(
                current.map((item) =>
                  item.id === id ? savedItem : item,
                ),
              ),
            );
          } catch (error: unknown) {
            if (!isNetworkUnavailableError(error)) throw error;
            await queueAdminMutation(mutation);
            await refreshPendingChanges();
          }
        }

        notifySuccess(
          previousItem
            ? "Item atualizado com sucesso."
            : "Item cadastrado com sucesso.",
        );
      } catch (error: unknown) {
        setItems((current) =>
          sortInventoryItems(
            previousItem
              ? current.map((item) =>
                  item.id === id ? previousItem : item,
                )
              : current.filter((item) => item.id !== id),
          ),
        );
        setFormItem(previousItem);
        setIsFormOpen(true);
        notifyError(
          getApiErrorMessage(error, "Não foi possível salvar o item."),
        );
      } finally {
        setIsSaving(false);
      }
    },
    [formItem, refreshPendingChanges, setItems],
  );

  const requestDelete = useCallback((item: InventoryItemData) => {
    setItemToDelete(item);
  }, []);

  const cancelDelete = useCallback(() => {
    if (!deletingItemId) setItemToDelete(null);
  }, [deletingItemId]);

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    const deletedItem = itemToDelete;
    setItems((current) =>
      current.filter((item) => item.id !== deletedItem.id),
    );
    setItemToDelete(null);
    setDeletingItemId(deletedItem.id);

    const mutation = {
      resource: "inventory" as const,
      method: "DELETE" as const,
      path: `/inventory/${deletedItem.id}`,
    };

    try {
      if (!navigator.onLine) {
        await queueAdminMutation(mutation);
        await refreshPendingChanges();
      } else {
        try {
          await deleteInventoryItem(deletedItem.id);
        } catch (error: unknown) {
          if (!isNetworkUnavailableError(error)) throw error;
          await queueAdminMutation(mutation);
          await refreshPendingChanges();
        }
      }
      notifySuccess("Item excluído com sucesso.");
    } catch (error: unknown) {
      setItems((current) =>
        sortInventoryItems(
          current.some((item) => item.id === deletedItem.id)
            ? current
            : [...current, deletedItem],
        ),
      );
      setItemToDelete(deletedItem);
      notifyError(
        getApiErrorMessage(error, "Não foi possível excluir o item."),
      );
    } finally {
      setDeletingItemId(null);
    }
  }, [itemToDelete, refreshPendingChanges, setItems]);

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
