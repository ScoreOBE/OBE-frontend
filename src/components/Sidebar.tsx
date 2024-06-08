import { useEffect, useState } from "react";
import cmulogo from "@/assets/image/cmuLogo.png";
import { Button } from "@mantine/core";
import { useAppSelector } from "@/store";
import Icon from "./Icon";
import CalendarIcon from "@/assets/icons/calendar.svg?react";

export default function Sidebar() {
  const [active, setActive] = useState(false);
  const academicYear = useAppSelector((state) => state.academicYear);
  const [selectedTerm, setSelectedTerm] = useState(academicYear[0]);

  useEffect(() => {
    if (academicYear.length) setSelectedTerm(academicYear[0]);
  }, [academicYear]);

  return (
    <div className="w-[270px] h-screen flex justify-center font-sf-pro ">
      <div className="absolute top-5 flex flex-col gap-11 text-white ">
        <img src={cmulogo} alt="CMULogo" className="h-[24px]" />

        {/* instructor dashboard */}
        <div className="flex flex-col gap-11">
          <div className="text-sm flex flex-col gap-[6px]">
            <p className="font-semibold">Welcome to CMU OBE!</p>
            <div className="font-normal flex flex-col gap-[2px]">
              <p>
                Your courses are waiting
                <br />
                on the right to jump in!
                <br />
                Account? Top right menu
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-md font-semibold">Course</p>
            <Button
              className="bg-transparent w-full h-[50px] flex justify-start items-center  px-3 py-1 border-none rounded-lg text-white transition-colors duration-300 hover:bg-[#F0F0F0] hover:text-[#6869AD] focus:border-none group"
              leftSection={
                <Icon
                  className="-mt-4 mr-1 hover:stroke-[#6869AD]"
                  IconComponent={CalendarIcon}
                />
              }
              variant="default"
            >
              <div className="flex flex-col justify-start items-start gap-[7px]">
                <p className="font-medium text-[14px]">Semester</p>
                <p className="font-normal text-[12px]">
                  Course ({selectedTerm?.semester}/
                  {selectedTerm?.year?.toString().slice(-2)})
                </p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
