import { createContext, useContext } from "react";
import type { CatalogItemData } from "../services/catalog.service";
import type { CatalogItemFormData } from "./catalogSchema";

interface CatalogContextData {
  catalogItems: CatalogItemData[];
  isLoading: boolean;
  isCreating: boolean;
  errorMessage: string | null;
  formVersion: number;
  createService: (data: CatalogItemFormData) => Promise<void>;
  reloadCatalog: () => Promise<void>;
}

export const CatalogContext = createContext<CatalogContextData | undefined>(
  undefined,
);

export const useCatalog = (): CatalogContextData => {
  const context = useContext(CatalogContext);

  if (!context) {
    throw new Error("useCatalog deve ser usado dentro de CatalogContext.Provider");
  }

  return context;
};
