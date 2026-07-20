import { Suspense } from "react";
import { Outlet, useMatches } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Styles from "./MainLayout.styles";
import SysToolBar from "../components/sysToolBar/SysToolBar.view";
import SysFooter from "../components/sysFooter/SysFooter.view";
import { type AppRouteObjectType } from "../types/route.types";

const MainLayout = () => {
  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];
  const routeData = currentRoute?.handle as AppRouteObjectType["handle"];

  const showNavBar = routeData?.showNavBar ?? true;
  const showFooter = routeData?.showFooter ?? true;
  const toolBarVariant = routeData?.toolBarVariant ?? "public";

  return (
    <Styles.LayoutWrapper>
      <Styles.MainContent>
        <Suspense
          fallback={
            <Styles.LoadingContainer>
              <CircularProgress color="secondary" />
            </Styles.LoadingContainer>
          }
        >
          {showNavBar && <SysToolBar variant={toolBarVariant} />}
          <Outlet />
          {showFooter && <SysFooter />}
        </Suspense>
      </Styles.MainContent>
    </Styles.LayoutWrapper>
  );
};

export default MainLayout;
