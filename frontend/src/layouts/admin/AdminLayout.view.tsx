import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BottomNavigationAction,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InventoryIcon from "@mui/icons-material/Inventory";
import PersonIcon from "@mui/icons-material/Person";

import Styles from "./AdminLayout.styles";

const AdminLayoutView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Agenda", value: "/admin", icon: <CalendarMonthIcon /> },
    { label: "Maleta", value: "/admin/estoque", icon: <InventoryIcon /> },
    { label: "Perfil", value: "/admin/perfil", icon: <PersonIcon /> },
  ];

  return (
    <Styles.LayoutRoot>
      <Styles.DesktopSidebar variant="permanent">
        <List sx={{ mt: 2 }}>
          {navItems.map((item) => (
            <ListItem key={item.value} disablePadding>
              <ListItemButton
                selected={location.pathname === item.value}
                onClick={() => navigate(item.value)}
              >
                <ListItemIcon
                  sx={{
                    color:
                      location.pathname === item.value
                        ? "secondary.main"
                        : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Styles.DesktopSidebar>

      <Styles.MainContent>
        <Outlet />
      </Styles.MainContent>

      <Styles.MobileNav
        value={location.pathname}
        onChange={(_, newValue) => navigate(newValue)}
        showLabels
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.value}
            label={item.label}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </Styles.MobileNav>
    </Styles.LayoutRoot>
  );
};

export default AdminLayoutView;
