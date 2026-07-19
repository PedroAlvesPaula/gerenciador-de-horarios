import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import type { InventoryStockLevel } from "./inventoryStatus";

export default {
  PageWrapper: styled(Box)(({ theme }) => ({
    width: "100%",
    maxWidth: 1100,
    margin: "0 auto",
    padding: theme.spacing(2, 1.5, 10),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(3, 2, 10),
    },
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(5, 4),
    },
  })),

  PageHeader: styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(1.5),
  })),

  PageTitle: styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontFamily: '"Playfair Display", serif',
    fontWeight: 700,
  })) as typeof Typography,

  CenteredState: styled(Box)(({ theme }) => ({
    minHeight: theme.spacing(20),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  })),

  SectionsContainer: styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
  })),

  CategorySection: styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
  })),

  CategoryHeader: styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(0.75),
    borderBottom: `1px solid ${theme.palette.divider}`,
    "& h2": {
      color: theme.palette.primary.main,
      fontWeight: 700,
    },
  })),

  ItemsGrid: styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: theme.spacing(1.5),
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  })),

  InventoryCard: styled(Card, {
    shouldForwardProp: (property) => property !== "stocklevel",
  })<{ stocklevel: InventoryStockLevel }>(({ theme, stocklevel }) => {
    const borderColors: Record<InventoryStockLevel, string> = {
      critical: theme.palette.error.main,
      warning: theme.palette.warning.main,
      healthy: theme.palette.success.main,
    };

    return {
      padding: theme.spacing(1.5),
      borderRadius: (theme.shape.borderRadius as number) * 1.5,
      borderLeft: `6px solid ${borderColors[stocklevel]}`,
      boxShadow: theme.shadows[1],
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(1.5),
    };
  }),

  CardTopRow: styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing(1),
  })),

  CardActions: styled(Box)({
    display: "flex",
    flexShrink: 0,
  }),

  QuantityControls: styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "48px minmax(48px, 1fr) 48px",
    alignItems: "center",
    gap: theme.spacing(1),
  })),

  QuantityButton: styled(IconButton)(({ theme }) => ({
    width: 48,
    height: 48,
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.action.selected,
    },
  })) as typeof IconButton,

  QuantityValue: styled(Typography)(({ theme }) => ({
    minWidth: 48,
    textAlign: "center",
    color: theme.palette.primary.main,
    fontSize: "1.25rem",
    fontWeight: 700,
  })) as typeof Typography,

  DialogTitleRow: styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& .MuiDialogTitle-root": { flex: 1 },
  }),

  FormFields: styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    paddingTop: theme.spacing(1),
  })),

  NumericFields: styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  })),
};
