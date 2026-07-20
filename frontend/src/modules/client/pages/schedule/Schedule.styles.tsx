import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default {
  PageWrapper: styled(Box)(({ theme }) => ({
    minHeight: "calc(100vh - 80px)",
    backgroundColor: theme.palette.background.default,
    display: "flex",
    flexDirection: "column",
  })),

  StepNavigation: styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  })),

  BackButton: styled(Button)(({ theme }) => ({
    color: theme.palette.primary.main,
    minWidth: "auto",
    padding: theme.spacing(1),
  })) as typeof Button,

  Title: styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
  })) as typeof Typography,

  MainContent: styled(Box)(({ theme }) => ({
    flex: 1,
    maxWidth: "800px",
    margin: "0 auto",
    width: "100%",
    padding: theme.spacing(3, 2),
    paddingBottom: theme.spacing(12),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(5, 4),
      paddingBottom: theme.spacing(5),
    },
  })),

  StepTitle: styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(3),
  })) as typeof Typography,

  SelectableCard: styled(Box, {
    shouldForwardProp: (prop) => prop !== "isSelected",
  })<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${isSelected ? theme.palette.secondary.main : "transparent"}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2.5),
    marginBottom: theme.spacing(2),
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    boxShadow: theme.shadows[1],
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    "&:hover": {
      boxShadow: theme.shadows[2],
    },
  })),

  ServiceInfo: styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.5),
  })),

  ServiceSelection: styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: theme.spacing(1),
    flexShrink: 0,
  })),

  AddressInfo: styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(1.25),
  })),

  SelectionSummary: styled(Box)(({ theme }) => ({
    position: "sticky",
    bottom: theme.spacing(1),
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.secondary.main}`,
    boxShadow: theme.shadows[3],
  })),

  CenteredState: styled(Box)(({ theme }) => ({
    minHeight: theme.spacing(10),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(2),
  })),

  TimeGrid: styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(3),

    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: theme.spacing(2),
    },
  })),

  TimeChip: styled(Button, {
    shouldForwardProp: (prop) => prop !== "isSelected",
  })<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1.5, 0),
    backgroundColor: isSelected
      ? theme.palette.primary.main
      : theme.palette.background.paper,
    color: isSelected
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary,
    border: `1px solid ${isSelected ? theme.palette.primary.main : "rgba(61, 48, 33, 0.15)"}`,
    boxShadow: isSelected ? theme.shadows[2] : "none",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: isSelected
        ? theme.palette.primary.main
        : "rgba(61, 48, 33, 0.05)",
    },
  })),

  DateInput: styled(TextField)(({ theme }) => ({
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  })),

  SummaryBox: styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  })),

  SummaryRow: styled(Box)(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
  })),

  SummaryAddress: styled(Typography)(() => ({
    textAlign: "right",
  })) as typeof Typography,

  BottomBar: styled(Box)(({ theme }) => ({
    position: "fixed",
    bottom: "56px",
    left: 0,
    width: "100%",
    backgroundColor: theme.palette.background.default,
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,

    [theme.breakpoints.up("md")]: {
      position: "static",
      boxShadow: "none",
      backgroundColor: "transparent",
      borderTop: "none",
      width: "100%",
      maxWidth: "800px",
      margin: "0 auto",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 4, 4),
    },
  })),

  ActionButton: styled(Button)(({ theme }) => ({
    width: "100%",
    minHeight: 48,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.background.default,
    },
    "&.Mui-disabled": {
      backgroundColor: theme.palette.background.default,
    },
    [theme.breakpoints.up("md")]: {
      width: "auto",
      minWidth: 240,
      maxWidth: 320,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
      },
      "&.Mui-disabled": {
        backgroundColor: theme.palette.action.disabledBackground,
      },
    },
  })) as typeof Button,
};
