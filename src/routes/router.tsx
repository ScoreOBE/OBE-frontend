import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ROUTE_PATH } from "@/helpers/constants/route";
import App from "@/App";
import Loading from "@/components/Loading";
import AdminDashboardTQF from "@/pages/AdminDashboardTQF";
import AdminDashboardPLO from "@/pages/AdminDashboardPLO";
import AdminDashboardCLO from "@/pages/AdminDashboardCLO";
import TQF5 from "@/pages/TQF5";
import StdDashboard from "@/pages/StdDashboard";

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
        path: ROUTE_PATH.INS_DASHBOARD,
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
          {
            path: ROUTE_PATH.TQF5,
            element: (
              <Suspense fallback={<Loading />}>
                <TQF5 />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: ROUTE_PATH.ADMIN_DASHBOARD,
        children: [
          {
            path: ROUTE_PATH.TQF,
            element: (
              <Suspense fallback={<Loading />}>
                <AdminDashboardTQF />
              </Suspense>
            ),
          },
          {
            path: ROUTE_PATH.PLO,
            element: (
              <Suspense fallback={<Loading />}>
                <AdminDashboardPLO />
              </Suspense>
            ),
          },
          {
            path: ROUTE_PATH.CLO,
            element: (
              <Suspense fallback={<Loading />}>
                <AdminDashboardCLO />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: ROUTE_PATH.STD_DASHBOARD,
        element: (
          <Suspense fallback={<Loading />}>
            <StdDashboard />
          </Suspense>
        ),
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
