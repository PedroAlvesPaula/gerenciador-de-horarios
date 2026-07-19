import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import SysConfirmDialog from "../../../components/sysConfirmDialog/SysConfirmDialog";
import { useInventoryController } from "./useInventoryController";
import {
  inventoryCategories,
  inventoryCategoryLabels,
} from "./inventory.constants";
import InventoryCard from "./components/InventoryCard";
import InventoryItemFormDialog from "./components/InventoryItemFormDialog";
import Styles from "./Inventory.styles";

const InventoryView = () => {
  const {
    items,
    isLoading,
    errorMessage,
    isOnline,
    pendingChanges,
    criticalItemsCount,
    outOfStockItemsCount,
    isSaving,
    deletingItemId,
    formItem,
    isFormOpen,
    itemToDelete,
    reloadInventory,
    updateQuantity,
    openCreateForm,
    openEditForm,
    closeForm,
    saveItem,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useInventoryController();

  return (
    <Styles.PageWrapper>
      <Styles.PageHeader>
        <Box>
          <Styles.PageTitle variant="h4" component="h1">
            Controle da Maleta
          </Styles.PageTitle>
          <Typography color="text.secondary">
            Acompanhe os materiais usados durante os atendimentos.
          </Typography>
        </Box>
        <Tooltip title="Novo item">
          <IconButton
            color="primary"
            size="large"
            aria-label="Cadastrar novo item"
            onClick={openCreateForm}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Styles.PageHeader>

      {!isOnline && (
        <Alert severity="warning">
          Você está offline. Alterações de quantidade serão sincronizadas
          automaticamente quando a conexão voltar.
        </Alert>
      )}

      {pendingChanges > 0 && (
        <Alert severity="info">
          {pendingChanges} alteração(ões) aguardando sincronização.
        </Alert>
      )}

      {criticalItemsCount > 0 && (
        <Alert severity="error">
          Atenção: {outOfStockItemsCount > 0
            ? `${outOfStockItemsCount} item(ns) esgotado(s). `
            : ""}
          {criticalItemsCount - outOfStockItemsCount > 0
            ? `${criticalItemsCount - outOfStockItemsCount} item(ns) abaixo do mínimo recomendado.`
            : ""}
        </Alert>
      )}

      {isLoading && (
        <Styles.CenteredState>
          <CircularProgress aria-label="Carregando estoque" />
        </Styles.CenteredState>
      )}

      {!isLoading && errorMessage && (
        <Alert
          severity="error"
          action={
            <Tooltip title="Tentar novamente">
              <IconButton
                color="inherit"
                size="small"
                aria-label="Tentar carregar o estoque novamente"
                onClick={() => void reloadInventory()}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          }
        >
          {errorMessage}
        </Alert>
      )}

      {!isLoading && !errorMessage && (
        <Styles.SectionsContainer>
          {inventoryCategories.map((category) => {
            const categoryItems = items.filter(
              (item) => item.category === category,
            );

            return (
              <Styles.CategorySection
                key={category}
                component="section"
                aria-labelledby={`category-${category}`}
              >
                <Styles.CategoryHeader>
                  <Typography
                    id={`category-${category}`}
                    variant="h6"
                    component="h2"
                  >
                    {inventoryCategoryLabels[category]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {categoryItems.length} item(ns)
                  </Typography>
                </Styles.CategoryHeader>

                {categoryItems.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhum item cadastrado nesta categoria.
                  </Typography>
                ) : (
                  <Styles.ItemsGrid>
                    {categoryItems.map((item) => (
                      <InventoryCard
                        key={item.id}
                        item={item}
                        isDeleting={deletingItemId === item.id}
                        onChangeQuantity={updateQuantity}
                        onEdit={openEditForm}
                        onDelete={requestDelete}
                      />
                    ))}
                  </Styles.ItemsGrid>
                )}
              </Styles.CategorySection>
            );
          })}
        </Styles.SectionsContainer>
      )}

      {isFormOpen && (
        <InventoryItemFormDialog
          item={formItem}
          isSaving={isSaving}
          onClose={closeForm}
          onSubmit={saveItem}
        />
      )}

      {itemToDelete && (
        <SysConfirmDialog
          title="Excluir item?"
          description={`O item “${itemToDelete.name}” será excluído permanentemente do estoque.`}
          isLoading={deletingItemId === itemToDelete.id}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </Styles.PageWrapper>
  );
};

export default InventoryView;
