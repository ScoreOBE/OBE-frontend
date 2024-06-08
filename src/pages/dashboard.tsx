import { useAppSelector } from "@/store";
import { Button } from "@mantine/core";
import { useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";

export default function Dashboard() {
  const user = useAppSelector((state) => state.user);
  return (
    <div className=" bg-[#F6F6F6] flex flex-col  h-full w-full p-6 py-5 gap-3">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <p className="text-[#6869AD] text-[22px] font-medium mb-[2px]">
            Hi there, {user.firstNameEN} {user.lastNameEN?.slice(0, 1)}.{" "}
          </p>
          <p className="text-[#575757] text-[14px]">
            In semester 1, 2567! You currently have{" "}
            <span className="text-[#5768D5] font-semibold">20 courses </span> on
            your plate. Let dive in!
          </p>
        </div>
        <Button className=" rounded-[8px] text-[12px] font-medium bg-[#6869AD] h-8 px-2 hover:bg-[#52538A]">
          <IconPlus className="h-5 w-5 mr-1" stroke={1.5} color="#ffffff" />
          Add course
        </Button>
      </div>
      <div
        className="flex w-full h-full bg-white rounded-[5px] p-5"
        style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.50)" }}
      ></div>
    </div>
  );
}
