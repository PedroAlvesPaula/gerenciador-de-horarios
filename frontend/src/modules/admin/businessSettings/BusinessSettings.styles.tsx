import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

export default {
  CenteredPage: styled(Box)({
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),

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

  SectionTitle: styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2),
    fontWeight: 700,
  })) as typeof Typography,

  WeekGrid: styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: theme.spacing(2),
    [theme.breakpoints.up("lg")]: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  })),

  SettingCard: styled(Card)(({ theme }) => ({
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    borderRadius: (theme.shape.borderRadius as number) * 1.5,
    boxShadow: theme.shadows[2],
  })),

  CardHeader: styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  }),

  TimeFields: styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: theme.spacing(2),
  })),

  DayOffForm: styled(Card)(({ theme }) => ({
    padding: theme.spacing(2),
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: theme.spacing(2),
    boxShadow: theme.shadows[2],
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "180px minmax(220px, 1fr) auto",
      alignItems: "center",
    },
  })),

  DayOffList: styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(2),
  })),

  DayOffItem: styled(Card)(({ theme }) => ({
    padding: theme.spacing(1.5, 2),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(2),
    boxShadow: theme.shadows[1],
  })),
};
