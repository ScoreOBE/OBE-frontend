import { useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { setUser } from "@/store/user";
import { getUserInfo } from "@/services/user/user.service";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch, useAppSelector } from "@/store";
import { isEmpty } from "lodash";
import { getAcademicYear } from "./services/academicYear/academicYear.service";
import { setAcademicYear } from "./store/academicYear";
import { AcademicYearRequestDTO } from "./services/academicYear/dto/academicYear.dto";
import PageError from "./pages/PageError";
import { setLoading } from "./store/loading";
import ModalTermOfService from "./components/Modal/ModalTermOfService";

function App() {
  const showSidebar = useAppSelector((state) => state.showSidebar);
  const showNavbar = useAppSelector((state) => state.showNavbar);
  const error = useAppSelector((state) => state.errorResponse);
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear);
  const dispatch = useAppDispatch();
  const path = useLocation().pathname;
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (!isEmpty(user) && !isEmpty(academicYear)) return;
      if (
        user.departmentCode &&
        !user.departmentCode.length &&
        ![
          ROUTE_PATH.SELECTED_DEPARTMENT,
          ROUTE_PATH.CMU_OAUTH_CALLBACK,
        ].includes(path)
      ) {
        localStorage.removeItem("token");
      } else {
        fetchData();
      }
    } else if (
      ![ROUTE_PATH.LOGIN, ROUTE_PATH.CMU_OAUTH_CALLBACK].includes(path)
    ) {
      navigate(ROUTE_PATH.LOGIN);
    }
  }, [user, path]);

  const fetchData = async () => {
    dispatch(setLoading(true));
    if (!user.id) {
      const res = await getUserInfo();
      if (res) {
        dispatch(setUser(res));
      } else {
        dispatch(setLoading(false));
      }
    }
    if (user.id && !academicYear.length && path !== ROUTE_PATH.DASHBOARD_INS) {
      const payload = new AcademicYearRequestDTO();
      const rsAcademicYear = await getAcademicYear(payload);
      if (rsAcademicYear) {
        dispatch(setAcademicYear(rsAcademicYear));
      }
    }
  };

  return error.statusCode ? (
    <PageError />
  ) : (
    <div className="flex h-screen w-screen text-default">
      {showSidebar && <Sidebar />}
      <div className="flex flex-col h-full w-full overflow-hidden">
        {showNavbar && <Navbar />}
        <ModalTermOfService opened={true} onClose={() => {}} />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
