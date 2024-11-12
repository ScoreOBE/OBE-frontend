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
import { Button } from "@mantine/core";
import { ROLE } from "@/helpers/constants/enum";
import Icon from "./Icon";
import IconFeedback from "@/assets/icons/feedback.svg?react";

export default function Navbar() {
  const { name } = useParams();
  const path = useLocation().pathname;
  const location = useLocation().pathname;
  const user = useAppSelector((state) => state.user);
  const [params, setParams] = useSearchParams();
  const tqf3Topic = useAppSelector((state) => state.tqf3.topic);
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
    switch (path) {
      case ROUTE_PATH.INS_DASHBOARD:
        return "Your Courses";
      case ROUTE_PATH.STD_DASHBOARD:
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
        className={`min-h-14 bg-[#fafafa] border-b border-[#e0e0e0] text-secondary px-6 inline-flex flex-wrap justify-between items-center z-50 ${
          [ROUTE_PATH.LOGIN].includes(location)
            ? " border-none  min-h-14 items-center"
            : ""
        }`}
        style={
          ![ROUTE_PATH.LOGIN].includes(location)
            ? { boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" }
            : {}
        }
      >
        <div className="flex w-fit  gap-3 items-center">
          <p
            className={`font-semibold text-h2 ${
              location.includes(ROUTE_PATH.TQF3 || ROUTE_PATH.TQF5)
                ? ""
                : "md:w-fit w-full"
            }`}
          >
            {topicPath()}
          </p>
          {(user.role === ROLE.SUPREME_ADMIN || user.role === ROLE.ADMIN) &&
            (localStorage.getItem("dashboard") == ROLE.ADMIN ? (
              <div className="px-3 py-2 w-fit tag-tqf bg-sky-100 text-blue-600 rounded-[20px]">
                AD
              </div>
            ) : (
              <div className="px-3 py-2 w-fit tag-tqf bg-indigo-100 text-secondary rounded-[20px]">
                INS
              </div>
            ))}
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
          <div className="bg-[#fafafa] sm:px-12 px-2  overflow-hidden items-center !w-full  !h-full  justify-between  flex flex-1 ">
            <div className="flex gap-2 items-center">
              <img
                src={scoreobe}
                alt="cpeLogo"
                className=" sm:h-[28px] h-[22px] "
              />
              <span className="font-[600] sm:text-[18px] text-[14px] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                ScoreOBE +
              </span>{" "}
            </div>
            <div className="flex items-end gap-5  justify-end">
              {/* <img src={cmulogo} alt="CMULogo" className=" h-[18px]" /> */}
              <img
                src={cpeLogoRed}
                alt="cpeLogo"
                className=" sm:h-[40px] h-[32px] -mt-2 sm:mt-0"
              />
            </div>
          </div>
        )}
        {![ROUTE_PATH.LOGIN].includes(location) && (
          <div className="flex gap-2 items-center">
            {user.role !== ROLE.STUDENT && (
              <a href="https://forms.gle/HwxjaAZAJs99v8aDA" target="_blank">
                <Button variant="light">
                  <div className="flex items-center gap-1">
                    <Icon className="size-5 " IconComponent={IconFeedback} />{" "}
                    Feedback
                  </div>
                </Button>
              </a>
            )}
            <Profile />
          </div>
        )}
      </div>
    </>
  );
}
