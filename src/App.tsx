import { useEffect, useState } from "react";
import { useLocation, useNavigate, Outlet, useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { setUser } from "@/store/user";
import { AOSInit } from "./aos";
import { getUserInfo } from "@/services/user/user.service";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch, useAppSelector } from "@/store";
import { isEmpty } from "lodash";
import { getAcademicYear } from "./services/academicYear/academicYear.service";
import { setAcademicYear } from "./store/academicYear";
import { AcademicYearRequestDTO } from "./services/academicYear/dto/academicYear.dto";
import PageError from "./pages/PageError";
import { setLoading } from "./store/loading";
import { checkTokenExpired } from "./helpers/functions/validation";
import ModalTermsOfService from "./components/Modal/ModalTermOfService";
import LoadingOverlay from "./components/Loading/LoadingOverlay";

function App() {
  const [openModalTermsOfService, setOpenModalTermsOfService] = useState(false);
  const { courseNo } = useParams();
  const config = useAppSelector((state) => state.config);
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const error = useAppSelector((state) => state.errorResponse);
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear);
  const dispatch = useAppDispatch();
  const path = useLocation().pathname;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (
        user.termsOfService &&
        (!isEmpty(academicYear) ||
          ([
            ROUTE_PATH.INS_DASHBOARD,
            ROUTE_PATH.ADMIN_DASHBOARD,
            ROUTE_PATH.STD_DASHBOARD,
          ].some((e) => path.includes(e)) &&
            !courseNo))
      )
        return;
      checkToken(token);
      fetchData();
    } else if (
      ![ROUTE_PATH.LOGIN, ROUTE_PATH.CMU_ENTRAID_CALLBACK].includes(path)
    ) {
      navigate(ROUTE_PATH.LOGIN);
    }
  }, [user, path]);

  const checkToken = async (token: string) => {
    const isExpired = await checkTokenExpired(token);
    if (isExpired) {
      localStorage.removeItem("token");
      navigate(ROUTE_PATH.LOGIN);
    }
  };

  const fetchData = async () => {
    dispatch(setLoading(true));
    if (!user.id) {
      const res = await getUserInfo();
      if (res) {
        dispatch(setUser(res));
      } else {
        dispatch(setLoading(false));
      }
    } else if (!user.termsOfService) {
      setOpenModalTermsOfService(true);
    } else if (user.termsOfService && !academicYear.length) {
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
    <div className="flex heig w-screen text-default">
      <AOSInit />
      {loading && <LoadingOverlay />}
      {config.showSidebar && <Sidebar />}
      <div className="flex flex-col h-screen w-full overflow-hidden">
        {config.showNavbar && <Navbar />}
        <ModalTermsOfService
          opened={openModalTermsOfService}
          onClose={() => setOpenModalTermsOfService(false)}
        />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
