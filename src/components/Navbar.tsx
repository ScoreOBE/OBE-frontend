import Profile from "./Profile";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch, useAppSelector } from "@/store";
import { setCourseList } from "@/store/course";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { getCourse } from "@/services/course/course.service";
import scoreobe from "@/assets/image/scoreOBElogobold.png";
import { SearchInput } from "./SearchInput";
import { setAllCourseList } from "@/store/allCourse";
import cpeLogoRed from "@/assets/image/cpeLogoRed.png";
import { ROLE } from "@/helpers/constants/enum";
import { Button } from "@mantine/core";
import Icon from "./Icon";
import IconFeedback from "@/assets/icons/feedback.svg?react";

export default function Navbar() {
  const { name } = useParams();
  const location = useLocation().pathname;
  const user = useAppSelector((state) => state.user);
  const showButtonLogin = useAppSelector(
    (state) => state.config.showButtonLogin
  );
  const dashboard = useAppSelector((state) => state.config.dashboard);
  const [params, setParams] = useSearchParams();
  const tqf3Topic = useAppSelector((state) => state.tqf3.topic);
  const tqf5Topic = useAppSelector((state) => state.tqf5.topic);
  const dispatch = useAppDispatch();
  const departmentCode = useAppSelector(
    (state) => state.allCourse.departmentCode
  );

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
          departmentCode,
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
    const semester = params.get("semester") || "Unknown Semester";
    const year = params.get("year") ? params.get("year")?.slice(-2) : "??";
    switch (path) {
      case ROUTE_PATH.INS_DASHBOARD:
        return "Your Courses";
      case ROUTE_PATH.STD_DASHBOARD:
        if (location.includes(ROUTE_PATH.EVALUATION)) return `Evaluations`;
        else if (location.includes(ROUTE_PATH.HISTOGRAM)) return `Chart`;
        else if (location.includes(ROUTE_PATH.CLO)) return `CLO`;
        else if (location.includes(ROUTE_PATH.PLO)) return `Overall PLO`;
        return "Dashboard";
      case ROUTE_PATH.ADMIN_DASHBOARD:
        if (location.includes(ROUTE_PATH.TQF)) return `TQF ${semester}/${year}`;
        else if (location.includes(ROUTE_PATH.CLO))
          return `CLO ${semester}/${year}`;
        else return `PLO ${semester}/${year}`;
      case ROUTE_PATH.COURSE:
        if (location.includes(ROUTE_PATH.TQF3))
          return `TQF 3${tqf3Topic ? ` - ${tqf3Topic}` : ""}`;
        else if (location.includes(ROUTE_PATH.TQF5))
          return `TQF 5${tqf5Topic ? ` - ${tqf5Topic}` : ""}`;
        else if (location.includes(ROUTE_PATH.SCORE)) return `${name}`;
        else if (location.includes(ROUTE_PATH.ROSTER)) return `Course Roster`;
        else if (location.includes(ROUTE_PATH.STUDENTS)) return `${name}`;
        else if (location.includes(ROUTE_PATH.EVALUATION)) return "Evaluations";
        else if (location.includes(ROUTE_PATH.HISTOGRAM)) return "Chart";
        else return "Section";
      default:
        return;
    }
  };

  const ButtonLogin = () => {
    return (
      <a href={import.meta.env.VITE_CMU_ENTRAID_URL} className="hidden sm:flex">
        <Button size="xs" variant="light" className="!text-[12px]">
          Sign in CMU Account
        </Button>
      </a>
    );
  };

  return (
    <>
      <div
        className={`min-h-14 bg-[#fafafa] border-b border-[#e0e0e0] text-secondary px-6 inline-flex flex-wrap justify-between items-center z-50 ${
          [ROUTE_PATH.LOGIN].includes(location)
            ? "border-none min-h-14 items-center"
            : ""
        }`}
        style={
          ![ROUTE_PATH.LOGIN].includes(location)
            ? { boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" }
            : {}
        }
      >
        <div className="flex w-fit gap-3 items-center">
          <p
            className={`font-semibold text-h2 ${
              location.includes(ROUTE_PATH.TQF3 || ROUTE_PATH.TQF5)
                ? ""
                : "md:w-fit w-full"
            }`}
          >
            {topicPath()}
          </p>
        </div>
        {[ROUTE_PATH.INS_DASHBOARD, ROUTE_PATH.ADMIN_DASHBOARD].some((path) =>
          location.includes(path)
        ) && (
          <SearchInput
            onSearch={searchCourse}
            placeholder="Course No / Course Name"
          />
        )}
        {[ROUTE_PATH.LOGIN].includes(location) && (
          <div className="bg-[#fafafa] sm:px-12 px-2 overflow-hidden items-center !w-full !h-full justify-between flex">
            <div className="flex gap-2 items-center">
              <img
                src={scoreobe}
                alt="cpeLogo"
                className=" sm:h-[28px] h-[22px] "
              />
              <span className="font-[600] sm:text-[18px] text-[14px] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                ScoreOBE +
              </span>
            </div>
            <div className="py-5 flex items-end gap-5 justify-end h-full">
              {showButtonLogin && ButtonLogin()}
              <img
                src={cpeLogoRed}
                alt="cpeLogo"
                className="sm:h-[40px] h-[32px]"
              />
            </div>
          </div>
        )}
        {![ROUTE_PATH.LOGIN].includes(location) && (
          <div className="flex gap-2 items-center">
            <a
              href={
                [ROLE.STUDENT, ROLE.TA].includes(user.role)
                  ? "https://docs.google.com/forms/d/e/1FAIpQLSfstqyy0ijNp8u0JU0a7bBU_x0HGPhJ5V7flAD0ZymzD9cZqA/viewform"
                  : "https://forms.gle/HwxjaAZAJs99v8aDA"
              }
              target="_blank"
            >
              <Button variant="light">
                <div className="flex items-center gap-1">
                  <Icon className="size-5" IconComponent={IconFeedback} />
                  <span>Feedback</span>
                </div>
              </Button>
            </a>
            <Profile />
          </div>
        )}
      </div>
    </>
  );
}
