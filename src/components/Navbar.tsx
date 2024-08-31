import Profile from "./Profile";
import { useLocation, useSearchParams } from "react-router-dom";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch, useAppSelector } from "@/store";
import { setCourseList } from "@/store/course";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { getCourse } from "@/services/course/course.service";
import cmulogo from "@/assets/image/cmuLogoPurple.png";
import cpeLogoRed from "@/assets/image/cpeLogoRed.png";
import { SearchInput } from "./SearchInput";

export default function Navbar() {
  const location = useLocation().pathname;
  const [params, setParams] = useSearchParams();
  const academicYear = useAppSelector((state) => state.academicYear);
  const dispatch = useAppDispatch();

  const searchCourse = async (searchValue: string, reset?: boolean) => {
    const path = "/" + location.split("/")[1];
    let res;
    let payloadCourse: any = {};
    if (reset) payloadCourse.search = "";
    else payloadCourse.search = searchValue;
    switch (path) {
      case ROUTE_PATH.DASHBOARD_INS:
        payloadCourse = { ...new CourseRequestDTO(), ...payloadCourse };
        payloadCourse.academicYear =
          academicYear.find(
            (e) =>
              e.id == params.get("id") &&
              e.year == parseInt(params.get("year") ?? "") &&
              e.semester == parseInt(params.get("semester") ?? "")
          )?.id ?? "";
        res = await getCourse(payloadCourse);
        if (res) {
          res.search = payloadCourse.search;
          dispatch(setCourseList(res));
        }
        break;
      default:
        break;
    }
    localStorage.setItem("search", "true");
  };

  const topicPath = () => {
    const path = "/" + location.split("/")[1];
    switch (path) {
      case ROUTE_PATH.DASHBOARD_INS:
        return "Your Courses";
      case ROUTE_PATH.COURSE:
        if (location.includes(ROUTE_PATH.TQF3)) return "TQF 3";
        else if (location.includes(ROUTE_PATH.TQF5)) return "TQF 5";
        else if (location.includes(ROUTE_PATH.ASSIGNMENT)) return "Assignment";
        else return "Section";
      default:
        return;
    }
  };

  return (
    <>
      {![
        ROUTE_PATH.CMU_OAUTH_CALLBACK,
        ROUTE_PATH.SELECTED_DEPARTMENT,
      ].includes(location) && (
        <div
          className={`min-h-14 border-b border-[#e0e0e0] px-6 inline-flex flex-wrap justify-between items-center z-50 ${
            [ROUTE_PATH.LOGIN].includes(location)
              ? "bg-white border-none"
              : "bg-[#f5f5f5]"
          } text-secondary`}
        >
          <p className="font-semibold text-h2 md:w-fit max-w-[30%]">
            {topicPath()}
          </p>
          {[ROUTE_PATH.DASHBOARD_INS].includes(location) && (
            <SearchInput onSearch={searchCourse} />
          )}
          {[ROUTE_PATH.LOGIN].includes(location) && (
            <div className="bg-white items-center  mt-5 justify-between  flex flex-1">
              <img src={cmulogo} alt="CMULogo" className=" h-[28px] ml-10" />
              <img src={cpeLogoRed} alt="cpeLogo" className=" h-[80px] mr-10" />
            </div>
          )}
          {![ROUTE_PATH.LOGIN].includes(location) && <Profile />}
        </div>
      )}
    </>
  );
}
