import Box from "@mui/material/Box";
import Typography, { type TypographyProps } from "@mui/material/Typography";
import { styled } from "@mui/system";
import { Toolbar } from "@mui/material";

export default {
    ToolBarContainer: styled(Toolbar)({
        display: "flex",
        justifyContent: "space-between",
        height: "80px"
    }),
    LogoContainer: styled(Box)(({ }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        '& svg': {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        }
    })),
    Initials: styled(Typography)<TypographyProps>(({ theme }) => ({
        color: theme.palette.secondary.main,
        fontWeight: "bold",
        letterSpacing: 2,
        borderBottom: `1px solid ${theme.palette.secondary.main}`,
    })),
    TextBarber: styled(Typography)<TypographyProps>(({ }) => ({
        letterSpacing: 3,
        textTransform: 'uppercase',
        fontSize: '10px'
    })),
    ButtonsContainer: styled(Box)(({ theme }) => ({
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(4),
        [theme.breakpoints.down("sm")]: {
            display: "none"
        }
    })),
    MenuItemsContainer: styled(Box)(({ theme }) => ({
        display: "flex",
        [theme.breakpoints.up("sm")]: {
            display: "none"
        }
    }))

};