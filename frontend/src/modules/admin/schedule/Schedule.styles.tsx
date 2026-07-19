import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

export default {
  PageWrapper: styled(Box)(({ theme }) => ({
    width: "100%",
    maxWidth: 1100,
    margin: "0 auto",
    padding: theme.spacing(2, 1.5, 10),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
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

  AppointmentsGrid: styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  })),

  CardDetails: styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.75),
    marginTop: theme.spacing(1),
  })),

  IconTextRow: styled(Box)(({ theme }) => ({
    minWidth: 0,
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(0.75),
    color: theme.palette.text.secondary,
    overflowWrap: "anywhere",
    "& svg": {
      flexShrink: 0,
      marginTop: 2,
      fontSize: "1rem",
      color: theme.palette.primary.main,
    },
  })),

  DialogTitleRow: styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& .MuiDialogTitle-root": {
      flex: 1,
    },
  }),

  FormFields: styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    paddingTop: theme.spacing(1),
  })),

  DateTimeFields: styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  })),
};
