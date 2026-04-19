import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Button, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTranslation } from 'react-i18next';
import Styles from './SysToolBar.styles';
import MobileMenu from '../sysDrawer/SysDrawer';
import SysIcon from '../icons/SysIcon';

const SysToolBar = () => {
    const { t } = useTranslation();

    const goToServices = () => {
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    };
    const goToAbout = () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <AppBar position="fixed" color="primary" elevation={4}>
            <Styles.ToolBarContainer>
                <Styles.LogoContainer>
                    <SysIcon
                        name='brand'
                        width={"160px"}
                        height={"160px"}
                    />
                </Styles.LogoContainer>

                <Styles.ButtonsContainer>
                    <Button color="inherit" onClick={goToServices}>
                        {t('toolBar.services')}
                    </Button>
                    <Button color="inherit" onClick={goToAbout}>
                        {t('toolBar.about')}
                    </Button>
                    <Button
                        component={RouterLink}
                        to="/login"
                        variant="contained"
                        color="secondary"
                    >
                        {t('toolBar.login')}
                    </Button>
                </Styles.ButtonsContainer>

                <Styles.MenuItemsContainer>
                    <MobileMenu trigger={
                        <IconButton color="secondary">
                            <MenuIcon />
                        </IconButton>
                    }
                        anchor='right'
                    >
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton component="a" href="#services">
                                    <ListItemText primary={t('toolBar.services')} />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </MobileMenu>
                </Styles.MenuItemsContainer>

            </Styles.ToolBarContainer>
        </AppBar>
    );
}

export default SysToolBar;