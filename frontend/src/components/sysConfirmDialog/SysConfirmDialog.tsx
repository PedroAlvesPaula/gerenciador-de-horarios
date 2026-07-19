import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

interface SysConfirmDialogProps {
  title: string;
  description: string;
  isLoading?: boolean;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}

const SysConfirmDialog = ({
  title,
  description,
  isLoading = false,
  confirmLabel = "Confirmar exclusão",
  onCancel,
  onConfirm,
}: SysConfirmDialogProps) => (
  <Dialog
    open
    fullWidth
    maxWidth="xs"
    aria-labelledby="confirm-dialog-title"
    onClose={() => {
      if (!isLoading) onCancel();
    }}
  >
    <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{description}</DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 2, pb: 2 }}>
      <Tooltip title="Cancelar">
        <span>
          <IconButton
            aria-label="Cancelar"
            disabled={isLoading}
            onClick={onCancel}
          >
            <CloseIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={confirmLabel}>
        <span>
          <IconButton
            color="error"
            aria-label={confirmLabel}
            disabled={isLoading}
            onClick={() => void onConfirm()}
          >
            {isLoading ? (
              <CircularProgress color="inherit" size={22} />
            ) : (
              <DeleteOutlinedIcon />
            )}
          </IconButton>
        </span>
      </Tooltip>
    </DialogActions>
  </Dialog>
);

export default SysConfirmDialog;
