import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton } from '@mui/material';

export default {
    FooterWrapper: styled('footer')(({ theme }) => ({
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        borderTop: `2px solid ${theme.palette.secondary.main}`,
    })),

    BrandContainer: styled(Box)(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: theme.spacing(2),
    })),

    LogoText: styled(Typography)(({ theme }) => ({
        fontFamily: '"Playfair Display", serif',
        fontWeight: 'bold',
        color: theme.palette.secondary.main,
        letterSpacing: 2
    })) as typeof Typography,

    InfoText: styled(Typography)(({ theme }) => ({
        color: theme.palette.grey[400],
        maxWidth: '400px',
        lineHeight: 1.6
    })) as typeof Typography,

    SocialContainer: styled(Box)(({ theme }) => ({
        display: 'flex',
        gap: theme.spacing(2),
    })),

    SocialButton: styled(IconButton)(({ theme }) => ({
        color: theme.palette.secondary.main,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.primary.main,
        }
    })),

    CopyrightWrapper: styled(Box)(({ theme }) => ({
        marginTop: theme.spacing(2),
        paddingTop: theme.spacing(2),
        borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
        textAlign: 'center'
    })),

    CopyrightText: styled(Typography)(({ theme }) => ({
        color: theme.palette.grey[600],
        fontSize: '0.875rem'
    })) as typeof Typography
};