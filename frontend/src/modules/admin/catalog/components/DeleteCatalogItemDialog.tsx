import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import type { CatalogItemData } from "../../services/catalog.service";

interface DeleteCatalogItemDialogProps {
  item: CatalogItemData;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteCatalogItemDialog = ({
  item,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteCatalogItemDialogProps) => (
  <Dialog
    open
    fullWidth
    maxWidth="xs"
    onClose={() => {
      if (!isDeleting) onCancel();
    }}
  >
    <DialogTitle>Excluir serviço?</DialogTitle>
    <DialogContent>
      <DialogContentText>
        O serviço “{item.name}” será removido do catálogo. Serviços vinculados
        a agendamentos não podem ser excluídos, preservando o histórico.
      </DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onCancel} disabled={isDeleting}>
        Cancelar
      </Button>
      <Button
        color="error"
        variant="contained"
        disabled={isDeleting}
        onClick={() => void onConfirm()}
        startIcon={
          isDeleting ? <CircularProgress color="inherit" size={18} /> : undefined
        }
      >
        Excluir
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteCatalogItemDialog;
