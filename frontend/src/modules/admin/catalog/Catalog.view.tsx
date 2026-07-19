import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { EntityCard } from "../../../components/sysCard/sysCard.view";
import { useCatalog } from "./Catalog.context";
import CatalogItemFormDialog from "./components/CatalogItemFormDialog";
import DeleteCatalogItemDialog from "./components/DeleteCatalogItemDialog";
import Styles from "./Catalog.styles";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const CatalogView = () => {
  const {
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
  } = useCatalog();

  return (
    <Styles.PageWrapper>
      <Styles.PageHeader>
        <Box>
          <Styles.PageTitle variant="h4" component="h1">
            Serviços
          </Styles.PageTitle>
          <Typography color="text.secondary">
            Gerencie os serviços exibidos aos clientes e usados no cálculo da
            agenda.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateForm}
        >
          Novo serviço
        </Button>
      </Styles.PageHeader>

      <Box component="section" aria-labelledby="catalog-list-title">
        <Styles.ListHeader>
          <Typography id="catalog-list-title" variant="h6" component="h2">
            Serviços cadastrados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {catalogItems.length} item(ns)
          </Typography>
        </Styles.ListHeader>

        {isLoading && (
          <Styles.CenteredState>
            <CircularProgress />
          </Styles.CenteredState>
        )}

        {!isLoading && errorMessage && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={reloadCatalog}>
                Tentar novamente
              </Button>
            }
          >
            {errorMessage}
          </Alert>
        )}

        {!isLoading && !errorMessage && catalogItems.length === 0 && (
          <Alert severity="info">Nenhum serviço cadastrado.</Alert>
        )}

        {!isLoading && !errorMessage && catalogItems.length > 0 && (
          <Styles.CatalogGrid>
            {catalogItems.map((item) => (
              <EntityCard
                key={item.id}
                title={item.name}
                leading={<ContentCutIcon color="secondary" />}
                meta={
                  <>
                    <Styles.Duration>
                      <AccessTimeIcon fontSize="small" />
                      {item.durationMinutes} minutos
                    </Styles.Duration>
                    <Typography fontWeight={700} color="secondary.main">
                      {currencyFormatter.format(item.price)}
                    </Typography>
                  </>
                }
                actions={[
                  {
                    label: "Editar",
                    icon: <EditOutlinedIcon />,
                    onClick: () => openEditForm(item),
                    ariaLabel: `Editar serviço ${item.name}`,
                  },
                  {
                    label: "Excluir",
                    icon: <DeleteOutlinedIcon />,
                    color: "error",
                    disabled: deletingItemId === item.id,
                    onClick: () => requestDelete(item),
                    ariaLabel: `Excluir serviço ${item.name}`,
                  },
                ]}
              >
                <Typography variant="body2" color="text.secondary">
                  {item.description || "Sem descrição informada."}
                </Typography>
              </EntityCard>
            ))}
          </Styles.CatalogGrid>
        )}
      </Box>

      {isFormOpen && (
        <CatalogItemFormDialog
          item={formItem}
          isSaving={isSaving}
          onClose={closeForm}
          onSubmit={saveService}
        />
      )}

      {itemToDelete && (
        <DeleteCatalogItemDialog
          item={itemToDelete}
          isDeleting={deletingItemId === itemToDelete.id}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </Styles.PageWrapper>
  );
};

export default CatalogView;
