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

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: ROUTE_PATH.LOGIN,
        element: <Login />,
      },
      {
        path: ROUTE_PATH.CMU_OAUTH_CALLBACK,
        element: <CMUOAuthCallback />,
      },
      {
        path: ROUTE_PATH.SELECTED_DEPARTMENT,
        element: <SelectDepartment />,
      },
      {
        path: ROUTE_PATH.DASHBOARD_INS,
        element: <Dashboard />,
      },
      {
        path: `${ROUTE_PATH.COURSE}/:courseNo`,
        errorElement: <Page404 />,
        children: [
          {
            path: ROUTE_PATH.SECTION,
            children: [
              {
                path: "",
                element: <Section />,
              },
              {
                path: `:sectionNo/${ROUTE_PATH.ASSIGNMENT}`,
                element: <Assignment />,
              },
            ],
          },
          {
            path: ROUTE_PATH.TQF3,
            element: <TQF3 />,
          },
        ],
      },
      {
        path: "*",
        element: <Page404 />,
      },
    ],
  },
]);

export default router;
