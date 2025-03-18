import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ROUTE_PATH } from "@/helpers/constants/route";
import App from "@/App";
import Loading from "@/components/Loading/Loading";
import { isMobile } from "@/helpers/functions/function";

const Login = lazy(() => import("@/pages/Login"));
const CmuEntraIDCallback = lazy(() => import("@/pages/CmuEntraIDCallback"));
const CourseSyllabusDashboard = lazy(
  () => import("@/pages/CourseSyllabus/CourseSyllabusDashboard")
);
const CourseSyllabus = lazy(
  () => import("@/pages/CourseSyllabus/CourseSyllabus")
);
const CourseSyllabusPDF = lazy(
  () => import("@/pages/CourseSyllabus/CourseSyllabusPDF")
);
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Section = lazy(() => import("@/pages/Section"));
const Assignment = lazy(() => import("@/pages/Score/Assignment"));
const Score = lazy(() => import("@/pages/Score/Score"));
const Students = lazy(() => import("@/pages/Score/Students"));
const Histogram = lazy(() => import("@/pages/Score/Histogram"));
const AllAssignment = lazy(() => import("@/pages/AllAssignment"));
const OneAssignment = lazy(() => import("@/pages/OneAssignment"));
const Roster = lazy(() => import("@/pages/Roster"));
const TQF3 = lazy(() => import("@/pages/TQF/TQF3"));
const TQF5 = lazy(() => import("@/pages/TQF/TQF5"));
const AdminDashboardTQF = lazy(
  () => import("@/pages/AdminDashboard/AdminDashboardTQF")
);
const AdminDashboardCLO = lazy(
  () => import("@/pages/AdminDashboard/AdminDashboardCLO")
);
const AdminDashboardPLO = lazy(
  () => import("@/pages/AdminDashboard/AdminDashboardPLO")
);
const StdDashboard = lazy(() => import("@/pages/Student/StdDashboard"));
const StdOverallPLO = lazy(() => import("@/pages/Student/StdOverallPLO"));
const StdAssignment = lazy(() => import("@/pages/Student/StdAssignment"));
const StdScore = lazy(() => import("@/pages/Student/StdScore"));
const StdChart = lazy(() => import("@/pages/Student/StdChart"));
const StdCLO = lazy(() => import("@/pages/Student/StdCLO"));
const StdPLO = lazy(() => import("@/pages/Student/StdPLO"));
// const Skills = lazy(() => import("@/pages/Skills"));
const Page404 = lazy(() => import("@/pages/Page404"));
const NotAvailablePage = lazy(() => import("@/pages/NotAvailable"));

const loadingPage = (
  <div className="flex h-screen w-screen">
    <Loading />
  </div>
);

