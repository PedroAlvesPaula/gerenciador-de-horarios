import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import type { AddressData } from "../../../services/addresses.service";

interface DeleteAddressDialogProps {
  address: AddressData;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteAddressDialog = ({
  address,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteAddressDialogProps) => (
  <Dialog
    open
    fullWidth
    maxWidth="xs"
    onClose={() => {
      if (!isDeleting) onCancel();
    }}
  >
    <DialogTitle>Excluir endereço?</DialogTitle>
    <DialogContent>
      <DialogContentText>
        O endereço {address.street}, {address.number} será removido. Esta ação
        não pode ser desfeita.
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

export default DeleteAddressDialog;
