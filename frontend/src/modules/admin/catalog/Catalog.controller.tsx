import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CatalogContext } from "./Catalog.context";
import CatalogView from "./Catalog.view";
import type { CatalogItemFormData } from "./catalogSchema";
import {
  createCatalogItem,
  deleteCatalogItem,
  listAdminCatalogItems,
  updateCatalogItem,
  type CatalogItemData,
  type CatalogItemPayload,
} from "../services/catalog.service";
import {
  getAdminSnapshot,
  setAdminSnapshot,
} from "../services/adminOfflineDb";
import {
  getPendingAdminMutationsCount,
  isNetworkUnavailableError,
  queueAdminMutation,
  requestAdminBackgroundSync,
  subscribeToAdminSync,
} from "../services/adminOffline.client";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../utils/toast";

const sortCatalogItems = (items: CatalogItemData[]): CatalogItemData[] =>
  [...items].sort((first, second) =>
    first.name.localeCompare(second.name, "pt-BR"),
  );

const CatalogController = () => {
  const [catalogItems, setCatalogItems] = useState<CatalogItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formItem, setFormItem] = useState<CatalogItemData | null>(null);
  const [itemToDelete, setItemToDelete] = useState<CatalogItemData | null>(null);
  const cacheHydratedRef = useRef(false);

  const reloadCatalog = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const cached = await getAdminSnapshot<CatalogItemData[]>("catalog");
    cacheHydratedRef.current = true;
    if (cached) setCatalogItems(sortCatalogItems(cached));

    if (!navigator.onLine) {
      setIsLoading(false);
      return;
    }

    if ((await getPendingAdminMutationsCount("catalog")) > 0) {
      setIsLoading(false);
      void requestAdminBackgroundSync();
      return;
    }

    try {
      setCatalogItems(sortCatalogItems(await listAdminCatalogItems()));
    } catch (error: unknown) {
      if (!cached) {
        setErrorMessage(
          getApiErrorMessage(error, "Não foi possível carregar os serviços."),
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadCatalog();
  }, [reloadCatalog]);

  useEffect(() => {
    if (cacheHydratedRef.current) {
      void setAdminSnapshot("catalog", catalogItems);
    }
  }, [catalogItems]);

  useEffect(
    () =>
      subscribeToAdminSync((result) => {
        if (result.resources.includes("catalog") && navigator.onLine) {
          void reloadCatalog();
        }
      }),
    [reloadCatalog],
  );

  const openCreateForm = useCallback(() => {
    setFormItem(null);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback((item: CatalogItemData) => {
    setFormItem(item);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    if (isSaving) return;
    setIsFormOpen(false);
    setFormItem(null);
  }, [isSaving]);

  const saveService = useCallback(
    async (data: CatalogItemFormData) => {
      const previousItems = catalogItems;
      const previousFormItem = formItem;
      const now = new Date().toISOString();
      const id = formItem?.id ?? crypto.randomUUID();
      const payload: CatalogItemPayload = {
        ...(formItem ? {} : { id }),
        ...data,
      };
      const optimisticItem: CatalogItemData = {
        id,
        name: data.name,
        description: data.description,
        price: data.price,
        durationMinutes: data.durationMinutes,
        createdAt: formItem?.createdAt ?? now,
        updatedAt: now,
      };
      const optimisticItems = sortCatalogItems(
        formItem
          ? catalogItems.map((item) =>
              item.id === id ? optimisticItem : item,
            )
          : [...catalogItems, optimisticItem],
      );

      setCatalogItems(optimisticItems);
      setIsFormOpen(false);
      setFormItem(null);
      setIsSaving(true);

      const mutation = {
        resource: "catalog" as const,
        method: formItem ? ("PATCH" as const) : ("POST" as const),
        path: formItem ? `/catalog/${id}` : "/catalog",
        body: payload,
      };

      try {
        if (!navigator.onLine) {
          await queueAdminMutation(mutation);
        } else {
          try {
            const savedItem = formItem
              ? await updateCatalogItem(id, payload)
              : await createCatalogItem(payload);
            setCatalogItems((current) =>
              sortCatalogItems(
                current.map((item) =>
                  item.id === id ? savedItem : item,
                ),
              ),
            );
          } catch (error: unknown) {
            if (!isNetworkUnavailableError(error)) throw error;
            await queueAdminMutation(mutation);
          }
        }

        notifySuccess(
          formItem
            ? "Serviço atualizado com sucesso."
            : "Serviço cadastrado com sucesso.",
        );
      } catch (error: unknown) {
        setCatalogItems(previousItems);
        setFormItem(previousFormItem);
        setIsFormOpen(true);
        notifyError(
          getApiErrorMessage(error, "Não foi possível salvar o serviço."),
        );
      } finally {
        setIsSaving(false);
      }
    },
    [catalogItems, formItem],
  );

  const requestDelete = useCallback((item: CatalogItemData) => {
    setItemToDelete(item);
  }, []);

  const cancelDelete = useCallback(() => {
    if (deletingItemId) return;
    setItemToDelete(null);
  }, [deletingItemId]);

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    const previousItems = catalogItems;
    const deletedItem = itemToDelete;
    setCatalogItems((current) =>
      current.filter((item) => item.id !== deletedItem.id),
    );
    setItemToDelete(null);
    setDeletingItemId(deletedItem.id);

    const mutation = {
      resource: "catalog" as const,
      method: "DELETE" as const,
      path: `/catalog/${deletedItem.id}`,
    };

    try {
      if (!navigator.onLine) {
        await queueAdminMutation(mutation);
      } else {
        try {
          await deleteCatalogItem(deletedItem.id);
        } catch (error: unknown) {
          if (!isNetworkUnavailableError(error)) throw error;
          await queueAdminMutation(mutation);
        }
      }
      notifySuccess("Serviço excluído com sucesso.");
    } catch (error: unknown) {
      setCatalogItems(previousItems);
      setItemToDelete(deletedItem);
      notifyError(
        getApiErrorMessage(error, "Não foi possível excluir o serviço."),
      );
    } finally {
      setDeletingItemId(null);
    }
  }, [catalogItems, itemToDelete]);

  const providerValue = useMemo(
    () => ({
      catalogItems,
      isLoading,
      isSaving,
      deletingItemId,
      errorMessage,
      formItem,
      isFormOpen,
      itemToDelete,
      openCreateForm,
      openEditForm,
      closeForm,
      saveService,
      requestDelete,
      cancelDelete,
      confirmDelete,
      reloadCatalog,
    }),
    [
      cancelDelete,
      catalogItems,
      closeForm,
      confirmDelete,
      deletingItemId,
      errorMessage,
      formItem,
      isFormOpen,
      isLoading,
      isSaving,
      itemToDelete,
      openCreateForm,
      openEditForm,
      reloadCatalog,
      requestDelete,
      saveService,
    ],
  );

  return (
    <CatalogContext.Provider value={providerValue}>
      <CatalogView />
    </CatalogContext.Provider>
  );
};

export default CatalogController;
