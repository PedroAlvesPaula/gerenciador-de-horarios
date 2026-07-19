import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { InventoryItemData } from "../../services/inventory.service";
import { getInventoryStockLevel } from "../inventoryStatus";
import Styles from "../Inventory.styles";

interface InventoryCardProps {
  item: InventoryItemData;
  isDeleting: boolean;
  onChangeQuantity: (item: InventoryItemData, delta: number) => void;
  onEdit: (item: InventoryItemData) => void;
  onDelete: (item: InventoryItemData) => void;
}

const InventoryCard = ({
  item,
  isDeleting,
  onChangeQuantity,
  onEdit,
  onDelete,
}: InventoryCardProps) => {
  const stockLevel = getInventoryStockLevel(
    item.quantity,
    item.minRecommended,
  );

  return (
    <Styles.InventoryCard stocklevel={stockLevel}>
      <Styles.CardTopRow>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" component="h3" fontWeight={700}>
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mínimo recomendado: {item.minRecommended}
          </Typography>
        </Box>

        <Styles.CardActions>
          <Tooltip title="Editar item">
            <IconButton
              size="small"
              aria-label={`Editar ${item.name}`}
              onClick={() => onEdit(item)}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir item">
            <span>
              <IconButton
                size="small"
                color="error"
                aria-label={`Excluir ${item.name}`}
                disabled={isDeleting}
                onClick={() => onDelete(item)}
              >
                <DeleteOutlinedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Styles.CardActions>
      </Styles.CardTopRow>

      <Styles.QuantityControls>
        <Tooltip title="Diminuir quantidade">
          <span>
            <Styles.QuantityButton
              aria-label={`Diminuir quantidade de ${item.name}`}
              disabled={item.quantity === 0}
              onClick={() => onChangeQuantity(item, -1)}
            >
              <RemoveIcon />
            </Styles.QuantityButton>
          </span>
        </Tooltip>

        <Styles.QuantityValue aria-live="polite">
          {item.quantity}
        </Styles.QuantityValue>

        <Tooltip title="Aumentar quantidade">
          <Styles.QuantityButton
            aria-label={`Aumentar quantidade de ${item.name}`}
            onClick={() => onChangeQuantity(item, 1)}
          >
            <AddIcon />
          </Styles.QuantityButton>
        </Tooltip>
      </Styles.QuantityControls>
    </Styles.InventoryCard>
  );
};

export default InventoryCard;
