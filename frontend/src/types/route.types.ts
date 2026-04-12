import {RouteObject} from "react-router-dom";

export type AppRouteObjectType = RouteObject & {
  handle?: {
    showNavBar?: boolean;
    showFooter?: boolean;
  };
};
