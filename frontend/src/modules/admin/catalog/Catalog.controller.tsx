import { useCallback, useEffect, useMemo, useState } from "react";
import { CatalogContext } from "./Catalog.context";
import CatalogView from "./Catalog.view";
import type { CatalogItemFormData } from "./catalogSchema";
import {
  createCatalogItem,
  listAdminCatalogItems,
  type CatalogItemData,
} from "../services/catalog.service";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../utils/toast";

const CatalogController = () => {
  const [catalogItems, setCatalogItems] = useState<CatalogItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formVersion, setFormVersion] = useState(0);

  const reloadCatalog = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setCatalogItems(await listAdminCatalogItems());
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

  const createService = useCallback(async (data: CatalogItemFormData) => {
    setIsCreating(true);

    try {
      const createdItem = await createCatalogItem(data);
      setCatalogItems((current) =>
        [...current, createdItem].sort((first, second) =>
          first.name.localeCompare(second.name, "pt-BR"),
        ),
      );
      setFormVersion((current) => current + 1);
      notifySuccess("Serviço cadastrado com sucesso.");
    } catch (error: unknown) {
      notifyError(
        getApiErrorMessage(error, "Não foi possível cadastrar o serviço."),
      );
    } finally {
      setIsCreating(false);
    }
  }, []);

  const providerValue = useMemo(
    () => ({
      catalogItems,
      isLoading,
      isCreating,
      errorMessage,
      formVersion,
      createService,
      reloadCatalog,
    }),
    [
      catalogItems,
      createService,
      errorMessage,
      formVersion,
      isCreating,
      isLoading,
      reloadCatalog,
    ],
  );

  return (
    <CatalogContext.Provider value={providerValue}>
      <CatalogView />
    </CatalogContext.Provider>
  );
};

export default CatalogController;
