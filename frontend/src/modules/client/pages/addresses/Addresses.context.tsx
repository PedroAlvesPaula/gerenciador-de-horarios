import { createContext, useContext } from "react";
import type { AddressData } from "../../services/addresses.service";
import type { AddressFormData } from "./addressSchema";

interface AddressesContextData {
  addresses: AddressData[];
  isLoading: boolean;
  isSaving: boolean;
  deletingAddressId: string | null;
  errorMessage: string | null;
  formAddress: AddressData | null;
  isFormOpen: boolean;
  addressToDelete: AddressData | null;
  openCreateForm: () => void;
  openEditForm: (address: AddressData) => void;
  closeForm: () => void;
  saveAddress: (data: AddressFormData) => Promise<void>;
  requestDelete: (address: AddressData) => void;
  cancelDelete: () => void;
  confirmDelete: () => Promise<void>;
  reloadAddresses: () => Promise<void>;
}

export const AddressesContext = createContext<
  AddressesContextData | undefined
>(undefined);

export const useAddresses = (): AddressesContextData => {
  const context = useContext(AddressesContext);

  if (!context) {
    throw new Error(
      "useAddresses deve ser usado dentro de AddressesContext.Provider",
    );
  }

  return context;
};
