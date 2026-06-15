import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";

export default {
  PageWrapper: styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
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
    marginBottom: theme.spacing(1),
  })) as typeof Typography,
  AppointmentCard: styled(Card)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    borderRadius: (theme.shape.borderRadius as number) * 1.5,
    boxShadow: theme.shadows[2],
    borderLeft: `6px solid ${theme.palette.secondary.main}`,
    gap: theme.spacing(1.5),
  })),
  TimeRow: styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }),
  TimeText: styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    fontSize: "1.25rem",
    color: theme.palette.primary.main,
  })) as typeof Typography,
  StatusBadge: styled(Box)(({ theme }) => ({
    backgroundColor: "rgba(197, 160, 89, 0.15)",
    color: theme.palette.secondary.main,
    padding: theme.spacing(0.5, 1.5),
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    textTransform: "uppercase",
  })),
  ClientInfo: styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  }),
  ClientName: styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    color: theme.palette.text.primary,
    fontSize: "1.1rem",
  })) as typeof Typography,
  IconTextRow: styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    color: theme.palette.text.secondary,
    "& svg": {
      fontSize: "1.1rem",
      color: theme.palette.primary.main,
    },
  })),
};
