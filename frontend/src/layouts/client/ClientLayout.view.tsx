import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PlaceIcon from "@mui/icons-material/Place";
import Styles from "./ClientLayout.styles";

const navigationItems = [
  { label: "Início", value: "/client", icon: <DashboardIcon /> },
  {
    label: "Agendar",
    value: "/schedule/new",
    icon: <CalendarMonthIcon />,
  },
  {
    label: "Endereços",
    value: "/client/enderecos",
    icon: <PlaceIcon />,
  },
];

const ClientLayoutView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Styles.LayoutRoot>
      <Styles.DesktopSidebar variant="permanent">
        <List sx={{ mt: 2 }}>
          {navigationItems.map((item) => {
            const isSelected = location.pathname === item.value;

            return (
              <ListItem key={item.value} disablePadding>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => navigate(item.value)}
                >
                  <ListItemIcon
                    sx={{ color: isSelected ? "secondary.main" : "inherit" }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Styles.DesktopSidebar>

      <Styles.MainContent>
        <Outlet />
      </Styles.MainContent>

      <Styles.MobileNav
        value={location.pathname}
        onChange={(_, value: string) => navigate(value)}
        showLabels
      >
        {navigationItems.map((item) => (
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

export default ClientLayoutView;
