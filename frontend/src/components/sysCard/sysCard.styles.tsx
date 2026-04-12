import { Card, CardMedia, styled, Typography } from "@mui/material";
import { Box, TypographyProps } from "@mui/system";

const SysCardStyles = {
    Card: styled(Card)(({ theme }) => ({
        backgroundColor: theme.palette.background.default,
        borderRadius: (theme.shape.borderRadius as number) * 2,
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        boxShadow: theme.shadows[3],

        '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: theme.shadows[10],

            '& .MuiCardMedia-root': {
                transform: 'scale(1.1)',
            },
            '& .action-text': {
                textDecoration: 'underline',
            }
        }
    })),
    ImageContainer: styled(Box)({
        height: 192,
        width: '100%',
        overflow: 'hidden',
    }),
    PriceContainer: styled(Box)({
        marginTop: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }),
    StyledImage: styled(CardMedia)({
        height: '100%',
        width: '100%',
        transition: 'transform 0.5s ease-in-out',
    }),
    Title: styled(Typography)({
        fontWeight: 'bold'
    }) as typeof Typography,
    Description: styled(Typography)<TypographyProps>({
        marginTop: 1,
        minHeight: '40px'
    }) as typeof Typography,
    ActionText: styled(Typography)<TypographyProps>({
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: 0.5
    }) as typeof Typography,
}

export default SysCardStyles;
