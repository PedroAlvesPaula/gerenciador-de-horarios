import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default {
  PageWrapper: styled(Box)(({ theme }) => ({
    minHeight: "100vh",
    backgroundColor: theme.palette.background.default,
    display: "flex",
    flexDirection: "column",
  })),

  Header: styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    color: theme.palette.primary.contrastText,

    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(3, 4),
    },
  })),

  BackButton: styled(Button)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    minWidth: "auto",
    padding: theme.spacing(1),
  })) as typeof Button,

  Title: styled(Typography)(() => ({
    color: "inherit",
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
    alignItems: "center",
  })),

  BottomBar: styled(Box)(({ theme }) => ({
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,

    [theme.breakpoints.up("md")]: {
      position: "static",
      boxShadow: "none",
      backgroundColor: "transparent",
      padding: theme.spacing(4, 0, 0, 0),
    },
  })),
};
