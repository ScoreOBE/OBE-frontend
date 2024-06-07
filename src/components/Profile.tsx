import { useState } from "react";
import { Button, Input } from "@mantine/core";
import { useAppSelector } from "@/store";
import { CgProfile } from "react-icons/cg";

export default function Profile() {
  const user = useAppSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div
        className="inline-flex justify-center items-center gap-3 rounded-md py-0.5 px-1 cursor-pointer hover:bg-gray-200"
        onClick={() => setShowMenu(true)}
      >
        <div className="flex flex-col text-sm text-end">
          <p className="text-black font-bold">
            {user.firstNameEN} {user.lastNameEN?.slice(0, 1)}.
          </p>
          <p className="font-medium">{user.role}</p>
        </div>
        <CgProfile color="black" size={35} />
      </div>
      {showMenu && <></>}
    </>
  );
}
