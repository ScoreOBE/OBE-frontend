import Profile from "./Profile";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch, useAppSelector } from "@/store";
import { setCourseList } from "@/store/course";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { getCourse } from "@/services/course/course.service";
import scoreobe from "@/assets/image/scoreOBElogobold.png";
import cmulogo from "@/assets/image/cmuLogoPurple.png";
import { SearchInput } from "./SearchInput";
import { setAllCourseList } from "@/store/allCourse";
import cpeLogoRed from "@/assets/image/cpeLogoRed.png";
import { Button } from "@mantine/core";

export default function Navbar() {
  const { name } = useParams();
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
      case ROUTE_PATH.INS_DASHBOARD:
      case ROUTE_PATH.ADMIN_DASHBOARD:
        payloadCourse = {
          ...new CourseRequestDTO(),
          ...payloadCourse,
          manage: path.includes(ROUTE_PATH.ADMIN_DASHBOARD),
        };
        payloadCourse.year = parseInt(params.get("year") ?? "");
        payloadCourse.semester = parseInt(params.get("semester") ?? "");
        res = await getCourse(payloadCourse);
        if (res) {
          res.search = payloadCourse.search;
          if (path.includes(ROUTE_PATH.ADMIN_DASHBOARD)) {
            dispatch(setAllCourseList(res));
          } else {
            dispatch(setCourseList(res));
          }
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
      case ROUTE_PATH.INS_DASHBOARD:
        return "Your Courses";
      case ROUTE_PATH.ADMIN_DASHBOARD:
        return `Course ${params.get("semester") ?? ""}/${
          params.get("year")?.slice(-2) ?? ""
        }`;
      case ROUTE_PATH.COURSE:
        if (location.includes(ROUTE_PATH.TQF3))
          return `TQF 3${tqf3Topic ? ` - ${tqf3Topic}` : ""}`;
        else if (location.includes(ROUTE_PATH.TQF5))
          return `TQF 5${tqf3Topic ? ` - ${tqf3Topic}` : ""}`;
        else if (location.includes(ROUTE_PATH.SCORE)) return `${name}`;
        else if (location.includes(ROUTE_PATH.STUDENTS)) return `${name}`;
        else if (location.includes(ROUTE_PATH.ASSIGNMENT)) return "Assignment";
        else if (location.includes(ROUTE_PATH.HISTOGRAM)) return "Histogram";
        else return "Section";
      default:
        return;
    }
  };

  return (
    <>
      <div
        className={`min-h-14 overflow-hidden bg-[#fafafa] border-b border-[#e0e0e0] text-secondary px-6  inline-flex flex-wrap justify-between items-center z-50 ${
          [ROUTE_PATH.LOGIN].includes(location)
            ? " border-none min-h-20 items-center"
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
        {[ROUTE_PATH.INS_DASHBOARD, ROUTE_PATH.ADMIN_DASHBOARD].some((path) =>
          location.includes(path)
        ) && (
          <SearchInput
            onSearch={searchCourse}
            placeholder="Course No / Course Name"
          />
        )}
        {[ROUTE_PATH.LOGIN].includes(location) && (
          <div className="bg-[#fafafa] px-12  overflow-hidden items-center !w-full   !h-full  justify-between  flex flex-1">
            <div className="flex gap-2 items-center">
              <img src={scoreobe} alt="cpeLogo" className=" h-[35px] " />
              <span className="font-[600] text-[20px] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                ScoreOBE +
              </span>{" "}
            </div>
            <div className="flex items-end gap-5 -mt-5 justify-end">
              <img src={cmulogo} alt="CMULogo" className=" h-[18px]" />
              <img src={cpeLogoRed} alt="cpeLogo" className=" h-[38px] " />
            </div>
          </div>
        )}
        <div className="flex gap-2 items-center">
          <a href="https://forms.gle/HwxjaAZAJs99v8aDA" target="_blank">
            <Button variant="light">Give feedback</Button>
          </a>
          {![ROUTE_PATH.LOGIN].includes(location) && <Profile />}
        </div>
      </div>
    </>
  );
}
