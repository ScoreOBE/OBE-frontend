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
  const tqf3Topic = useAppSelector((state) => state.tqf3.topic);
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
        payloadCourse.year = parseInt(params.get("year") ?? "");
        payloadCourse.semester = parseInt(params.get("semester") ?? "");
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
        if (location.includes(ROUTE_PATH.TQF3))
          return `TQF 3${tqf3Topic ? ` - ${tqf3Topic}` : ""}`;
        else if (location.includes(ROUTE_PATH.TQF5))
          return `TQF 5${tqf3Topic ? ` - ${tqf3Topic}` : ""}`;
        else if (location.includes(ROUTE_PATH.ASSIGNMENT)) return "Assignment";
        else return "Section";
      default:
        return;
    }
  };

  return (
    <div
      className={`min-h-14 bg-[#ffffff] border-b border-[#e0e0e0] text-secondary px-6 inline-flex flex-wrap justify-between items-center z-50 ${
        [ROUTE_PATH.LOGIN].includes(location)
          ? "border-none overflow-y-auto"
          : ""
      }`}
      style={
        ![ROUTE_PATH.LOGIN].includes(location)
          ? { boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" }
          : {}
      }
    >
      <p
        className={`font-semibold text-h2 ${
          location.includes(ROUTE_PATH.TQF3 || ROUTE_PATH.TQF5)
            ? ""
            : "md:w-fit max-w-[30%]"
        }`}
      >
        {topicPath()}
      </p>
      {[ROUTE_PATH.DASHBOARD_INS].includes(location) && (
        <SearchInput
          onSearch={searchCourse}
          placeholder="Course No / Course Name"
        />
      )}
      {[ROUTE_PATH.LOGIN].includes(location) && (
        <div className="bg-white items-center  mt-5 pb-1 justify-between  flex flex-1">
          <img src={cmulogo} alt="CMULogo" className=" h-[28px] ml-10" />
          <img src={cpeLogoRed} alt="cpeLogo" className=" h-[75px] mr-10" />
        </div>
      )}
      {![ROUTE_PATH.LOGIN].includes(location) && <Profile />}
    </div>
  );
}
