// src/modules/auth/Auth.styles.ts
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import loginImage from '../../assets/login/loginImage.jpeg';

export default {
    PageWrapper: styled(Box)(({ theme }) => ({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(2),
    })),

    AuthCard: styled(Box)(({ theme }) => ({
        display: 'flex',
        width: '100%',
        maxWidth: '1000px',
        minHeight: '600px',
        borderRadius: (theme.shape.borderRadius as number) * 2,
        boxShadow: theme.shadows[10],
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column-reverse',
            maxWidth: '450px',
        },
    })),

    ImageColumn: styled(Box)(({ theme }) => ({
        flex: 1.2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.primary.main,
        overflow: 'hidden',
        '& svg': {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        [theme.breakpoints.down('md')]: {
            height: '180px',
            flex: 'none',
        },
    })),

    FormColumn: styled(Box)(({ theme }) => ({
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: theme.spacing(6),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(4, 3),
        },
    })),

    HeaderContainer: styled(Box)(({ theme }) => ({
        textAlign: 'center',
        marginBottom: theme.spacing(4),
    })),

    Title: styled(Typography)(({ theme }) => ({
        fontFamily: '"Playfair Display", serif',
        fontWeight: 'bold',
        color: theme.palette.primary.main,
        letterSpacing: 1,
        marginBottom: theme.spacing(1),
    })) as typeof Typography,

    Subtitle: styled(Typography)(({ theme }) => ({
        color: theme.palette.text.secondary,
        fontSize: '0.875rem',
    })) as typeof Typography,

    FormContainer: styled('form')(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2.5),
    })),

    Input: styled(TextField)({}) as typeof TextField,

    SubmitButton: styled(Button)(({ theme }) => ({
        padding: theme.spacing(1.5),
        fontSize: '1rem',
        fontWeight: 'bold',
        marginTop: theme.spacing(1),
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
        cursor: 'pointer',
        transition: 'color 0.2s',
        '&:hover': {
            color: theme.palette.secondary.main,
        }
    })) as typeof Link,
};