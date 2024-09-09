import { useLocation, useSearchParams } from "react-router-dom";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@mantine/core";
import saveIcon from "@/assets/icons/save.svg?react";
import exportFile from "@/assets/icons/exportFile.svg?react";
import Icon from "./Icon";
import { ROLE } from "@/helpers/constants/enum";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { IModelTQF5 } from "@/models/ModelTQF5";
import { dateFormatter } from "@/helpers/functions/function";

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
  data: IModelTQF3 | IModelTQF5;
  onSave: () => void;
};

export default function SaveTQFbar({ tqf, part, data, onSave }: Props) {
  const location = useLocation().pathname;
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  return (
    <>
      <div
        className={`min-h-14 justify-end gap-4 overflow-y-auto bottom-0 w-full bg-white border-[#e0e0e0] px-6 inline-flex flex-wrap items-center z-50 text-secondary`}
        style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" }}
      >
        {data && (
          <p className="text-[13px] text-default font-medium">
            <span className="font-semibold">Saved: </span>{" "}
            {dateFormatter(
              data[part.replace(" ", "").toLowerCase()]?.updatedAt
            )}
          </p>
        )}
        <Button
          className="text-[13px] font-semibold h-8 w-[128px] rounded-md bg-save hover:bg-[#28958f]"
          onClick={onSave}
        >
          <div className="flex gap-2 items-center">
            <Icon IconComponent={saveIcon} />
            Save {part}
          </div>
        </Button>

        <Button className="text-[13px] font-semibold h-8 px-4 rounded-md">
          <div className="flex gap-2 items-center">
            <Icon IconComponent={exportFile} />
            Export TQF {tqf}
          </div>
        </Button>
      </div>
    </>
  );
}
