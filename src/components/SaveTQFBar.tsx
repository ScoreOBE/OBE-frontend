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
import { Button } from "@mantine/core";

export type partType =
  | "Part 1"
  | "Part 2"
  | "Part 3"
  | "Part 4"
  | "Part 5"
  | "Part 6";
type Props = {
  tqf: string;
  part: partType;
};
export default function SaveTQFbar({ tqf, part }: Props) {
  const location = useLocation().pathname;
  const [params, setParams] = useSearchParams();
  const academicYear = useAppSelector((state) => state.academicYear);
  const dispatch = useAppDispatch();

  return (
    <>
      <div
        className={`min-h-14 justify-end  bottom-0 w-full bg-white border-[#e0e0e0] px-6 inline-flex flex-wrap items-center z-50 
           text-secondary`}
        style={{
          boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          overflowY: "auto",
        }}
      >
        <Button className="text-[13px] font-semibold h-[32px] rounded-md ">Save {part}</Button>
      </div>
    </>
  );
}
