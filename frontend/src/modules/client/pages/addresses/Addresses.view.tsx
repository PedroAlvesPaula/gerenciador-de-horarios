import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { EntityCard } from "../../../../components/sysCard/sysCard.view";
import { useAddresses } from "./Addresses.context";
import AddressFormDialog from "./components/AddressFormDialog";
import DeleteAddressDialog from "./components/DeleteAddressDialog";
import Styles from "./Addresses.styles";

const AddressesView = () => {
  const {
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
  } = useAddresses();

  return (
    <Styles.PageWrapper>
      <Styles.PageHeader>
        <Box>
          <Styles.PageTitle variant="h4" component="h1">
            Meus endereços
          </Styles.PageTitle>
          <Typography color="text.secondary">
            Cadastre e mantenha atualizados os locais vinculados à sua conta.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddLocationAltIcon />}
          onClick={openCreateForm}
        >
          Novo endereço
        </Button>
      </Styles.PageHeader>

      {isLoading && (
        <Styles.CenteredState>
          <CircularProgress />
        </Styles.CenteredState>
      )}

      {!isLoading && errorMessage && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={reloadAddresses}>
              Tentar novamente
            </Button>
          }
        >
          {errorMessage}
        </Alert>
      )}

      {!isLoading && !errorMessage && addresses.length === 0 && (
        <Alert severity="info">
          Você ainda não cadastrou nenhum endereço.
        </Alert>
      )}

      {!isLoading && !errorMessage && addresses.length > 0 && (
        <Styles.AddressGrid component="section" aria-label="Endereços cadastrados">
          {addresses.map((address) => (
            <EntityCard
              key={address.id}
              title={`${address.street}, ${address.number}`}
              titleComponent="h2"
              leading={<PlaceOutlinedIcon color="secondary" />}
              actions={[
                {
                  label: "Editar",
                  icon: <EditOutlinedIcon />,
                  onClick: () => openEditForm(address),
                  ariaLabel: `Editar endereço ${address.street}, ${address.number}`,
                },
                {
                  label: "Excluir",
                  icon: <DeleteOutlinedIcon />,
                  color: "error",
                  disabled: deletingAddressId === address.id,
                  onClick: () => requestDelete(address),
                  ariaLabel: `Excluir endereço ${address.street}, ${address.number}`,
                },
              ]}
            >
              {address.complement && (
                <Typography variant="body2" color="text.secondary">
                  {address.complement}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                {address.neighborhood} • {address.city}/{address.state}
              </Typography>
              {address.zipCode && (
                <Typography variant="body2" color="text.secondary">
                  CEP {address.zipCode}
                </Typography>
              )}
            </EntityCard>
          ))}
        </Styles.AddressGrid>
      )}

      {isFormOpen && (
        <AddressFormDialog
          address={formAddress}
          isSaving={isSaving}
          onClose={closeForm}
          onSubmit={saveAddress}
        />
      )}

      {addressToDelete && (
        <DeleteAddressDialog
          address={addressToDelete}
          isDeleting={deletingAddressId === addressToDelete.id}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </Styles.PageWrapper>
  );
};

export default AddressesView;
