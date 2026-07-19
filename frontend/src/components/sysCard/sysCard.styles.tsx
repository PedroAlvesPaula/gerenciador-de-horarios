import {
  Card,
  CardMedia,
  styled,
  Typography,
  type TypographyProps,
} from "@mui/material";
import { Box } from "@mui/system";

const SysCardStyles = {
  Card: styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    borderRadius: (theme.shape.borderRadius as number) * 2,
    transition: "all 0.3s ease-in-out",
    cursor: "pointer",
    boxShadow: theme.shadows[3],

    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: theme.shadows[10],

      "& .MuiCardMedia-root": {
        transform: "scale(1.1)",
      },
      "& .action-text": {
        textDecoration: "underline",
      },
    },
  })),
  ImageContainer: styled(Box)({
    height: 192,
    width: "100%",
    overflow: "hidden",
  }),
  PriceContainer: styled(Box)({
    marginTop: 3,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }),
  StyledImage: styled(CardMedia)({
    height: "100%",
    width: "100%",
    transition: "transform 0.5s ease-in-out",
  }),
  Title: styled(Typography)({
    fontWeight: "bold",
  }) as typeof Typography,
  Description: styled(Typography)<TypographyProps>({
    marginTop: 1,
    minHeight: "40px",
  }) as typeof Typography,
  ActionText: styled(Typography)<TypographyProps>({
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  }) as typeof Typography,
  EntityCardRoot: styled(Card)(({ theme }) => ({
    padding: theme.spacing(2.5),
    borderRadius: (theme.shape.borderRadius as number) * 1.5,
    boxShadow: theme.shadows[1],
    borderLeft: `5px solid ${theme.palette.secondary.main}`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: theme.spacing(2),
  })),
  EntityCardHeader: styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(1.25),
  })),
  EntityCardContent: styled(Box)({
    minWidth: 0,
    flex: 1,
  }),
  EntityCardMeta: styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: theme.spacing(1.5),
  })),
  EntityCardActions: styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(1.5),
  })),
};

export default SysCardStyles;
