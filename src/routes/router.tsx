import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ROUTE_PATH } from "@/helpers/constants/route";
import App from "@/App";
import Loading from "@/components/Loading";

const Login = lazy(() => import("@/pages/Login"));
const CMUOAuthCallback = lazy(() => import("@/pages/CmuOAuthCallback"));
const SelectDepartment = lazy(() => import("@/pages/SelectDepartment"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Section = lazy(() => import("@/pages/Section"));
const TQF3 = lazy(() => import("@/pages/TQF3"));
const Assignment = lazy(() => import("@/pages/Assignment"));
const Histogram = lazy(() => import("@/pages/Histogram"));
const Score = lazy(() => import("@/pages/Score"));
const Students = lazy(() => import("@/pages/Students"));
const Page404 = lazy(() => import("@/pages/Page404"));
// const PageError = lazy(() => import("@/pages/PageError"));

const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    ),
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
        element: (
          <Suspense fallback={<Loading />}>
            <SelectDepartment />
          </Suspense>
        ),
      },
      {
        path: ROUTE_PATH.DASHBOARD_INS,
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: `${ROUTE_PATH.COURSE}/:courseNo`,
        children: [
          {
            path: ROUTE_PATH.SECTION,
            children: [
              {
                path: "",
                element: (
                  <Suspense fallback={<Loading />}>
                    <Section />
                  </Suspense>
                ),
              },
              {
                path: `:sectionNo/${ROUTE_PATH.ASSIGNMENT}`,
                children: [
                  {
                    path: "",
                    element: (
                      <Suspense fallback={<Loading />}>
                        <Assignment />
                      </Suspense>
                    ),
                  },
                  {
                    path: `:name/${ROUTE_PATH.SCORE}`,
                    element: (
                      <Suspense fallback={<Loading />}>
                        <Score />
                      </Suspense>
                    ),
                  },
                  {
                    path: `:name/${ROUTE_PATH.STUDENTS}`,
                    element: (
                      <Suspense fallback={<Loading />}>
                        <Students />
                      </Suspense>
                    ),
                  },
                ],
              },
              {
                path: `:sectionNo/${ROUTE_PATH.HISTOGRAM}`,
                element: (
                  <Suspense fallback={<Loading />}>
                    <Histogram />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: ROUTE_PATH.TQF3,
            element: (
              <Suspense fallback={<Loading />}>
                <TQF3 />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<Loading />}>
            <Page404 />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
