import { useCallback, useEffect, useMemo, useState } from "react";
import { AddressesContext } from "./Addresses.context";
import AddressesView from "./Addresses.view";
import type { AddressFormData } from "./addressSchema";
import {
  createAddress,
  deleteAddress,
  listAddresses,
  updateAddress,
  type AddressData,
} from "../../services/addresses.service";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../../utils/toast";

const sortAddresses = (addresses: AddressData[]): AddressData[] =>
  [...addresses].sort((first, second) =>
    `${first.city} ${first.street} ${first.number}`.localeCompare(
      `${second.city} ${second.street} ${second.number}`,
      "pt-BR",
    ),
  );

const AddressesController = () => {
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formAddress, setFormAddress] = useState<AddressData | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<AddressData | null>(
    null,
  );

  const reloadAddresses = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setAddresses(sortAddresses(await listAddresses()));
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(error, "Não foi possível carregar seus endereços."),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadAddresses();
  }, [reloadAddresses]);

  const openCreateForm = useCallback(() => {
    setFormAddress(null);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback((address: AddressData) => {
    setFormAddress(address);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    if (isSaving) return;
    setIsFormOpen(false);
    setFormAddress(null);
  }, [isSaving]);

  const saveAddress = useCallback(
    async (data: AddressFormData) => {
      setIsSaving(true);

      try {
        const savedAddress = formAddress
          ? await updateAddress(formAddress.id, data)
          : await createAddress(data);

        setAddresses((current) =>
          sortAddresses(
            formAddress
              ? current.map((address) =>
                  address.id === savedAddress.id ? savedAddress : address,
                )
              : [...current, savedAddress],
          ),
        );
        setIsFormOpen(false);
        setFormAddress(null);
        notifySuccess(
          formAddress
            ? "Endereço atualizado com sucesso."
            : "Endereço cadastrado com sucesso.",
        );
      } catch (error: unknown) {
        notifyError(
          getApiErrorMessage(error, "Não foi possível salvar o endereço."),
        );
      } finally {
        setIsSaving(false);
      }
    },
    [formAddress],
  );

  const requestDelete = useCallback((address: AddressData) => {
    setAddressToDelete(address);
  }, []);

  const cancelDelete = useCallback(() => {
    if (deletingAddressId) return;
    setAddressToDelete(null);
  }, [deletingAddressId]);

  const confirmDelete = useCallback(async () => {
    if (!addressToDelete) return;

    setDeletingAddressId(addressToDelete.id);

    try {
      await deleteAddress(addressToDelete.id);
      setAddresses((current) =>
        current.filter((address) => address.id !== addressToDelete.id),
      );
      setAddressToDelete(null);
      notifySuccess("Endereço excluído com sucesso.");
    } catch (error: unknown) {
      notifyError(
        getApiErrorMessage(error, "Não foi possível excluir o endereço."),
      );
    } finally {
      setDeletingAddressId(null);
    }
  }, [addressToDelete]);

  const providerValue = useMemo(
    () => ({
      addresses,
      isLoading,
      isSaving,
      deletingAddressId,
      errorMessage,
      formAddress,
      isFormOpen,
      addressToDelete,
      openCreateForm,
      openEditForm,
      closeForm,
      saveAddress,
      requestDelete,
      cancelDelete,
      confirmDelete,
      reloadAddresses,
    }),
    [
      addressToDelete,
      addresses,
      cancelDelete,
      closeForm,
      confirmDelete,
      deletingAddressId,
      errorMessage,
      formAddress,
      isFormOpen,
      isLoading,
      isSaving,
      openCreateForm,
      openEditForm,
      reloadAddresses,
      requestDelete,
      saveAddress,
    ],
  );

  return (
    <AddressesContext.Provider value={providerValue}>
      <AddressesView />
    </AddressesContext.Provider>
  );
};

export default AddressesController;
