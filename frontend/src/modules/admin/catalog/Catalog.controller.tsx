import { useCallback, useEffect, useMemo, useState } from "react";
import { CatalogContext } from "./Catalog.context";
import CatalogView from "./Catalog.view";
import type { CatalogItemFormData } from "./catalogSchema";
import {
  createCatalogItem,
  deleteCatalogItem,
  listAdminCatalogItems,
  updateCatalogItem,
  type CatalogItemData,
} from "../services/catalog.service";
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

  const reloadCatalog = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setCatalogItems(sortCatalogItems(await listAdminCatalogItems()));
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(error, "Não foi possível carregar os serviços."),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadCatalog();
  }, [reloadCatalog]);

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
      setIsSaving(true);

      try {
        const savedItem = formItem
          ? await updateCatalogItem(formItem.id, data)
          : await createCatalogItem(data);

        setCatalogItems((current) =>
          sortCatalogItems(
            formItem
              ? current.map((item) =>
                  item.id === savedItem.id ? savedItem : item,
                )
              : [...current, savedItem],
          ),
        );
        setIsFormOpen(false);
        setFormItem(null);
        notifySuccess(
          formItem
            ? "Serviço atualizado com sucesso."
            : "Serviço cadastrado com sucesso.",
        );
      } catch (error: unknown) {
        notifyError(
          getApiErrorMessage(error, "Não foi possível salvar o serviço."),
        );
      } finally {
        setIsSaving(false);
      }
    },
    [formItem],
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

    setDeletingItemId(itemToDelete.id);

    try {
      await deleteCatalogItem(itemToDelete.id);
      setCatalogItems((current) =>
        current.filter((item) => item.id !== itemToDelete.id),
      );
      setItemToDelete(null);
      notifySuccess("Serviço excluído com sucesso.");
    } catch (error: unknown) {
      notifyError(
        getApiErrorMessage(error, "Não foi possível excluir o serviço."),
      );
    } finally {
      setDeletingItemId(null);
    }
  }, [itemToDelete]);

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
