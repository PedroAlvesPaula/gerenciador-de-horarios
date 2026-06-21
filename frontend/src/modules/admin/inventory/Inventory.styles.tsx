import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";

export default {
  PageWrapper: styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: theme.spacing(4),
    },
  })),

  HeaderTitle: styled(Typography)(({ theme }) => ({
    fontFamily: '"Playfair Display", serif',
    fontWeight: "bold",
    color: theme.palette.primary.main,
  })) as typeof Typography,

  AlertBanner: styled(Box)(({ theme }) => ({
    backgroundColor: "rgba(211, 47, 47, 0.1)",
    borderLeft: `4px solid ${theme.palette.error.main}`,
    padding: theme.spacing(1.5, 2),
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
    color: theme.palette.error.main,
  })),

  CategorySection: styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
  })),

  CategoryTitle: styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: theme.palette.text.secondary,
    fontSize: "0.85rem",
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingBottom: theme.spacing(0.5),
  })) as typeof Typography,

  ItemCard: styled(Card)<{ statuscolor: string }>(({ theme, statuscolor }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(1.5, 2),
    borderRadius: (theme.shape.borderRadius as number) * 1.5,
    boxShadow: theme.shadows[1],
    borderLeft: `6px solid ${statuscolor}`,
  })),

  ItemInfo: styled(Box)({
    display: "flex",
    flexDirection: "column",
  }),

  ItemName: styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    color: theme.palette.text.primary,
    fontSize: "1.05rem",
  })) as typeof Typography,

  ItemQuantity: styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.85rem",
  })) as typeof Typography,

  ControlsContainer: styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    borderRadius: "9999px",
    padding: theme.spacing(0.5),
  })),

  ControlButton: styled(IconButton)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.background.default,
    },
    "&:disabled": {
      backgroundColor: "transparent",
      boxShadow: "none",
    },
  })) as typeof IconButton,

  QuantityDisplay: styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    minWidth: "24px",
    textAlign: "center",
    fontSize: "1.1rem",
    color: theme.palette.primary.main,
  })) as typeof Typography,
};
