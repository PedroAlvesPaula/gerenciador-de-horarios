import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography, { type TypographyProps } from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";

interface ITransactionAmount extends TypographyProps {
  type: "income" | "expense";
}

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

  SummaryGrid: styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: theme.spacing(2),
  })),

  SummaryCard: styled(Card)<{ fullwidth?: boolean }>(
    ({ theme, fullwidth }) => ({
      padding: theme.spacing(2.5),
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(1),
      borderRadius: (theme.shape.borderRadius as number) * 1.5,
      boxShadow: theme.shadows[2],
      gridColumn: fullwidth ? "span 2" : "span 1",
      backgroundColor: theme.palette.background.paper,
    }),
  ),

  SummaryLabel: styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "bold",
  })) as typeof Typography,

  SummaryValue: styled(Typography)<{
    colorType?: "success" | "error" | "primary";
  }>(({ theme, colorType = "primary" }) => ({
    fontFamily: '"Playfair Display", serif',
    fontWeight: "bold",
    fontSize: "1.75rem",
    color:
      colorType === "success"
        ? theme.palette.success.main
        : colorType === "error"
          ? theme.palette.error.main
          : theme.palette.primary.main,
  })) as typeof Typography,

  SectionTitle: styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    color: theme.palette.text.primary,
    fontSize: "1.1rem",
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1),
  })) as typeof Typography,

  TransactionList: styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
  })),

  TransactionItem: styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
  })),

  TransactionInfo: styled(Box)({
    display: "flex",
    alignItems: "center",
    gap: "12px",
  }),

  TransactionIcon: styled(Avatar)<{ type: "income" | "expense" }>(
    ({ theme, type }) => ({
      backgroundColor:
        type === "income" ? "rgba(46, 125, 50, 0.1)" : "rgba(211, 47, 47, 0.1)",
      color:
        type === "income"
          ? theme.palette.success.main
          : theme.palette.error.main,
    }),
  ),

  TransactionDetails: styled(Box)({
    display: "flex",
    flexDirection: "column",
  }),

  TransactionDescription: styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    color: theme.palette.text.primary,
    fontSize: "0.95rem",
  })),

  TransactionDate: styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.75rem",
  })),

  TransactionAmount: styled(Typography, {
    shouldForwardProp: (prop) => prop != "income" && prop != "expense",
  })<ITransactionAmount>(({ theme, type }) => ({
    fontWeight: "bold",
    color:
      type === "income"
        ? theme.palette.success.main
        : theme.palette.text.primary,
    fontSize: "1rem",
  })),
};
