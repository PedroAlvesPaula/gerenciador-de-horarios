import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import Drawer from "@mui/material/Drawer";

export default {
  LayoutRoot: styled(Box)(({ theme }) => ({
    display: "flex",
    minHeight: "100vh",
    backgroundColor: theme.palette.background.default,
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
    },
  })),

  MainContent: styled(Box)(({ theme }) => ({
    flexGrow: 1,
    overflowY: "auto",
    paddingBottom: "56px",
    [theme.breakpoints.up("md")]: {
      paddingBottom: 0,
    },
  })),

  MobileNav: styled(BottomNavigation)(({ theme }) => ({
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.appBar,

    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  })) as typeof BottomNavigation,

  DesktopSidebar: styled(Drawer)(({ theme }) => ({
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "block",
      width: "240px",
      flexShrink: 0,
      "& .MuiDrawer-paper": {
        width: "240px",
        boxSizing: "border-box",
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
      },
    },
  })) as typeof Drawer,
};
