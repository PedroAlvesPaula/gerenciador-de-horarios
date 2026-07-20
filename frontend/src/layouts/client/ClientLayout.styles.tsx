import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import Drawer from "@mui/material/Drawer";

export default {
  LayoutRoot: styled(Box)(({ theme }) => ({
    display: "flex",
    minHeight: "100vh",
    boxSizing: "border-box",
    paddingTop: "80px",
    backgroundColor: theme.palette.background.default,
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
    },
  })),

  MainContent: styled(Box)(({ theme }) => ({
    flexGrow: 1,
    minWidth: 0,
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
    backgroundColor: theme.palette.background.default,
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
        top: "80px",
        height: "calc(100% - 80px)",
        boxSizing: "border-box",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        borderRight: `1px solid ${theme.palette.divider}`,
        "& .MuiListItemIcon-root": {
          color: "inherit",
        },
        "& .MuiListItemButton-root": {
          color: "inherit",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.06),
          },
          "&.Mui-selected": {
            color: theme.palette.text.primary,
            backgroundColor: alpha(theme.palette.secondary.main, 0.16),
            "&:hover": {
              backgroundColor: alpha(theme.palette.secondary.main, 0.22),
            },
          },
        },
      },
    },
  })) as typeof Drawer,
};
