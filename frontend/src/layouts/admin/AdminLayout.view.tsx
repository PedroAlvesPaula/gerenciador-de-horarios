import { Outlet, useNavigate, useLocation } from "react-router-dom";
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
import SettingsIcon from "@mui/icons-material/Settings";
import ContentCutIcon from "@mui/icons-material/ContentCut";

import Styles from "./AdminLayout.styles";

const AdminLayoutView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: "Agenda",
      value: "/admin",
      icon: <CalendarMonthIcon color="inherit" />,
    },
    {
      label: "Serviços",
      value: "/admin/servicos",
      icon: <ContentCutIcon />,
    },
    {
      label: "Maleta",
      value: "/admin/estoque",
      icon: <InventoryIcon />,
    },
    // {
    //   // label: "Perfil",
    //   value: "/admin/perfil",
    //   icon: <PersonIcon />,
    // },
    {
      label: "Configurações",
      value: "/admin/configuracoes",
      icon: <SettingsIcon />,
    },
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
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ display: { xs: "none", md: "block" } }}
                />
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
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.value}
            aria-label={item.label}
            value={item.value}
            icon={item.icon}
            sx={{
              color: "#3D3021",
              "&.Mui-selected": {
                color: "#C5A059",
              },
              width: "100%",
            }}
          />
        ))}
      </Styles.MobileNav>
    </Styles.LayoutRoot>
  );
};

export default AdminLayoutView;
