import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import skillPic from "@/assets/image/skills.png";
import { setShowNavbar, setShowSidebar } from "@/store/config";
import { useParams } from "react-router-dom";
import Icon from "@/components/Icon";
import { Button } from "@mantine/core";
import IconAdd from "@/assets/icons/plus.svg?react";
import ModalAddSkill from "@/components/Modal/ModalAddSkill";

export default function Skills() {
  const dispatch = useAppDispatch();
  const { courseNo } = useParams();
  const [openModalAddSkill, setOpenModalAddSkill] = useState(false);

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  });

  return (
    <>
      <ModalAddSkill
        opened={openModalAddSkill}
        onClose={() => setOpenModalAddSkill(false)}
      />
      <div className=" flex flex-col h-full w-full  overflow-hidden">
        <div className="flex flex-row px-6 pt-3   items-center justify-between">
          <div className="flex flex-col">
            <p className="text-secondary text-[18px] font-semibold "></p>
          </div>
        </div>
        <div className="flex items-center  !h-full !w-full justify-between px-[88px]">
          <div className="h-full  translate-y-2  justify-center flex flex-col">
            <p className="text-secondary text-[21px] font-semibold">
              Let's add some skills for {courseNo}
            </p>
            <br />
            <p className=" -mt-4 mb-6 text-b2 break-words font-medium leading-relaxed">
              No skills here yet! Click 'Add Skill' to guide your students{" "}
              <br /> and make {courseNo} even more impactful.
            </p>
            <Button onClick={() => setOpenModalAddSkill(true)} className="text-center px-4">
              <div className="flex gap-2">
                <Icon IconComponent={IconAdd} />
                Add Skill
              </div>
            </Button>
          </div>
          <div className="h-full  w-[35vw] justify-center flex flex-col">
            <img src={skillPic} alt="notFound"></img>
          </div>
        </div>
      </div>
    </>
  );
}
