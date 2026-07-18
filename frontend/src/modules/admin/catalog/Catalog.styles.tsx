import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

export default {
  PageWrapper: styled(Box)(({ theme }) => ({
    width: "100%",
    maxWidth: 1100,
    margin: "0 auto",
    padding: theme.spacing(3, 2, 10),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(4),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(5, 4),
    },
  })),

  PageTitle: styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontFamily: '"Playfair Display", serif',
    fontWeight: 700,
  })) as typeof Typography,

  ContentGrid: styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: theme.spacing(4),
    alignItems: "start",
    [theme.breakpoints.up("lg")]: {
      gridTemplateColumns: "minmax(320px, 0.8fr) minmax(420px, 1.2fr)",
    },
  })),

  FormCard: styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2.5),
    borderRadius: (theme.shape.borderRadius as number) * 1.5,
    boxShadow: theme.shadows[2],
    [theme.breakpoints.up("lg")]: {
      position: "sticky",
      top: theme.spacing(3),
    },
  })),

  FormFields: styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  })),

  NumericFields: styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  })),

  ListHeader: styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
  })),

  CenteredState: styled(Box)(({ theme }) => ({
    minHeight: theme.spacing(20),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  })),

  CatalogList: styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  })),

  ServiceCard: styled(Card)(({ theme }) => ({
    padding: theme.spacing(2.5),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    borderRadius: (theme.shape.borderRadius as number) * 1.5,
    boxShadow: theme.shadows[1],
    borderLeft: `5px solid ${theme.palette.secondary.main}`,
  })),

  ServiceMeta: styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(2),
  })),

  Duration: styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.75),
    color: theme.palette.text.secondary,
    fontSize: "0.875rem",
  })),
};
