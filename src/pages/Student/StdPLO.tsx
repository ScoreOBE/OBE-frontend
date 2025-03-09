import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import IconPLO from "@/assets/icons/PLOdescription.svg?react";
import { ROLE } from "@/helpers/constants/enum";
import Loading from "@/components/Loading/Loading";
import { Alert, Button, Tooltip } from "@mantine/core";
import DrawerPLOdes from "@/components/DrawerPLO";
import Icon from "@/components/Icon";
import notFoundImage from "@/assets/image/notFound.jpg";
import IconBulb from "@/assets/icons/bulb.svg?react";
import SpiderChart from "@/components/Chart/SpiderChart";
import { isMobile } from "@/helpers/functions/function";

export default function StdPLO() {
  const { courseNo } = useParams();
  const loading = useAppSelector((state) => state.loading.loading);
  const course = useAppSelector((state) =>
    state.enrollCourse.courses.find((c) => c.courseNo == courseNo)
  );
  const dispatch = useAppDispatch();
  const [openDrawerPLOdes, setOpenDrawerPLOdes] = useState(false);

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.STUDENT));
    localStorage.setItem("dashboard", ROLE.STUDENT);
  }, []);

  return (
    <div className="bg-white flex flex-col h-full w-full sm:px-6 iphone:max-sm:px-3 iphone:max-sm:py-3 sm:py-5 gap-3 overflow-hidden">
      {loading ? (
        <Loading />
      ) : (
        <>
          {course?.plo.id && (
            <DrawerPLOdes
              opened={openDrawerPLOdes}
              onClose={() => setOpenDrawerPLOdes(false)}
              data={course.plo}
            />
          )}
          <div className="flex flex-col   overflow-y-auto overflow-x-hidden max-w-full h-full">
            <div className="flex flex-row pb-[14px] items-center justify-between">
              {!!course?.plos.length ? (
                <>
                  <p className="text-secondary sm:text-[16px] iphone:max-sm:text-[14px] mb-[18px] -mt-1 font-semibold">
                    ผลลัพธ์การเรียนรู้ของหลักสูตร
                    <br />
                    Program Learning Outcome
                  </p>
                  <Button
                    className="text-center px-4"
                    onClick={() => setOpenDrawerPLOdes(true)}
                    color="#e9e9e9"
                  >
                    <div className="flex gap-2 acerSwift:max-macair133:!text-b5 !text-default">
                      <Icon
                        IconComponent={IconPLO}
                        className="acerSwift:max-macair133:!size-3"
                      />
                      PLO Description
                    </div>
                  </Button>
                </>
              ) : (
                <></>
              )}
            </div>
            {!!course?.plos.length ? (
              <div className="flex flex-col gap-1   w-full">
                <Alert
                  variant="light"
                  className="mb-3 "
                  title={` What is PLO? `}
                  icon={<Icon IconComponent={IconBulb} className="size-6 " />}
                  classNames={{ title: "acerSwift:max-macair133:!text-b3" }}
                >
                  <p className="font-normal -mt-1 sm:leading-[22px] iphone:max-sm:leading-[20px] iphone:max-sm:text-[12px] sm:text-[13px]">
                    <span className="font-bold">
                      Program Learning Outcomes (PLO)
                    </span>{" "}
                    defines the overall knowledge, skills, and abilities that
                    students should develop by the time they{" "}
                    <span className="font-bold">complete a degree program</span>
                    . It's like the{" "}
                    <span className="font-bold"> big goals</span> of an entire
                    study program, ensuring that graduates are well-prepared for
                    their careers or further studies. <br /> Unlike{" "}
                    <span className="font-bold">
                      Course Learning Outcomes (CLOs)
                    </span>
                    , which focus on individual courses, PLOs cover multiple
                    courses and integrate various aspects of learning across the
                    program
                  </p>
                </Alert>
                <div
                  className="flex flex-col justify-center items-center border rounded-lg  py-8"
                  style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)" }}
                >
                  <div className="flex flex-col">
                    <p className="text-secondary text-b1 font-semibold text-center">
                      ผลลัพธ์การเรียนรู้ของหลักสูตรประจำกระบวนวิชา {courseNo}
                    </p>
                    <p className="text-[#575757] text-[14px] text-center">
                      Program Learning Outcomes for {courseNo} Course
                    </p>
                  </div>
                  <SpiderChart data={course.plos} height={350} />
                </div>
              </div>
            ) : (
              <div className="flex items-center  !h-full !w-full -mt-[20px] justify-between  sm:px-16">
                <div className="flex flex-col gap-3 iphone:max-sm:text-center sm:text-start">
                  <p className="!h-full text-[20px] text-secondary font-semibold">
                    No PLO
                  </p>
                  <p className=" text-[#333333] -mt-1  text-b2 break-words font-medium leading-relaxed">
                    The PLO will show when the TQF 5 (Course Report) is
                    submitted <br /> by the instructor or co-instructor.
                  </p>
                  {!isMobile && (
                    <Tooltip
                      arrowOffset={125}
                      arrowSize={8}
                      events={{ hover: true, focus: true, touch: true }}
                      arrowRadius={1}
                      transitionProps={{
                        transition: "fade",
                        duration: 300,
                      }}
                      multiline
                      withArrow
                      label={
                        <div className=" text-default text-b3 acerSwift:max-macair133:text-b4 p-2 flex flex-col gap-1 w-[40vw]">
                          <p className="text-secondary font-bold">
                            What is PLO?
                          </p>
                          <p className="font-normal text-b3 acerSwift:max-macair133:text-b4  ">
                            <span className="font-bold">
                              Program Learning Outcomes (PLO)
                            </span>{" "}
                            defines the overall knowledge, skills, and abilities
                            that students should develop by the time they{" "}
                            <span className="font-bold">
                              complete a degree program
                            </span>
                            . It's like the{" "}
                            <span className="font-bold"> big goals</span> of an
                            entire study program, ensuring that graduates are
                            well-prepared for their careers or further studies.
                            <br /> Unlike{" "}
                            <span className="font-bold">
                              Course Learning Outcomes (CLOs)
                            </span>
                            , which focus on individual courses, PLOs cover
                            multiple courses and integrate various aspects of
                            learning across the program
                          </p>
                        </div>
                      }
                      color="#FCFCFC"
                      className="w-fit border rounded-md sm:max-acerSwift:!-ml-2"
                      position="bottom-start"
                    >
                      <Button
                        className="mt-3 flex justify-center items-center"
                        variant="light"
                        leftSection={
                          <Icon
                            IconComponent={IconBulb}
                            className="size-[20px] stroke-[1.5px] -mt-[2px]  items-center"
                          />
                        }
                      >
                        What is PLO?
                      </Button>
                    </Tooltip>
                  )}
                </div>
                {!isMobile && (
                  <div className=" items-center justify-center flex">
                    <img
                      src={notFoundImage}
                      className="h-full items-center  w-[24vw] justify-center flex flex-col"
                      alt="notFound"
                    ></img>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
