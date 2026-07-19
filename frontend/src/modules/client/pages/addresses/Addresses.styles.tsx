import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default {
  PageWrapper: styled(Box)(({ theme }) => ({
    width: "100%",
    maxWidth: 1000,
    margin: "0 auto",
    padding: theme.spacing(3, 2, 10),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(5, 4),
    },
  })),

  PageHeader: styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  })),

  PageTitle: styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontFamily: '"Playfair Display", serif',
    fontWeight: 700,
  })) as typeof Typography,

  CenteredState: styled(Box)(({ theme }) => ({
    minHeight: theme.spacing(24),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  })),

  AddressGrid: styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  })),

  FormFields: styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    paddingTop: theme.spacing(1),
  })),

  ShortFields: styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  })),
};
