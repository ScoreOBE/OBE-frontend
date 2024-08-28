import { useState } from "react";
import { CloseButton, TextInput, Tooltip } from "@mantine/core";
import Profile from "./Profile";
import { TbSearch } from "react-icons/tb";
import { AiOutlineEnter } from "react-icons/ai";
import { useLocation, useSearchParams } from "react-router-dom";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch, useAppSelector } from "@/store";
import { setCourseList } from "@/store/course";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { getCourse } from "@/services/course/course.service";
import { ellipsisText } from "@/helpers/functions/validation";
import { getCourseManagement } from "@/services/courseManagement/courseManagement.service";
import { CourseManagementRequestDTO } from "@/services/courseManagement/dto/courseManagement.dto";
import { setCourseManagementList } from "@/store/courseManagement";
import cmulogo from "@/assets/image/cmuLogoPurple.png";

export default function Navbar() {
  const location = useLocation().pathname;
  const [params, setParams] = useSearchParams();
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const searchCourse = async (reset?: boolean) => {
    setIsFocused(false);
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
      case ROUTE_PATH.COURSE_MANAGEMENT:
        payloadCourse = {
          ...new CourseManagementRequestDTO(),
          departmentCode: user.departmentCode,
          ...payloadCourse,
        };
        res = await getCourseManagement(payloadCourse);
        if (res) {
          res.search = payloadCourse.search;
          dispatch(setCourseManagementList(res));
        }
        break;
      default:
        break;
    }
    localStorage.setItem("search", "true");
  };

  const reset = () => {
    setSearchValue("");
    searchCourse(true);
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
      case ROUTE_PATH.COURSE_MANAGEMENT:
        return "Course Management";
      case ROUTE_PATH.PLO_MANAGEMENT:
        return "PLO Management";
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
          className={`min-h-14 border-b-[1px] border-[#e0e0e0] px-6 inline-flex flex-wrap justify-between items-center z-50 ${
            [ROUTE_PATH.LOGIN].includes(location)
              ? "bg-white border-none"
              : "bg-[#f5f5f5]"
          } text-secondary`}
        >
          <p className="font-semibold text-h2 md:w-fit max-w-[30%]">
            {topicPath()}
          </p>
          {[ROUTE_PATH.DASHBOARD_INS, ROUTE_PATH.COURSE_MANAGEMENT].includes(
            location
          ) && (
            <div className="relative md:w-[400px] w-[220px]">
              <TextInput
                autoFocus={false}
                leftSection={!isFocused && <TbSearch className="size-4" />}
                placeholder="Course No / Course Name"
                size="xs"
                value={searchValue}
                onChange={(event: any) =>
                  setSearchValue(event.currentTarget.value)
                }
                onKeyDown={(event: any) =>
                  event.key == "Enter" && searchCourse()
                }
                onInput={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 300)}
                onFocus={() => setIsFocused(true)}
                rightSectionPointerEvents="all"
                rightSection={
                  !!searchValue.length && (
                    <Tooltip className="text-b3" label="Reset">
                      <CloseButton size="sm" onClick={reset} />
                    </Tooltip>
                  )
                }
              />
              {isFocused && (
                <div
                  className="mt-2 absolute cursor-pointer w-full rounded-md bg-white text-slate-800 p-3 text-b3 flex md:flex-row flex-col md:gap-0 gap-2 justify-between items-center"
                  onClick={() => searchCourse()}
                  style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px" }}
                >
                  <div className="flex md:w-fit w-full items-center gap-3">
                    <TbSearch className="size-4" />
                    {!!searchValue.length ? (
                      <p className="text-ellipsis overflow-hidden whitespace-nowrap">
                        {ellipsisText(searchValue, 40)}
                      </p>
                    ) : (
                      <p>Show All Your Course</p>
                    )}
                  </div>

                  <div className="flex md:w-fit w-full justify-end items-center text-secondary gap-1">
                    Press
                    <div className="ml-1 flex items-center gap-1 border border-secondary p-1 font-semibold rounded-[6px]">
                      Enter <AiOutlineEnter className="stroke-[50px]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {[ROUTE_PATH.LOGIN].includes(location) && (
            <div className="bg-white ml-10 mt-3 justify-start flex flex-1 items-start">
              <img src={cmulogo} alt="CMULogo" className=" h-[24px]" />
            </div>
          )}
          {![ROUTE_PATH.LOGIN].includes(location) && <Profile />}
        </div>
      )}
    </>
  );
}
