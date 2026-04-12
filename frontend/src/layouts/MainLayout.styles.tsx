import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export default {
    LayoutWrapper: styled(Box)({
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    }),
    MainContent: styled('main')({
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
    }),
    LoadingContainer: styled(Box)({
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
    })
};