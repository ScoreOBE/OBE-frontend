import maintenace from "@/assets/image/maintenance.png";
import unplug from "@/assets/image/unplug.png";
import { IModelCLO, IModelTQF3 } from "@/models/ModelTQF3";
import { TypeMethodTQF5 } from "@/pages/TQF/TQF5";
import { useAppSelector, useAppDispatch } from "@/store";
import { Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
  method: TypeMethodTQF5;
  tqf3: IModelTQF3;
};

export default function Part2TQF5({ setForm, method, tqf3 }: Props) {
  const { courseNo } = useParams();
  const tqf5 = useAppSelector((state) => state.tqf5);
  const [selectedClo, setSelectedClo] = useState<Partial<IModelCLO>>({});
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (tqf3?.part2?.clo) {
      setSelectedClo({
        ...tqf3.part2.clo[0],
      });
    }
  }, [tqf3]);

  return tqf5.part1?.updatedAt ? (
    // <div className="flex w-full flex-col text-[15px] max-h-full gap-2 text-default">
    //   <div className="flex justify-between">
    //     <div className="text-secondary">
    //       <p>
    //         CLO {selectedClo.no} - {selectedClo.descTH}
    //       </p>
    //       <p>{selectedClo.descEN}</p>
    //     </div>
    //     <Select
    //       data={tqf3.part2?.clo.map((clo) => ({
    //         value: clo.id,
    //         label: `CLO ${clo.no}`,
    //         ...clo,
    //       }))}
    //       value={selectedClo.id}
    //       onChange={(value, option: any) => setSelectedClo({ ...option })}
    //       allowDeselect={false}
    //       className="w-fit"
    //       classNames={{
    //         label: "font-medium mb-1",
    //         input: "text-primary font-medium",
    //         option: "hover:bg-[#DDDDF6] text-primary font-medium",
    //       }}
    //     />
    //   </div>
    // </div>
    <div className="flex px-16 sm:max-ipad11:px-8 flex-row items-center justify-between h-full">
      <div className="h-full  justify-center flex flex-col">
        <p className="text-secondary text-[21px] font-semibold">
          TQF 5 is coming soon to{" "}
          <span className="font-[600] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
            ScoreOBE +{" "}
          </span>{" "}
        </p>
        <br />
        <p className=" -mt-3 mb-6 text-b2 break-words font-medium leading-relaxed">
          Instructors, get ready to experience a new and improved way to
          complete TQF 5 <br /> starting February 2025.
        </p>
      </div>
      <img className=" z-50  w-[25vw] " src={maintenace} alt="loginImage" />
    </div>
  ) : (
    <div className="flex px-16  w-full ipad11:px-8 sm:px-2  gap-5  items-center justify-between h-full">
      <div className="flex justify-center  h-full items-start gap-2 flex-col">
        <p className="   text-secondary font-semibold text-[22px] sm:max-ipad11:text-[20px]">
          Complete TQF5 Part 1 First
        </p>
        <p className=" text-[#333333] leading-6 font-medium text-[14px] sm:max-ipad11:text-[13px]">
          To start TQF5 Part 2, please complete and save TQF5 Part 1. <br />{" "}
          Once done, you can continue to do it.
        </p>
      </div>
      <img
        className=" z-50 ipad11:w-[380px] sm:w-[340px] w-[340px]  macair133:w-[580px] macair133:h-[300px] "
        src={unplug}
        alt="loginImage"
      />
    </div>
  );
}
