import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

export default {
    // ESTILOS HERO SECTION
    HeroWrapper: styled(Box)(({ theme }) => ({
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: 'url("https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=2000")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingTop: '80px',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: -1,
            backgroundColor: 'rgba(18, 18, 18, 0.85)',
            zIndex: 1
        }
    })),
    HeroContent: styled(Container)(() => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: 'relative',
        zIndex: 2,
    })) as typeof Container,
    HeroTitle1: styled(Typography)(({ theme }) => ({
        fontFamily: '"Playfair Display", serif',
        fontWeight: 'bold',
        color: theme.palette.common.white,
        marginBottom: theme.spacing(1),
        textAlign: "center",
        [theme.breakpoints.down('sm')]: { fontSize: '2.5rem' }
    })) as typeof Typography,
    HeroTitle2: styled(Typography)(({ theme }) => ({
        fontFamily: '"Playfair Display", serif',
        fontWeight: 'bold',
        color: theme.palette.secondary.main,
        marginBottom: theme.spacing(3),
        textAlign: "center",
        [theme.breakpoints.down('sm')]: { fontSize: '2.5rem' }
    })) as typeof Typography,
    HeroDescription: styled(Typography)(({ theme }) => ({
        color: theme.palette.grey[300],
        maxWidth: '600px',
        marginBottom: theme.spacing(5),
        textAlign: "center",
        lineHeight: 1.8,
    })) as typeof Typography,
    HeroButton: styled(Button)(({ theme }) => ({
        padding: theme.spacing(1.5, 5),
        fontSize: '1.1rem',
        fontWeight: 'bold',
    })) as typeof Button,

    // ESTILOS SERVIÇOS
    ServicesWrapper: styled(Box)(({ theme }) => ({
        scrollMarginTop: "80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
        boxShadow: "inset 0px 40px 30px -25px rgba(18, 18, 18, 0.85)",
        backgroundColor: theme.palette.background.paper,
        [theme.breakpoints.up("md")]: {
            minHeight: "calc(100vh - 80px)"
        }
    })),
    SectionHeaderContainer: styled(Box)(({ theme }) => ({
        textAlign: 'center',
        marginBottom: theme.spacing(8),
    })),
    OverlineText: styled(Typography)(({ theme }) => ({
        fontWeight: 'bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: theme.palette.secondary.main,
        textAlign: "center"
    })) as typeof Typography,
    SectionTitle: styled(Typography)(({ theme }) => ({
        fontFamily: '"Playfair Display", serif',
        fontWeight: 'bold',
        marginTop: theme.spacing(2),
        color: theme.palette.primary.main,
    })) as typeof Typography,

    // ESTILOS SOBRE
    AboutWrapper: styled(Box)(({ theme }) => ({
        position: "relative",
        scrollMarginTop: "80px",
        paddingTop: theme.spacing(10),
        paddingBottom: theme.spacing(10),
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        [theme.breakpoints.up("md")]: {
            minHeight: "calc(100vh - 80px)"
        },
        '&::before': {
            content: '""',
            position: 'absolute',
            top: "-1px",
            left: 0,
            right: 0,
            height: '60px',
            background: `linear-gradient(to bottom, ${theme.palette.background.paper} 0%, transparent 100%)`,
            pointerEvents: 'none',
        }
    })),
    AboutImageContainer: styled(Box)(({ theme }) => ({
        position: 'relative',
        borderRadius: (theme.shape.borderRadius as number) * 2,
        overflow: 'hidden',
        boxShadow: theme.shadows[4],
        height: '100%',
        minHeight: '400px',
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: `linear-gradient(to top right, ${theme.palette.secondary.main}22, transparent)`,
            pointerEvents: 'none'
        }
    })),
    AboutImage: styled('img')({
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    }),
    AboutContentContainer: styled(Box)(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        paddingLeft: theme.spacing(4),
        [theme.breakpoints.down('md')]: {
            paddingLeft: 0
        }
    })),
    AboutText: styled(Typography)(({ theme }) => ({
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(2),
        lineHeight: 1.8,
        textAlign: "justify"
    })) as typeof Typography,
    StatsContainer: styled(Box)(({ theme }) => ({
        display: 'flex',
        gap: theme.spacing(6),
        marginTop: theme.spacing(2),
        paddingTop: theme.spacing(2),
        borderTop: `1px solid ${theme.palette.divider}`,
    })),
    StatItem: styled(Box)({
        display: 'flex',
        flexDirection: 'column',
    }),
    StatNumber: styled(Typography)(({ theme }) => ({
        fontFamily: '"Playfair Display", serif',
        fontWeight: 'bold',
        color: theme.palette.secondary.main,
        fontSize: '2.5rem',
        textAlign: "center"
    })) as typeof Typography,
    StatLabel: styled(Typography)(({ theme }) => ({
        color: theme.palette.text.primary,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontSize: '0.8rem',
        textAlign: "center"
    })) as typeof Typography,
};