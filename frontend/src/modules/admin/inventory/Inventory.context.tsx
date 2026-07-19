import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { InventoryItemData } from "../services/inventory.service";

interface InventoryContextData {
  items: InventoryItemData[];
  setItems: Dispatch<SetStateAction<InventoryItemData[]>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  errorMessage: string | null;
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
  isOnline: boolean;
  pendingChanges: number;
  setPendingChanges: Dispatch<SetStateAction<number>>;
  refreshPendingChanges: () => Promise<void>;
  reloadInventory: () => Promise<void>;
}

export const InventoryContext = createContext<
  InventoryContextData | undefined
>(undefined);

export const useInventoryContext = (): InventoryContextData => {
  const context = useContext(InventoryContext);

  if (!context) {
    throw new Error(
      "useInventoryContext deve ser usado dentro de InventoryContext.Provider",
    );
  }

  return context;
};