const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={loadingPage}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: ROUTE_PATH.LOGIN,
        element: <Login />,
      },
      {
        path: ROUTE_PATH.CMU_ENTRAID_CALLBACK,
        element: <CmuEntraIDCallback />,
      },
      {
        path: ROUTE_PATH.COURSE_SYLLABUS,
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={loadingPage}>
                <CourseSyllabusDashboard />
              </Suspense>
            ),
          },
          {
            path: ":courseNo",
            element: (
              <Suspense fallback={loadingPage}>
                <CourseSyllabus />
              </Suspense>
            ),
          },
          {
            path: `${ROUTE_PATH.PDF}/:tqf3`,
            element: (
              <Suspense fallback={loadingPage}>
                <CourseSyllabusPDF />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: ROUTE_PATH.INS_DASHBOARD,
        element: (
          <Suspense fallback={loadingPage}>
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
                  <Suspense fallback={loadingPage}>
                    <Section />
                  </Suspense>
                ),
              },
              {
                path: `:sectionNo/${ROUTE_PATH.EVALUATION}`,
                children: [
                  {
                    path: "",
                    element: (
                      <Suspense fallback={loadingPage}>
                        <Assignment />
                      </Suspense>
                    ),
                  },
                  {
                    path: `:name/${ROUTE_PATH.SCORE}`,
                    element: (
                      <Suspense fallback={loadingPage}>
                        <Score />
                      </Suspense>
                    ),
                  },
                  {
                    path: `:name/${ROUTE_PATH.STUDENTS}`,
                    element: (
                      <Suspense fallback={loadingPage}>
                        <Students />
                      </Suspense>
                    ),
                  },
                ],
              },
              {
                path: `:sectionNo/${ROUTE_PATH.HISTOGRAM}`,
                element: (
                  <Suspense fallback={loadingPage}>
                    {!isMobile ? <Histogram /> : <NotAvailablePage />}
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: ROUTE_PATH.EVALUATION,
            children: [
              {
                path: "",
                element: (
                  <Suspense fallback={loadingPage}>
                    <AllAssignment />
                  </Suspense>
                ),
              },
              {
                path: ":name",
                element: (
                  <Suspense fallback={loadingPage}>
                    <OneAssignment />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: ROUTE_PATH.ROSTER,
            element: (
              <Suspense fallback={loadingPage}>
                <Roster />
              </Suspense>
            ),
          },
          // {
          //   path: ROUTE_PATH.SKILLS,
          //   element: (
          //     <Suspense fallback={loadingPage}>
          //       <Skills />
          //     </Suspense>
          //   ),
          // },
          {
            path: ROUTE_PATH.TQF3,
            element: (
              <Suspense fallback={loadingPage}>
                {!isMobile ? <TQF3 /> : <NotAvailablePage />}
              </Suspense>
            ),
          },
          {
            path: ROUTE_PATH.TQF5,
            element: (
              <Suspense fallback={loadingPage}>
                {!isMobile ? <TQF5 /> : <NotAvailablePage />}
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
              <Suspense fallback={loadingPage}>
                {!isMobile ? <AdminDashboardTQF /> : <NotAvailablePage />}
              </Suspense>
            ),
          },
          {
            path: ROUTE_PATH.CLO,
            element: (
              <Suspense fallback={loadingPage}>
                {!isMobile ? <AdminDashboardCLO /> : <NotAvailablePage />}
              </Suspense>
            ),
          },
          {
            path: ROUTE_PATH.PLO,
            element: (
              <Suspense fallback={loadingPage}>
                {!isMobile ? <AdminDashboardPLO /> : <NotAvailablePage />}
              </Suspense>
            ),
          },
        ],
      },
      {
        path: ROUTE_PATH.STD_DASHBOARD,
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={loadingPage}>
                <StdDashboard />
              </Suspense>
            ),
          },
          {
            path: ROUTE_PATH.PLO,
            element: (
              <Suspense fallback={loadingPage}>
                {!isMobile ? <StdOverallPLO /> : <NotAvailablePage />}
              </Suspense>
            ),
          },
          {
            path: ":courseNo",
            children: [
              {
                path: ROUTE_PATH.EVALUATION,
                children: [
                  {
                    path: "",
                    element: (
                      <Suspense fallback={loadingPage}>
                        <StdAssignment />
                      </Suspense>
                    ),
                  },
                  {
                    path: ":name",
                    element: (
                      <Suspense fallback={loadingPage}>
                        <StdScore />
                      </Suspense>
                    ),
                  },
                ],
              },
              {
                path: ROUTE_PATH.HISTOGRAM,
                element: (
                  <Suspense fallback={loadingPage}>
                    {!isMobile ? <StdChart /> : <NotAvailablePage />}
                  </Suspense>
                ),
              },
              {
                path: ROUTE_PATH.COURSE_SYLLABUS.slice(1),
                element: (
                  <Suspense fallback={loadingPage}>
                    <CourseSyllabus />
                  </Suspense>
                ),
              },
              {
                path: ROUTE_PATH.CLO,
                element: (
                  <Suspense fallback={loadingPage}>
                    <StdCLO />
                  </Suspense>
                ),
              },
              {
                path: ROUTE_PATH.PLO,
                element: (
                  <Suspense fallback={loadingPage}>
                    {!isMobile ? <StdPLO /> : <NotAvailablePage />}
                  </Suspense>
                ),
              },
              // {
              //   path: ROUTE_PATH.SKILLS,
              //   element: (
              //     <Suspense fallback={loadingPage}>
              //       <StdSkills />
              //     </Suspense>
              //   ),
              // },
            ],
          },
        ],
      },
      {
        path: "*",
        element: (
          <Suspense fallback={loadingPage}>
            <Page404 />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
