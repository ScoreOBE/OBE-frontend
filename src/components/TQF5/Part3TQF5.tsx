import maintenace from "@/assets/image/maintenance.png";
import unplug from "@/assets/image/unplug.png";
import { useAppSelector } from "@/store";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part3TQF5({ setForm }: Props) {
  const tqf5 = useAppSelector((state) => state.tqf5);

  return tqf5.part2?.updatedAt ? (
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
          Complete TQF5 Part 2 First
        </p>
        <p className=" text-[#333333] leading-6 font-medium text-[14px] sm:max-ipad11:text-[13px]">
          To start TQF5 Part 3, please complete and save TQF5 Part 2. <br />{" "}
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
