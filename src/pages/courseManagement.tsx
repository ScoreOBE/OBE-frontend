import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, Menu, Switch } from "@mantine/core";
import { IconDots, IconTrash, IconEdit } from "@tabler/icons-react";
import { IModelCourse } from "@/models/ModelCourse";
import { getOneCourse } from "@/services/course/course.service";
import { setCourseList } from "@/store/course";
import ManageAdminIcon from "@/assets/icons/manageAdmin.svg?react";
import Icon from "@/components/Icon";

export default function CourseManagement() {
  useEffect(() => {});
  return (
    <div className="bg-[#ffffff] flex flex-col h-full w-full p-6 py-3 gap-3 overflow-hidden">
      <div className="flex flex-row  py-4  items-center justify-between">
        <p className="text-secondary text-[16px] font-semibold">Dashboard</p>
      </div>
      {/* Course Detail */}
      <div className="bg-[#F4F5FE] flex flex-col rounded-lg py-5 px-8 gap-6">
        {/* Course Topic */}
        <div className="gap-3 flex items-center w-full justify-between">
          <div className="flex flex-col w-[25%]">
            <p className="font-semibold text-[14px] text-secondary">
              <p>259194</p>
              {/* {e.courseNo} */}
            </p>
            <p className="text-[12px] font-normal text-[#4E5150] flex-wrap ">
              <p>Charcs&var For Being Pro ENTR</p>
              {/* {e.type === COURSE_TYPE.SEL_TOPIC ? e.topic : e.courseName} */}
            </p>
          </div>
          <div className="flex flex-row items-center justify-between  w-[70%] text-[#4E5150] text-[12px] font-normal ">
            <p className="mr-1 text-wrap">
              Karn P.
              {/* {e.instructor} */}
            </p>
            <p>4 Sections</p>
            <div className="px-4 py-2 bg-[#06B84D] rounded-full text-white text-[12px] font-medium">
              <p>Active</p>
            </div>
            <div className="rounded-full hover:bg-gray-300 p-1 cursor-pointer">
              <IconDots />
            </div>
          </div>
        </div>
        {/* Section */}
        <div className="flex flex-col gap-4">
          <div className="bg-white py-3 px-5 rounded-lg">
            <div className="gap-3 flex items-center ">
              <div className="flex flex-col w-[25%]">
                <p className="font-semibold text-[14px] text-tertiary">
                  <p>Section 001</p>
                  {/* {e.courseNo} */}
                </p>
                <p className="text-[12px] font-normal text-[#4E5150] flex-wrap ">
                  <p>Charcs&var For Being Pro ENTR</p>
                </p>
              </div>

              <div className="flex flex-row gap-[88px] items-center justify-end w-full">
                <div className="flex flex-row  items-center gap-32 justify-end w-full text-[#4E5150] text-[12px] font-normal ">
                  <p className="text-wrap w-[20%] -mr-2">Worapitcha M.</p>

                  <div className="flex flex-col w-[20%] mr-1  gap-1 ">
                    <p className="text-wrap ">Open Semester</p>
                    <p className="text-wrap">1,2 and 3</p>
                  </div>

                  <Switch
                    color="#5C55E5"
                    size="lg"
                    onLabel="ON"
                    offLabel="OFF"
                  />
                </div>
                {/* Button */}
                <div className="flex flex-row gap-4">
                  <Button className="flex flex-row justify-center items-center bg-transparent  border-1 border-secondary text-secondary h-9 w-9 bg-none rounded-lg  cursor-pointer hover:bg-secondary ">
                    <Icon IconComponent={ManageAdminIcon} />
                  </Button>
                  <Button className="flex flex-row justify-center items-center bg-transparent  border-1 border-[#F39D4E] text-[#F39D4E] h-9 w-9 bg-none rounded-lg  cursor-pointer hover:bg-[#F39D4E]">
                    <IconEdit className="size-5" stroke={1.5} />
                  </Button>
                  <Button className="flex flex-row justify-center items-center bg-transparent  border-1 border-[#FF4747] text-[#FF4747] h-9 w-9 bg-none rounded-lg  cursor-pointer hover:bg-[#FF4747]">
                    <IconTrash className="size-5" stroke={1.5} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
