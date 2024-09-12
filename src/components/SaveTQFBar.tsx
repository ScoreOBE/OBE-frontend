import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@mantine/core";
import saveIcon from "@/assets/icons/save.svg?react";
import Icon from "./Icon";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { IModelTQF5 } from "@/models/ModelTQF5";
import { dateFormatter } from "@/helpers/functions/function";
import { useEffect } from "react";

export const partLabel = {
  part1: "Part 1",
  part2: "Part 2",
  part3: "Part 3",
  part4: "Part 4",
  part5: "Part 5",
  part6: "Part 6",
};

export type partType =
  | "part1"
  | "part2"
  | "part3"
  | "part4"
  | "part5"
  | "part6";

type Props = {
  tqf: string;
  part: partType;
  data: IModelTQF3 | IModelTQF5;
  onSave: () => void;
  disabledSave: boolean;
};

export default function SaveTQFbar({
  tqf,
  part,
  data,
  onSave,
  disabledSave,
}: Props) {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  return (
    <>
      <div
        className={`min-h-14 justify-end gap-x-4 overflow-y-auto bottom-0 w-full bg-white border-[#e0e0e0] px-6 inline-flex flex-wrap items-center z-50 text-secondary`}
        style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" }}
      >
        {data && (
          <p className="text-[11px] flex flex-col text-end text-secondary font-medium">
            <span className="font-bold">Saved:</span>{" "}
            <span>{dateFormatter(data.updatedAt)}</span>
          </p>
        )}
        <Button className="!w-[128px]" onClick={onSave} disabled={disabledSave}>
          <div className="flex gap-2 items-center">
            <Icon IconComponent={saveIcon} />
            Save {partLabel[part]}
          </div>
        </Button>
      </div>
    </>
  );
}
