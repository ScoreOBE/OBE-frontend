import { useState } from "react";
import { Button, CloseButton, Input, Tooltip } from "@mantine/core";
import Profile from "./Profile";
import { TbSearch } from "react-icons/tb";
import { useLocation, useSearchParams } from "react-router-dom";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch, useAppSelector } from "@/store";
import { setCourse } from "@/store/course";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { getCourse } from "@/services/course/course.service";
import { ellipsisText } from "@/helpers/functions/validation";

export default function Navbar() {
  const location = useLocation().pathname;
  const [params, setParams] = useSearchParams();
  const academicYear = useAppSelector((state) => state.academicYear);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");
  const payloadCourse = new CourseRequestDTO();
  const [isFocused, setIsFocused] = useState(false);

  const searchCourse = async (reset?: boolean) => {
    setIsFocused(false);
    if (reset) payloadCourse.search = "";
    else payloadCourse.search = searchValue;
    payloadCourse.academicYear =
      academicYear.find(
        (e) =>
          e.year == parseInt(params.get("year") ?? "") &&
          e.semester == parseInt(params.get("semester") ?? "")
      )?.id ?? "";
    const res = await getCourse(payloadCourse);
    if (res) {
      dispatch(setCourse(res.courses ?? res));
    }
    localStorage.setItem("search", "true");
  };

  const reset = () => {
    setSearchValue("");
    searchCourse(true);
  };

  return (
    <div
      style={{ boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.20)" }}
      className="min-h-14 drop-shadow-md px-6 rounded-tl-3xl inline-flex flex-wrap justify-between items-center z-50 bg-white  text-primary text-xl"
    >
      <p className="font-medium">Your Courses</p>
      {[ROUTE_PATH.DASHBOARD_INS].includes(location) && (
        <div className="w-[400px]">
          <Input
            leftSection={!isFocused && <TbSearch />}
            placeholder="Course No / Course Name"
            value={searchValue}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
            onKeyDown={(event) => event.key == "Enter" && searchCourse()}
            onInput={() => setIsFocused(true)}
            className="focus:border-none"
            classNames={{ input: "bg-gray-200 rounded-md border-none" }}
            rightSectionPointerEvents="all"
            rightSection={
              <Tooltip label="Reset">
                <CloseButton onClick={reset} />
              </Tooltip>
            }
          />
          {isFocused && searchValue.length > 0 && (
            <div
              className="absolute cursor-pointer w-[400px] bg-gray-400 rounded-md text-white px-2 py-3 text-sm flex justify-between items-center"
              onClick={() => searchCourse()}
            >
              <div className="flex items-center gap-3">
                <TbSearch className="w-auto" />
                <p className="">{ellipsisText(searchValue, 35)}</p>
              </div>
              <p>
                Press{" "}
                <span className="ml-1 border-[1px] p-1 rounded-md">Enter</span>
              </p>
            </div>
          )}
        </div>
      )}
      <Profile />
    </div>
  );
}
