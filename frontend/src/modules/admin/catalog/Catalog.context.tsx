import { createContext, useContext } from "react";
import type { CatalogItemData } from "../services/catalog.service";
import type { CatalogItemFormData } from "./catalogSchema";

interface CatalogContextData {
  catalogItems: CatalogItemData[];
  isLoading: boolean;
  isSaving: boolean;
  deletingItemId: string | null;
  errorMessage: string | null;
  formItem: CatalogItemData | null;
  isFormOpen: boolean;
  itemToDelete: CatalogItemData | null;
  openCreateForm: () => void;
  openEditForm: (item: CatalogItemData) => void;
  closeForm: () => void;
  saveService: (data: CatalogItemFormData) => Promise<void>;
  requestDelete: (item: CatalogItemData) => void;
  cancelDelete: () => void;
  confirmDelete: () => Promise<void>;
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
