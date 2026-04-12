import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

export default {
    PageWrapper: styled(Box)(({ theme }) => ({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default, // Fundo creme
        padding: theme.spacing(2),
    })),

    LoginCard: styled(Card)(({ theme }) => ({
        width: '100%',
        maxWidth: '450px',
        padding: theme.spacing(6, 4),
        borderRadius: (theme.shape.borderRadius as number) * 2,
        boxShadow: theme.shadows[10], // Sombra difusa e elegante
        backgroundColor: theme.palette.background.paper, // Branco
    })),

    HeaderContainer: styled(Box)(({ theme }) => ({
        textAlign: 'center',
        marginBottom: theme.spacing(4),
    })),

    BrandName: styled(Typography)(({ theme }) => ({
        fontFamily: '"Playfair Display", serif',
        fontWeight: 'bold',
        color: theme.palette.primary.main,
        letterSpacing: 2,
        marginBottom: theme.spacing(1),
    })) as typeof Typography,

    Subtitle: styled(Typography)(({ theme }) => ({
        color: theme.palette.text.secondary,
        fontSize: '0.9rem',
    })) as typeof Typography,

    FormContainer: styled('form')(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(3),
    })),

    // Tipando o TextField do MUI
    Input: styled(TextField)({
        // Se quiser personalizar a borda dourada ao focar, faria aqui no '& .MuiOutlinedInput-root'
    }) as typeof TextField,

    SubmitButton: styled(Button)(({ theme }) => ({
        padding: theme.spacing(1.5),
        fontSize: '1rem',
        fontWeight: 'bold',
        marginTop: theme.spacing(2),
    })) as typeof Button,

    FooterContainer: styled(Box)(({ theme }) => ({
        marginTop: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing(1),
    })),

    TextLink: styled(Link)(({ theme }) => ({
        color: theme.palette.text.secondary,
        textDecoration: 'none',
        fontSize: '0.875rem',
        transition: 'color 0.2s',
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.secondary.main, // Dourado no hover
        }
    })) as typeof Link,
};