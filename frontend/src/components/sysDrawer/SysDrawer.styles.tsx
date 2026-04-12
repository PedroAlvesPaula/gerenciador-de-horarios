import { Box, styled } from "@mui/material";

export default {
    MenuContent: styled(Box)(({ theme }) => ({
        width: 280,
        height: "100%",
        backgroundColor: theme.palette.background.default,
    }))
}