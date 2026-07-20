import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Button,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTranslation } from "react-i18next";
import Styles from "./SysToolBar.styles";
import MobileMenu from "../sysDrawer/SysDrawer";
import SysIcon from "../icons/SysIcon";
import { useAuth } from "../../contexts/useAuth";

interface SysToolBarProps {
  variant?: "public" | "client";
}

const SysToolBar = ({ variant = "public" }: SysToolBarProps) => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const isClientVariant = variant === "client";

  const goToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };
  const goToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <AppBar
      position="fixed"
      color="primary"
      elevation={4}
      sx={
        isClientVariant
          ? { zIndex: (theme) => theme.zIndex.drawer + 1 }
          : undefined
      }
    >
      <Styles.ToolBarContainer>
        <Styles.LogoContainer>
          <SysIcon name="brand" width={"160px"} height={"160px"} />
        </Styles.LogoContainer>

        {isClientVariant ? (
          <Styles.ClientLogoutButton color="inherit" onClick={handleLogout}>
            Sair
          </Styles.ClientLogoutButton>
        ) : (
          <Styles.ButtonsContainer>
            <Button color="inherit" onClick={goToServices}>
              {t("toolBar.services")}
            </Button>
            <Button color="inherit" onClick={goToAbout}>
              {t("toolBar.about")}
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              color="secondary"
            >
              {t("toolBar.login")}
            </Button>
          </Styles.ButtonsContainer>
        )}

        {!isClientVariant && (
          <Styles.MenuItemsContainer>
            <MobileMenu
              trigger={
                <IconButton color="secondary">
                  <MenuIcon />
                </IconButton>
              }
              anchor="right"
            >
              <Styles.List component="nav">
                <ListItem disablePadding>
                  <ListItemButton component="a" onClick={goToServices}>
                    <ListItemText primary={t("toolBar.services")} />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton component="a" onClick={goToAbout}>
                    <ListItemText primary={t("toolBar.about")} />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton component={RouterLink} to="/login">
                    <ListItemText primary={t("toolBar.login")} />
                  </ListItemButton>
                </ListItem>
              </Styles.List>
            </MobileMenu>
          </Styles.MenuItemsContainer>
        )}
      </Styles.ToolBarContainer>
    </AppBar>
  );
};

export default SysToolBar;
