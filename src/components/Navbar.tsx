import { useState } from "react";
import { Button, Input } from "@mantine/core";
import Profile from "./Profile";
import { TbSearch } from "react-icons/tb";
import { useLocation, useSearchParams } from "react-router-dom";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch, useAppSelector } from "@/store";
import { setCourse } from "@/store/course";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { getCourse } from "@/services/course/course.service";

export default function Navbar() {
  const location = useLocation().pathname;
  const [params, setParams] = useSearchParams();
  const academicYear = useAppSelector((state) => state.academicYear);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");
  const payloadCourse = new CourseRequestDTO();

  const searchCourse = async () => {
    payloadCourse.academicYear =
      academicYear.find(
        (e) =>
          e.year == parseInt(params.get("year") ?? "") &&
          e.semester == parseInt(params.get("semester") ?? "")
      )?.id ?? "";
    payloadCourse.search = searchValue;
    const res = await getCourse(payloadCourse);
    if (res) {
      dispatch(setCourse(res.courses ?? res));
    }
    localStorage.setItem("search", "true");
  };

  return (
    <div
      style={{ boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.20)" }}
      className="min-h-14 drop-shadow-md px-6 rounded-tl-3xl inline-flex flex-wrap justify-between items-center z-50 bg-white font-sf-pro text-primary text-xl"
    >
      <p className="font-medium">Your Courses</p>
      {[ROUTE_PATH.DASHBOARD_INS].includes(location) && (
        <Input
          leftSection={<TbSearch />}
          placeholder="Course No / Course Name"
          value={searchValue}
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          onKeyDown={(event) => event.key == "Enter" && searchCourse()}
          className="w-[400px] focus:border-none"
          classNames={{ input: "bg-gray-200 rounded-md border-none" }}
        ></Input>
      )}
      <Profile />
    </div>
  );
}
