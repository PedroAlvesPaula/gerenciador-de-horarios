import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

export default {
  // ESTILOS HERO SECTION
  HeroWrapper: styled(Box)(({ theme }) => ({
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    backgroundImage:
      'url("https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=2000")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    paddingTop: "60px",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: -1,
      backgroundColor: "rgba(18, 18, 18, 0.85)",
      zIndex: 1,
    },
    [theme.breakpoints.up("md")]: {
      paddingTop: "80px",
    },
  })),

  HeroContent: styled(Container)(() => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    zIndex: 2,
  })) as typeof Container,

  HeroTitle1: styled(Typography)(({ theme }) => ({
    fontFamily: '"Playfair Display", serif',
    fontWeight: "bold",
    color: theme.palette.common.white,
    marginBottom: theme.spacing(1),
    textAlign: "center",
    fontSize: "2.5rem",
    lineHeight: 1.2,
    [theme.breakpoints.up("sm")]: {
      fontSize: "3.5rem",
    },
  })) as typeof Typography,

  HeroTitle2: styled(Typography)(({ theme }) => ({
    fontFamily: '"Playfair Display", serif',
    fontWeight: "bold",
    color: theme.palette.secondary.main,
    marginBottom: theme.spacing(3),
    textAlign: "center",
    fontSize: "2.5rem",
    lineHeight: 1.2,
    [theme.breakpoints.up("sm")]: {
      fontSize: "3.5rem",
    },
  })) as typeof Typography,

  HeroDescription: styled(Typography)(({ theme }) => ({
    color: theme.palette.grey[300],
    maxWidth: "600px",
    marginBottom: theme.spacing(4),
    textAlign: "center",
    lineHeight: 1.6,
    fontSize: "1rem",
    [theme.breakpoints.up("md")]: {
      marginBottom: theme.spacing(5),
      lineHeight: 1.8,
      fontSize: "1.1rem",
    },
  })) as typeof Typography,

  HeroButton: styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.8, 4),
    fontSize: "1rem",
    fontWeight: "bold",
    width: "100%",
    maxWidth: "300px",
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(1.5, 5),
      fontSize: "1.1rem",
      width: "auto",
    },
  })) as typeof Button,

  // ESTILOS SERVIÇOS
  ServicesWrapper: styled(Box)(({ theme }) => ({
    scrollMarginTop: "60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    boxShadow: "inset 0px 40px 30px -25px rgba(18, 18, 18, 0.85)",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      minHeight: "calc(100vh - 80px)",
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
      scrollMarginTop: "80px",
    },
  })),

  SectionHeaderContainer: styled(Box)(({ theme }) => ({
    textAlign: "center",
    marginBottom: theme.spacing(5),
    [theme.breakpoints.up("md")]: {
      marginBottom: theme.spacing(8),
    },
  })),

  OverlineText: styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: theme.palette.secondary.main,
    textAlign: "center",
    fontSize: "0.85rem",
  })) as typeof Typography,

  SectionTitle: styled(Typography)(({ theme }) => ({
    fontFamily: '"Playfair Display", serif',
    fontWeight: "bold",
    marginTop: theme.spacing(1),
    color: theme.palette.primary.main,
    fontSize: "2rem",
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(2),
      fontSize: "2.5rem",
    },
  })) as typeof Typography,

  // ESTILOS SOBRE
  AboutWrapper: styled(Box)(({ theme }) => ({
    position: "relative",
    scrollMarginTop: "60px",
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    backgroundColor: theme.palette.background.default,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-1px",
      left: 0,
      right: 0,
      height: "60px",
      background: `linear-gradient(to bottom, ${theme.palette.background.paper} 0%, transparent 100%)`,
      pointerEvents: "none",
    },
    [theme.breakpoints.up("md")]: {
      minHeight: "calc(100vh - 80px)",
      paddingTop: theme.spacing(10),
      paddingBottom: theme.spacing(10),
      scrollMarginTop: "80px",
    },
  })),

  AboutImageContainer: styled(Box)(({ theme }) => ({
    position: "relative",
    borderRadius: (theme.shape.borderRadius as number) * 2,
    overflow: "hidden",
    boxShadow: theme.shadows[4],
    width: "100%",
    height: "300px",
    marginBottom: theme.spacing(4),
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(to top right, ${theme.palette.secondary.main}22, transparent)`,
      pointerEvents: "none",
    },
    [theme.breakpoints.up("md")]: {
      height: "100%",
      minHeight: "400px",
      marginBottom: 0,
    },
  })),

  AboutImage: styled("img")({
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  }),

  AboutContentContainer: styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
    paddingLeft: 0,
    [theme.breakpoints.up("md")]: {
      paddingLeft: theme.spacing(4),
    },
  })),

  AboutText: styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
    lineHeight: 1.6,
    textAlign: "justify",
    [theme.breakpoints.up("md")]: {
      lineHeight: 1.8,
    },
  })) as typeof Typography,

  StatsContainer: styled(Box)(({ theme }) => ({
    display: "flex",
    gap: theme.spacing(3),
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(3),
    borderTop: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.up("md")]: {
      gap: theme.spacing(6),
      justifyContent: "flex-start",
      flexWrap: "nowrap",
    },
  })),

  StatItem: styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.up("md")]: {
      alignItems: "flex-start",
    },
  })),

  StatNumber: styled(Typography)(({ theme }) => ({
    fontFamily: '"Playfair Display", serif',
    fontWeight: "bold",
    color: theme.palette.secondary.main,
    fontSize: "2rem",
    textAlign: "center",
    [theme.breakpoints.up("md")]: {
      fontSize: "2.5rem",
      textAlign: "left",
    },
  })) as typeof Typography,

  StatLabel: styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: "0.75rem",
    textAlign: "center",
    [theme.breakpoints.up("md")]: {
      fontSize: "0.8rem",
      textAlign: "left",
    },
  })) as typeof Typography,
};
