import { useState } from "react";
import cmulogo from "../assets/image/cmuLogo.png";
import { Button } from "@mantine/core";

export default function Sidebar() {
  const [active, setActive] = useState(false);

  return (
    <div className="w-[270px] h-screen flex justify-center font-sf-pro ">
      <div className="absolute top-5 flex flex-col gap-11 text-white ">
        <img src={cmulogo} alt="CMULogo" className="h-[24px]" />

        {/* instructor dashboard */}
        <div className="flex flex-col gap-11">
          <div className="text-sm flex flex-col gap-[6px]">
            <p className="font-semibold">Welcome to CMU OBE! </p>
            <div className="font-normal flex flex-col gap-[2px]">
              <p>Your courses are waiting </p>
              <p>on the right to jump in!</p>
              <p>Account? Top right menu</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-md font-semibold">Course</p>
            <Button
              className="bg-transparent w-full h-[50px] flex justify-start items-center  px-3 py-1 border-none rounded-lg text-white transition-colors duration-300 hover:bg-[#F0F0F0] hover:text-[#6869AD] focus:border-none group"
              leftSection={
                <svg
                  className="flex flex-col justify-start h-full -mt-4 mr-1  group-hover:stroke-[#6869AD] transition-colors duration-300"
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                >
                  <path
                    d="M1 7.17559C1 4.72444 1 3.49854 1.7618 2.73739C2.52295 1.97559 3.74885 1.97559 6.2 1.97559H8.8C11.2511 1.97559 12.477 1.97559 13.2382 2.73739C14 3.49854 14 4.72444 14 7.17559V8.47559C14 10.9267 14 12.1526 13.2382 12.9138C12.477 13.6756 11.2511 13.6756 8.8 13.6756H6.2C3.74885 13.6756 2.52295 13.6756 1.7618 12.9138C1 12.1526 1 10.9267 1 8.47559V7.17559Z"
                    stroke="white"
                    className="transition-colors duration-300 group-hover:stroke-[#6869AD]"
                    stroke-width="1.5"
                  />
                  <path
                    d="M4.24531 1.975V1M10.7453 1.975V1M1.32031 5.225H13.6703"
                    stroke="white"
                    className="transition-colors duration-300 group-hover:stroke-[#6869AD]"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M11.4016 10.4248C11.4016 10.5972 11.3331 10.7625 11.2112 10.8844C11.0893 11.0063 10.924 11.0748 10.7516 11.0748C10.5792 11.0748 10.4138 11.0063 10.2919 10.8844C10.17 10.7625 10.1016 10.5972 10.1016 10.4248C10.1016 10.2524 10.17 10.0871 10.2919 9.96518C10.4138 9.84329 10.5792 9.7748 10.7516 9.7748C10.924 9.7748 11.0893 9.84329 11.2112 9.96518C11.3331 10.0871 11.4016 10.2524 11.4016 10.4248ZM11.4016 7.8248C11.4016 7.9972 11.3331 8.16253 11.2112 8.28442C11.0893 8.40632 10.924 8.4748 10.7516 8.4748C10.5792 8.4748 10.4138 8.40632 10.2919 8.28442C10.17 8.16253 10.1016 7.9972 10.1016 7.8248C10.1016 7.65241 10.17 7.48708 10.2919 7.36519C10.4138 7.24329 10.5792 7.1748 10.7516 7.1748C10.924 7.1748 11.0893 7.24329 11.2112 7.36519C11.3331 7.48708 11.4016 7.65241 11.4016 7.8248ZM8.15156 10.4248C8.15156 10.5972 8.08308 10.7625 7.96118 10.8844C7.83928 11.0063 7.67395 11.0748 7.50156 11.0748C7.32917 11.0748 7.16384 11.0063 7.04194 10.8844C6.92004 10.7625 6.85156 10.5972 6.85156 10.4248C6.85156 10.2524 6.92004 10.0871 7.04194 9.96518C7.16384 9.84329 7.32917 9.7748 7.50156 9.7748C7.67395 9.7748 7.83928 9.84329 7.96118 9.96518C8.08308 10.0871 8.15156 10.2524 8.15156 10.4248ZM8.15156 7.8248C8.15156 7.9972 8.08308 8.16253 7.96118 8.28442C7.83928 8.40632 7.67395 8.4748 7.50156 8.4748C7.32917 8.4748 7.16384 8.40632 7.04194 8.28442C6.92004 8.16253 6.85156 7.9972 6.85156 7.8248C6.85156 7.65241 6.92004 7.48708 7.04194 7.36519C7.16384 7.24329 7.32917 7.1748 7.50156 7.1748C7.67395 7.1748 7.83928 7.24329 7.96118 7.36519C8.08308 7.48708 8.15156 7.65241 8.15156 7.8248ZM4.90156 10.4248C4.90156 10.5972 4.83308 10.7625 4.71118 10.8844C4.58928 11.0063 4.42395 11.0748 4.25156 11.0748C4.07917 11.0748 3.91384 11.0063 3.79194 10.8844C3.67004 10.7625 3.60156 10.5972 3.60156 10.4248C3.60156 10.2524 3.67004 10.0871 3.79194 9.96518C3.91384 9.84329 4.07917 9.7748 4.25156 9.7748C4.42395 9.7748 4.58928 9.84329 4.71118 9.96518C4.83308 10.0871 4.90156 10.2524 4.90156 10.4248ZM4.90156 7.8248C4.90156 7.9972 4.83308 8.16253 4.71118 8.28442C4.58928 8.40632 4.42395 8.4748 4.25156 8.4748C4.07917 8.4748 3.91384 8.40632 3.79194 8.28442C3.67004 8.16253 3.60156 7.9972 3.60156 7.8248C3.60156 7.65241 3.67004 7.48708 3.79194 7.36519C3.91384 7.24329 4.07917 7.1748 4.25156 7.1748C4.42395 7.1748 4.58928 7.24329 4.71118 7.36519C4.83308 7.48708 4.90156 7.65241 4.90156 7.8248Z"
                    fill="white"
                    className="transition-colors duration-300 group-hover:fill--[#6869AD]"
                  />
                </svg>
              }
              variant="default"
            >
              <div className="flex flex-col justify-start items-start gap-[7px]">
                <p className="font-medium text-[14px]">Semester</p>
                <p className="font-normal text-[12px]">Course (1/67)</p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
