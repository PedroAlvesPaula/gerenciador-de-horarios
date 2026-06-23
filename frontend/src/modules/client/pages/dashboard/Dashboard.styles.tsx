import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";

export default {
  PageWrapper: styled(Box)(({ theme }) => ({
    minHeight: "100vh",
    backgroundColor: theme.palette.background.default,
    paddingBottom: theme.spacing(12),
    [theme.breakpoints.up("md")]: {
      paddingBottom: theme.spacing(10),
    },
  })),

  HeaderContainer: styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(2, 4),
    },
  })),

  LogoText: styled(Typography)(({ theme }) => ({
    color: theme.palette.secondary.main,
    [theme.breakpoints.down("md")]: {
      fontSize: "1.25rem",
    },
  })) as typeof Typography,

  LogoutButton: styled(Button)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    fontWeight: "normal",
    padding: theme.spacing(1),
    "&:hover": {
      backgroundColor: "transparent",
      textDecoration: "underline",
    },
  })) as typeof Button,

  MainContent: styled(Box)(({ theme }) => ({
    maxWidth: "900px",
    margin: "0 auto",
    marginTop: theme.spacing(3),
    padding: theme.spacing(0, 2),
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(5),
    },
  })),

  WelcomeTitle: styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
  })) as typeof Typography,

  WelcomeSubtitle: styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
      marginBottom: theme.spacing(4),
    },
  })) as typeof Typography,

  EmptyStateCard: styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    textAlign: "center",
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4, 2),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(5, 4),
      marginBottom: theme.spacing(6),
    },
  })),

  EmptyStateTitle: styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
  })) as typeof Typography,

  EmptyStateSubtitle: styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
  })) as typeof Typography,

  ActionLink: styled(Button)(({ theme }) => ({
    color: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: "transparent",
      color: theme.palette.primary.main,
    },
  })) as typeof Button,

  SectionHeader: styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
    gap: theme.spacing(1),
  })),

  SectionTitle: styled(Typography)(() => ({})) as typeof Typography,

  HistoryCard: styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1.5),
    boxShadow: theme.shadows[1],
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(2),
    },
  })),

  ServiceName: styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontWeight: "bold",
    fontSize: "0.95rem",
  })) as typeof Typography,

  ServiceDate: styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.875rem",
  })) as typeof Typography,

  StatusBadge: styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.75rem",
    fontWeight: "bold",
    letterSpacing: "1px",
  })) as typeof Typography,

  FloatingButton: styled(Fab)(({ theme }) => ({
    position: "fixed",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.action.disabled,
    },
    bottom: theme.spacing(3),
    right: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      bottom: theme.spacing(4),
      right: theme.spacing(4),
    },
  })) as typeof Fab,
};
