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
import saveIcon from "@/assets/icons/save.svg?react";
import exportFile from "@/assets/icons/exportFile.svg?react";
import Icon from "./Icon";
import { stat } from "fs";
import { ROLE } from "@/helpers/constants/enum";

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
  const user = useAppSelector((state) => state.user);

  return (
    <>
      <div
        className={`min-h-14 justify-end gap-4  bottom-0 w-full bg-white border-[#e0e0e0] px-6 inline-flex flex-wrap items-center z-50 
           text-secondary`}
        style={{
          boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          overflowY: "auto",
        }}
      >
        <p className="text-[13px] text-default font-medium">
          <span className="font-semibold">Saved: </span> Apr 11, 2567 12:18
        </p>
        <Button className="text-[13px] font-semibold h-8 w-[128px] rounded-md bg-[#45b9b3] hover:bg-[#40a7a2]">
          <div className="flex gap-2 items-center">
            <Icon IconComponent={saveIcon} />
            Save {part}
          </div>
        </Button>

        {user.role !== ROLE.INSTRUCTOR && (
          <Button className="text-[13px] font-semibold h-8 px-4 rounded-md">
            <div className="flex gap-2 items-center">
              <Icon IconComponent={exportFile} />
              Export TQF 3
            </div>
          </Button>
        )}
      </div>
    </>
  );
}
