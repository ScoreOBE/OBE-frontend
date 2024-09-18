import { createBrowserRouter } from "react-router-dom";
import {
  Login,
  CMUOAuthCallback,
  SelectDepartment,
  Dashboard,
  Section,
  Assignment,
  TQF3,
  Page404,
} from "@/pages";
import { ROUTE_PATH } from "@/helpers/constants/route";
import App from "@/App";
import PageError from "@/pages/PageError";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: ROUTE_PATH.LOGIN,
        element: <Login />,
        errorElement: <></>,
      },
      {
        path: ROUTE_PATH.CMU_OAUTH_CALLBACK,
        element: <CMUOAuthCallback />,
        errorElement: <></>,
      },
      {
        path: ROUTE_PATH.SELECTED_DEPARTMENT,
        element: <SelectDepartment />,
        errorElement: <></>,
      },
      {
        path: ROUTE_PATH.DASHBOARD_INS,
        element: <Dashboard />,
        errorElement: <></>,
      },
      {
        path: `${ROUTE_PATH.COURSE}/:courseNo`,
        children: [
          {
            path: ROUTE_PATH.SECTION,
            children: [
              {
                path: "",
                element: <Section />,
                errorElement: <></>,
              },
              {
                path: `:sectionNo/${ROUTE_PATH.ASSIGNMENT}`,
                element: <Assignment />,
                errorElement: <></>,
              },
            ],
          },
          {
            path: ROUTE_PATH.TQF3,
            element: <TQF3 />,
            errorElement: <></>,
          },
        ],
      },
      {
        path: "*",
        element: <Page404 />,
        errorElement: <></>,
      },
    ],
  },
]);

export default router;
