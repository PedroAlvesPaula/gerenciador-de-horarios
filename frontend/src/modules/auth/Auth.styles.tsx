import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

export default {
  PageWrapper: styled(Box)(({ theme }) => ({
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.background.default,
    padding: 0,
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(2),
    },
  })),

  AuthCard: styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "100vh",
    borderRadius: 0,
    boxShadow: "none",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
      minHeight: "600px",
      maxWidth: "1000px",
      borderRadius: (theme.shape.borderRadius as number) * 2,
      boxShadow: theme.shadows[10],
    },
  })),

  ImageColumn: styled(Box)(({ theme }) => ({
    height: "25vh",
    minHeight: "160px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.primary.main,
    overflow: "hidden",
    "& svg": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    [theme.breakpoints.up("md")]: {
      height: "auto",
      flex: 1.2,
    },
  })),

  FormColumn: styled(Box)(({ theme }) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: theme.spacing(4, 3),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(6),
    },
  })),

  HeaderContainer: styled(Box)(({ theme }) => ({
    textAlign: "center",
    marginBottom: theme.spacing(4),
  })),

  Title: styled(Typography)(({ theme }) => ({
    fontFamily: '"Playfair Display", serif',
    fontWeight: "bold",
    color: theme.palette.primary.main,
    letterSpacing: 1,
    marginBottom: theme.spacing(1),
    fontSize: "1.75rem",
    [theme.breakpoints.up("md")]: {
      fontSize: "2.125rem",
    },
  })) as typeof Typography,

  Subtitle: styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.875rem",
  })) as typeof Typography,

  FormContainer: styled("form")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2.5),
  })),

  Input: styled(TextField)({}) as typeof TextField,

  SubmitButton: styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.8),
    fontSize: "1rem",
    fontWeight: "bold",
    marginTop: theme.spacing(1),

    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(1.5),
    },
  })) as typeof Button,

  FooterContainer: styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(2),
  })),

  TextLink: styled(Link)(({ theme }) => ({
    color: theme.palette.text.secondary,
    textDecoration: "none",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "color 0.2s",
    padding: theme.spacing(1),
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  })) as typeof Link,
};
