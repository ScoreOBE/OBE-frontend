import { useAppSelector } from "@/store";
import { Button } from "@mantine/core";
import Iconsave from "@/assets/icons/save.svg?react";
import Icon from "./Icon";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { dateFormatter } from "@/helpers/functions/function";
import { useParams, useSearchParams } from "react-router-dom";

export const partLabel: {
  [key in keyof Pick<
    IModelTQF3,
    "part1" | "part2" | "part3" | "part4" | "part5" | "part6" | "part7"
  >]: string;
} = {
  part1: "Part 1",
  part2: "Part 2",
  part3: "Part 3",
  part4: "Part 4",
  part5: "Part 5",
  part6: "Part 6",
  part7: "Part 7",
};

export type partType =
  | "part1"
  | "part2"
  | "part3"
  | "part4"
  | "part5"
  | "part6"
  | "part7";

type Props = {
  tqf?: string;
  part?: partType;
  data?: any;
  onSave?: () => void;
  disabledSave?: boolean;
};

export default function Bottombar({
  tqf,
  part,
  data,
  onSave,
  disabledSave,
}: Props) {
  const { courseNo } = useParams();
  const [searchParams] = useSearchParams();
  const year = searchParams.get("year")?.slice(-2);
  const semester = searchParams.get("semester");
  const topic = searchParams.get("topic") ?? null;
  const loading = useAppSelector((state) => state.loading);
  const courseSyllabus = useAppSelector((state) =>
    state.courseSyllabus.courses.find((course) => course.courseNo == courseNo)
  );
  const tqf3 = useAppSelector((state) => state.tqf3);
  return (
    <>
      <div
        className={`${
          tqf3.courseSyllabus ? "" : "justify-end"
        } min-h-14 gap-x-4 overflow-y-auto bottom-0 w-full bg-white border-[#e0e0e0] px-6 inline-flex flex-wrap items-center z-50 text-secondary`}
        style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" }}
      >
        {loading.loading ? (
          <></>
        ) : tqf3.courseSyllabus ? (
          <>
            <p className="font-semibold text-b2">
              {courseNo} - {courseSyllabus?.courseName}
              {topic ? ` (${topic})` : ""} ({semester}/{year})
            </p>
          </>
        ) : (
          <>
            <p className="text-b5 acerSwift:max-macair133:text-b6 flex flex-col text-end text-secondary font-medium">
              {data ? (
                <>
                  <span className="font-bold">Saved:</span>{" "}
                  <span>{dateFormatter(data.updatedAt)}</span>
                </>
              ) : (
                <>Unsaved Changes</>
              )}
            </p>

            <Button
              className="!w-[128px] acerSwift:max-macair133:!w-[115px]"
              onClick={onSave}
              disabled={disabledSave}
              loading={loading.loadingOverlay}
            >
              <div className="flex gap-2 items-center acerSwift:max-macair133:text-b5">
                <Icon
                  IconComponent={Iconsave}
                  className="acerSwift:max-macair133:"
                  size-4
                />
                Save {partLabel[part!]}
              </div>
            </Button>
          </>
        )}
      </div>
    </>
  );
}
