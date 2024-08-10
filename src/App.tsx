import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  matchPath,
  useParams,
  useSearchParams,
} from "react-router-dom";
import "./App.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { setUser } from "@/store/user";
import Login from "@/pages/Login";
import Page404 from "@/pages/Page404";
import { getUserInfo } from "@/services/user/user.service";
import CMUOAuthCallback from "@/pages/CmuOAuthCallback";
import { ROUTE_PATH } from "@/helpers/constants/route";
import SelectDepartment from "@/pages/SelectDepartment";
import Dashboard from "@/pages/Dashboard";
import Course from "@/pages/Course";
import { useAppDispatch, useAppSelector } from "@/store";
import { isEmpty } from "lodash";
import { getAcademicYear } from "./services/academicYear/academicYear.service";
import { setAcademicYear } from "./store/academicYear";
import { AcademicYearRequestDTO } from "./services/academicYear/dto/academicYear.dto";
import CourseManagement from "@/pages/CourseManagement";
import { setLoading } from "@/store/loading";

function App() {
  const error = useAppSelector((state) => state.errorResponse);
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear);
  const dispatch = useAppDispatch();
  const path = useLocation().pathname;
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const routesWithoutSidebar = [
    ROUTE_PATH.LOGIN,
    ROUTE_PATH.SELECTED_DEPARTMENT,
    ROUTE_PATH.CMU_OAUTH_CALLBACK,
  ];
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user.email) {
        const res = await getUserInfo();
        if (res) {
          dispatch(setUser(res));
        }
      }
      if (user.email && !academicYear.length) {
        let payload = new AcademicYearRequestDTO();
        const rsAcademicYear = await getAcademicYear(payload);
        if (rsAcademicYear) {
          dispatch(setAcademicYear(rsAcademicYear));
          setParams({
            id: rsAcademicYear[0].id,
            year: rsAcademicYear[0].year.toString(),
            semester: rsAcademicYear[0].semester.toString(),
          });
        }
      }
    };

    const isPageNotFound =
      !Object.values(ROUTE_PATH).some((path) =>
        matchPath({ path, end: true }, location.pathname)
      ) &&
      !matchPath(
        { path: `${ROUTE_PATH.COURSE}/:courseNo`, end: true },
        location.pathname
      );
    setShowSidebar(!isPageNotFound && !routesWithoutSidebar.includes(path));
    if (path == ROUTE_PATH.CMU_OAUTH_CALLBACK || isPageNotFound) {
      return;
    }

    if (localStorage.getItem("token")) {
      if (!isEmpty(user) && !isEmpty(academicYear)) return;

      if (
        user.departmentCode &&
        !user.departmentCode.length &&
        path != ROUTE_PATH.SELECTED_DEPARTMENT
      ) {
        localStorage.removeItem("token");
      }
      dispatch(setLoading(true));
      fetchData();
    } else if (path != ROUTE_PATH.LOGIN) {
      navigate(ROUTE_PATH.LOGIN);
    }
  }, [user, path]);

  useEffect(() => {
    if (error.statusCode) {
      setShowSidebar(false);
    }
  }, [error]);

  return (
    <div
      className={`flex h-screen w-screen  ${
        showSidebar ? "sidebar-linear-gradient" : ""
      }`}
    >
      {showSidebar && <Sidebar />}
      <div className="flex flex-col h-full w-full overflow-hidden">
        {!error.statusCode && <Navbar />}
        <Routes>
          <Route path={ROUTE_PATH.LOGIN} element={<Login />} />
          <Route
            path={ROUTE_PATH.CMU_OAUTH_CALLBACK}
            element={<CMUOAuthCallback />}
          />
          <Route
            path={ROUTE_PATH.SELECTED_DEPARTMENT}
            element={<SelectDepartment />}
          />
          <Route
            path={ROUTE_PATH.COURSE_MANAGEMENT}
            element={<CourseManagement />}
          />
          <Route path={ROUTE_PATH.DASHBOARD_INS} element={<Dashboard />} />
          <Route
            path={`${ROUTE_PATH.COURSE}/:courseNo`}
            element={<Course />}
            errorElement={<Page404 />}
          />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
