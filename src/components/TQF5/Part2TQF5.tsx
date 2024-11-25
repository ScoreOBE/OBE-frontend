import maintenace from "@/assets/image/maintenance.png";
import { TypeMethodTQF5 } from "@/pages/TQF/TQF5";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
  method: TypeMethodTQF5;
};

export default function Part2TQF5({ setForm, method }: Props) {
  return (
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
  );
}
