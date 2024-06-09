import { useState } from "react";
import { Button, Input } from "@mantine/core";
import Profile from "./Profile";
import { TbSearch } from "react-icons/tb";
import { useLocation } from "react-router-dom";
import { ROUTE_PATH } from "@/helpers/constants/route";

export default function Navbar() {
  const location = useLocation().pathname;
  return (
    <div
      style={{ boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.20)" }}
      className="min-h-14 drop-shadow-md px-6 rounded-tl-3xl inline-flex flex-wrap justify-between items-center z-50 bg-white font-sf-pro text-primary text-xl"
    >
      <p className="font-medium">Your Courses</p>
      {[ROUTE_PATH.DASHBOARD_INS].includes(location) && (
        <Input
          leftSection={<TbSearch />}
          placeholder="Course"
          className="w-[400px] focus:border-none"
          classNames={{ input: "bg-gray-200 rounded-md border-none" }}
        ></Input>
      )}
      <Profile />
    </div>
  );
}
