import maintenace from "@/assets/image/maintenance.png";
import unplug from "@/assets/image/unplug.png";
import { TypeMethodTQF5 } from "@/pages/TQF/TQF5";
import { useAppSelector, useAppDispatch } from "@/store";
import { useParams } from "react-router-dom";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
  method: TypeMethodTQF5;
};

export default function Part2TQF5({ setForm, method }: Props) {
  const { courseNo } = useParams();
  const course = useAppSelector((state) =>
    state.course.courses.find((c) => c.courseNo == courseNo)
  );
  const tqf3 = useAppSelector((state) => state.tqf3);
  const tqf5 = useAppSelector((state) => state.tqf5);
  const dispatch = useAppDispatch();

  return tqf5.part1?.updatedAt ? (
    // <div className="flex w-full flex-col text-[15px] max-h-full gap-2 text-default "></div>
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
