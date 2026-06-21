import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useTheme } from "@mui/material/styles";

import Styles from "./Inventory.styles";
import { type InventoryItem, type ItemCategory } from "./Inventory.controller";

interface InventoryViewProps {
  items: InventoryItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  alertMessage: string | null;
}

const InventoryView = ({
  items,
  onUpdateQuantity,
  alertMessage,
}: InventoryViewProps) => {
  const theme = useTheme();

  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<ItemCategory, InventoryItem[]>,
  );

  const categoryLabels: Record<ItemCategory, string> = {
    Disposable: "Descartáveis",
    Cosmetic: "Cosméticos",
    Linen: "Retornáveis (Toalhas)",
  };

  const getStatusColor = (quantity: number, minThreshold: number) => {
    if (quantity === 0) return theme.palette.error.main;
    if (quantity <= minThreshold) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  return (
    <Styles.PageWrapper>
      <Styles.HeaderTitle variant="h5">Controle da Maleta</Styles.HeaderTitle>

      {alertMessage && (
        <Styles.AlertBanner>
          <WarningAmberIcon />
          <Typography variant="body2">{alertMessage}</Typography>
        </Styles.AlertBanner>
      )}

      {(Object.keys(groupedItems) as ItemCategory[]).map((category) => (
        <Styles.CategorySection key={category}>
          <Styles.CategoryTitle>
            {categoryLabels[category]}
          </Styles.CategoryTitle>

          {groupedItems[category].map((item) => (
            <Styles.ItemCard
              key={item.id}
              statuscolor={getStatusColor(item.quantity, item.minThreshold)}
            >
              <Styles.ItemInfo>
                <Styles.ItemName>{item.name}</Styles.ItemName>
                <Styles.ItemQuantity>
                  Mínimo recomendado: {item.minThreshold}
                </Styles.ItemQuantity>
              </Styles.ItemInfo>

              <Styles.ControlsContainer>
                <Styles.ControlButton
                  size="small"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  disabled={item.quantity === 0}
                >
                  <RemoveIcon fontSize="small" />
                </Styles.ControlButton>

                <Styles.QuantityDisplay>{item.quantity}</Styles.QuantityDisplay>

                <Styles.ControlButton
                  size="small"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                >
                  <AddIcon fontSize="small" />
                </Styles.ControlButton>
              </Styles.ControlsContainer>
            </Styles.ItemCard>
          ))}
        </Styles.CategorySection>
      ))}
    </Styles.PageWrapper>
  );
};

export default InventoryView;
