"use client";
import cmulogoLogin from "@/assets/image/cmuLogoLoginWhite.png";
import loginImage from "@/assets/image/loginPage.png";
import { Accordion, Alert, Button, Tabs, Title } from "@mantine/core";
import { Image } from "@mantine/core";
import OBEDocument from "@/assets/document.pdf";
import ModalTermsOfService from "@/components/Modal/ModalTermOfService";
import scoreobe from "@/assets/image/scoreOBElogobold.png";
import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isEmpty } from "lodash";
import {
  setShowSidebar,
  setShowNavbar,
  setShowButtonLogin,
} from "@/store/config";
import Icon from "@/components/Icon";
import IconLock from "@/assets/icons/lockIcon.svg?react";
import IconExternal from "@/assets/icons/externalLink.svg?react";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconEdit from "@/assets/icons/edit.svg?react";
import IconRefresh from "@/assets/icons/refresh.svg?react";
import IconChevronRight from "@/assets/icons/chevronRight.svg?react";
import IconBulb from "@/assets/icons/bulb.svg?react";
import IconSparkle from "@/assets/icons/sparkle.svg?react";
import IconChevronLeft from "@/assets/icons/chevronLeft.svg?react";
import IconSearch from "@/assets/icons/search.svg?react";
import IconPlus2 from "@/assets/icons/plus2.svg?react";
import IconExcel from "@/assets/icons/excel.svg?react";
import IconShare2 from "@/assets/icons/share2.svg?react";
import IconHistogram from "@/assets/icons/histogram.svg?react";
import IconClick from "@/assets/icons/click.svg?react";
import IconPublish1 from "@/assets/icons/eyePublish.svg?react";
import IconPublish2 from "@/assets/icons/publishEach.svg?react";
import IconRocket from "@/assets/icons/rocket.svg?react";
import IconWand from "@/assets/icons/wand.svg?react";
import IconChecklist from "@/assets/icons/checklist.svg?react";
import IconChartBar from "@/assets/icons/chartBar.svg?react";
import IconRadar from "@/assets/icons/radar.svg?react";
import gradescope from "@/assets/image/gradescope.png";
import "@mantine/carousel/styles.css";
import { goToDashboard, isMobile } from "@/helpers/functions/function";
import studentPLOPage from "@/assets/image/studentPLO.png";
import LoadingOverlay from "@/components/Loading/LoadingOverlay";
import exportScoreImg from "@/assets/image/exporScore.png";
import cpeLogoRed from "@/assets/image/cpeLogoRed.png";
import publishScoreImg from "@/assets/image/publishScore.png";
import tqf3Pt1Img from "@/assets/image/tqf3pt1.png";
import tqf3Pt2Img from "@/assets/image/tqf3pt2.png";
import tqf3Pt3Img from "@/assets/image/tqf3pt3.png";
import tqf3Pt4Img from "@/assets/image/tqf3pt4.png";
import tqf3Pt5Img from "@/assets/image/tqf3pt5.png";
import tqf3Pt6Img from "@/assets/image/tqf3pt6.png";
import tqf3Pt7Img from "@/assets/image/tqf3pt7.png";
import tqf5Pt1Img from "@/assets/image/tqf5pt1.png";
import tqf5Pt2Img from "@/assets/image/tqf5pt2.png";
import tqf5Pt3Img from "@/assets/image/tqf5pt3.png";
import chartImg from "@/assets/image/chart.png";
import tqfOverviewImg from "@/assets/image/tqfOverview.png";
import exportTQFImag from "@/assets/image/exportTQF.png";
import courseManagementImg from "@/assets/image/courseManagement.png";
import cloManagementImg from "@/assets/image/cloManagement.png";
import ploManagementImg from "@/assets/image/ploManagement.png";
import addPLOColImg from "@/assets/image/addPLOCol.png";
import ploMappingImg from "@/assets/image/ploMapping.png";
import reuseTQF3Img from "@/assets/image/reuseTQF3.png";
import { useScrollIntoView } from "@mantine/hooks";
import { ROUTE_PATH } from "@/helpers/constants/route";

export default function Login() {
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >();
  const tqf3List = [
    {
      id: "1",
      topic: "Course Information",
      description:
        "Enter basic course details, including the curriculum, course type, and instructor's name.",
      img: tqf3Pt1Img,
    },
    {
      id: "2",
      topic: "Description and Planning",
      description:
        "Plan your course by entering teaching methods, CLOs, course content, and schedule.",
      img: tqf3Pt2Img,
    },
    {
      id: "3",
      topic: "Course Evaluation",
      description:
        " users can choose how they want to be graded and ensure that all course topics are given 100% weight in the assessment.",
      img: tqf3Pt3Img,
    },
    {
      id: "4",
      topic: "Assessment Mapping",
      description:
        "In this section, choose the assessment tools for each CLO, set the assessment percentage, and specify the week for each assessment.",
      img: tqf3Pt4Img,
    },
    {
      id: "5",
      topic: "Course Materials",
      description: "Specify the documents and media used for teaching.",
      img: tqf3Pt5Img,
    },
    {
      id: "6",
      topic: "Course evaluation and improvement processes",
      description:
        "Describe the course evaluation methods and improvement plans for the next semester.",
      img: tqf3Pt6Img,
    },
    {
      id: "7",
      topic: "Curriculum Mapping",
      description:
        "Mapping CLOs to the relevant PLOs for analyzing the performance of each student's PLOs.",
      img: tqf3Pt7Img,
    },
  ];
  const [openModalTOS, setOpenModalTOS] = useState(false);
  const currentYear = new Date().getFullYear();

  const tqf5List = [
    {
      id: "1",
      topic: "Course Evaluation",
      description:
        "Import grade sheets for processing, or manually enter the number of students who received each grade and complete the corresponding criteria.",
      img: tqf5Pt1Img,
    },
    {
      id: "2",
      topic: "Assessment tool mapping to CLO",
      description:
        "Select the assessment tool to use for this CLO and determine which items to process.",
      img: tqf5Pt2Img,
    },
    {
      id: "3",
      topic: "(Rubrics for CLO evaluation",
      description:
        "Review the assessment tool scores and score ranges for each CLO, and include the rubrics for CLO/CSO evaluation.",
      img: tqf5Pt3Img,
    },
  ];
  const [selectTQF3Image, setSelectTQF3Image] = useState(tqf3List[0].img);
  const [selectTQF5Image, setSelectTQF5Image] = useState(tqf5List[0].img);

  useEffect(() => {
    dispatch(setShowSidebar(false));
    dispatch(setShowNavbar(true));
    if (!isEmpty(user)) {
      goToDashboard(user.role);
    }
  }, [user]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        dispatch(setShowButtonLogin(!entry.isIntersecting));
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (buttonRef.current) {
      observer.observe(buttonRef.current);
    }

    return () => {
      if (buttonRef.current) {
        observer.unobserve(buttonRef.current);
      }
    };
  }, []);

  const ButtonLogin = () => {
    return (
      <a href={import.meta.env.VITE_CMU_ENTRAID_URL}>
        <Button
          // ref={buttonRef}
          className="z-[52]   iphone:max-sm:!rounded-3xl iphone:max-sm:px-8 bg-[#5768d5] hover:bg-[#4b5bc5] active:bg-[#4857ba]  sm:!text-[14px] iphone:max-sm:!text-[13px] !h-[44px]"
        >
          <img
            src={cmulogoLogin}
            alt="CMULogo"
            className="sm:h-[13px] iphone:max-sm:h-[10px] mr-3 rounded-1xl"
          />
          Sign in CMU account
        </Button>
      </a>
    );
  };

  const ButtonCourseSyllabus = () => {
    return (
      <Button
        variant="light"
        ref={buttonRef}
        leftSection={<Icon IconComponent={IconSearch} className="size-4" />}
        onClick={() =>
          window.open(`${window.location.origin}${ROUTE_PATH.COURSE_SYLLABUS}`)
        }
        className="z-[52] drop-shadow-2xl iphone:max-sm:!rounded-3xl iphone:max-sm:px-8 !px-9 sm:!text-[14px] iphone:max-sm:!text-[13px] !h-[44px]"
      >
        Search Course Syllabus
      </Button>
    );
  };

  return (
    <div
      className=" bg-[#fafafa]  h-full w-screen items-center flex flex-col overflow-y-auto overflow-x-hidden"
      ref={scrollableRef}
    >
      <ModalTermsOfService
        opened={openModalTOS}
        onClose={() => setOpenModalTOS(false)}
      />
      <div className="relative flex flex-col w-full">
        <div className="max-sm:hidden absolute z-10 h-screen w-screen top-screen flex justify-center items-end pb-28 max-macair133:pb-32">
          <div
            className="arrowCTA"
            onClick={() =>
              scrollIntoView({
                alignment: "center",
              })
            }
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <p className="!font-[600] text-center drop-shadow-xl cursor-default px-[12px]  w-full mt-[70px] sm:mt-8 sm:font-[600] item-start rounded text-emphasize sm:text-[48px] text-[32px] mb-5 sm:mb-0  ipad11:text-[50px] leading-[48px] sm:leading-[66px]">
          <span className=" !drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
            ScoreOBE+{" "}
          </span>
          {!isMobile && (
            <>
              Academic Supercharger
              <br />
              for instructors and students
            </>
          )}
        </p>
        {!isMobile ? (
          <p className="mt-5 text-h2 text-[#4F4D55] iphone:max-sm:text-[14px] w-full  sm:flex justify-center items-center text-center sm:px-[118px] px-[40px] font-[500]">
            Discover A Better Way to Do OBE Simplify Your Academic Journey
          </p>
        ) : (
          <p className="mt-5 text-h2 text-[#4F4D55] iphone:max-sm:text-[16px] w-full  sm:flex justify-center items-center text-center sm:px-[118px] px-[40px] font-[500]">
            Academic Supercharger for instructors and students
          </p>
        )}
        <div className=" mx-8">
          <Alert
            radius="md"
            variant="light"
            color="indigo"
            className=" iphone:max-sm:flex hidden w-full items-center justify-center mt-6 "
            classNames={{
              body: " flex justify-center",
              root: "border border-blue-100 rounded-xl text-blue-700",
            }}
            title={
              <div className="flex items-center gap-2 text-[12px]">
                <Icon
                  IconComponent={IconExclamationCircle}
                  className="acerSwift:max-macair133:size-5"
                />
                <p>
                  Some features may not be fully supported on smaller screens.
                </p>
              </div>
            }
          ></Alert>
        </div>
        <div className="items-center  mt-8 iphone:max-sm:mb-12 text-center w-full justify-center flex  flex-col gap-4">
          <div>{ButtonLogin()}</div>
          <div>{ButtonCourseSyllabus()}</div>
        </div>
        <div
          data-aos-duration="1000"
          data-aos-once="false"
          data-aos="fade-up"
          className="rounded-t-xl mx-[118px] sm:flex sm:flex-col hidden mt-8  "
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className=" sm:flex relative hidden  items-center rounded-t-xl justify-center p-5 py-[9px] border-b-[1px] border-[#eeeeee] flex-row gap-0 w-full bg-white">
            <div className=" absolute -top-10 py-20 max-macair133:py-40  rotate-180 -z-50 w-screen h-screen  flex justify-center">
              <div className="rounded-full h-full w-3/6 bg-[#FF7847] opacityy-50 bg-blur"></div>
              <div className="rounded-full h-[97%] w-3/6 bg-[#FF469D] opacityy-50 bg-blur"></div>
              <div className="rounded-full h-[97%] w-3/6 bg-[#7733FF] opacityy-50 bg-blur"></div>
              <div className="rounded-full h-[97%] w-3/6 bg-[#0A7CFF] opacityy-50 bg-blur"></div>{" "}
              <div className="rounded-full h-[97%] w-3/6 bg-[#00abdf] opacityy-50 bg-blur"></div>
            </div>
            <div className=" justify-start w-[35%] sm:flex hidden flex-row gap-6 items-center">
              <div className="flex  flex-row gap-2">
                <div className=" rounded-full w-[12px] h-[12px] bg-[#ED6A5E]"></div>
                <div className=" rounded-full w-[12px] h-[12px] bg-[#F4BF4F]"></div>
                <div className=" rounded-full w-[12px] h-[12px] bg-[#61C554]"></div>
              </div>

              <div className="flex flex-row gap-2">
                <Icon
                  IconComponent={IconChevronLeft}
                  className="text-[#8c8c8c] size-[22px]"
                />
                <Icon
                  IconComponent={IconChevronRight}
                  className="text-[#8c8c8c] size-[22px]"
                />
              </div>
            </div>
            <div className="sm:flex w-[30%] hidden  flex-row gap-2">
              <div className=" h-[28px] relative rounded-lg w-full text-[12px] gap-2 font-medium flex  items-center bg-[#F1F1F1]">
                <div className="justify-center gap-2 items-center w-full flex">
                  <Icon
                    IconComponent={IconLock}
                    className="text-[#8c8c8c] size-[14px]"
                  />
                  score-obe.cpe.eng.cmu.ac.th
                </div>
                <Icon
                  IconComponent={IconRefresh}
                  className="absolute right-3 justify-end size-[12px] text-[#3c3c3c]"
                />
              </div>
            </div>
            <div className="flex w-[35%] justify-end items-center flex-row gap-2">
              <Icon
                IconComponent={IconShare2}
                className="text-[#8c8c8c] size-[20px]"
              />
              <Icon
                IconComponent={IconPlus2}
                className="text-[#8c8c8c] size-[20px]"
              />
            </div>
          </div>

          <img src={loginImage} alt="loginImage" />
        </div>

        {/* Upload, Publish grading efficiency. */}
        <div className="bg-[#fafafa] sm:flex   h-full w-full gap-16 ">
          <div className="relative items-start text-start pb-32 justify-start w-full overflow-clip">
            {" "}
            <div className="absolute left-0 right-0 bottom-0 z-0 h-40 bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00] blur-[160px]"></div>
            <div className="relative">
              <div
                className="relative h-fit w-full iphone:max-sm:-translate-y-20 py-20 mt-16 max-macair133:mt-8 sm:px-[118px] iphone:max-sm:px-8"
                ref={targetRef}
              >
                <div className="absolute ml-[40%]  max-macair133:ml-0 left-0 right-0 bottom-40 z-0 max-macair133:h-16 h-20 bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00] blur-[160px] max-macair133:blur-[200px]"></div>
                <p className="drop-shadow-xl pb-2 cursor-default leading-[56px] iphone:max-sm:!leading-[36px] max-macair133:text-center text-[#000000] text-[48px] ">
                  <span className="font-[700] iphone:max-sm:!text-[24px] iphone:max-sm:!leading-[12px] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00] drop-shadow-xl pb-2 cursor-default sm:leading-[56px] sm:text-[48px] max-macair133:text-[44px]">
                    Import, Publish
                    <br /> grading efficiency.
                  </span>{" "}
                  <br />
                </p>
                <div className="flex max-macair133:flex-col max-macair133:gap-24 items-center justify-between">
                  <p className="mt-5 iphone:max-sm:text-[14px] text-[19px] max-macair133:text-[17px] max-macair133:text-center text-black font-[600]">
                    Effortless score import, instant analytics, <br /> and
                    visual insights! Elevate your grading today! <br />
                  </p>
                  <div className="flex iphone:max-sm:flex-col justify-end gap-10 iphone:max-sm:gap-2 iphone:max-sm:ml-0 ml-12 -mt-14">
                    <div className="flex justify-start flex-col items-start mt-2 mb-2 p-7 rounded-xl bg-white/65 backdrop-blur-[100px] shadow-lg">
                      <img
                        src={gradescope}
                        alt="CMULogo"
                        className="h-[32px] sm:flex "
                      />
                      <p className=" text-black font-[700] pt-4 ">
                        Gradescope Support
                      </p>
                      <p className=" text-default font-[600] pt-2 text-b2  leading-[22px]">
                        Effortless import Gradescope <br /> assignment template
                      </p>
                    </div>
                    <div className="flex justify-start flex-col items-start mt-2 mb-2 bg-black p-7 rounded-xl bg-white/65 backdrop-blur-[100px] shadow-lg">
                      <Icon IconComponent={IconHistogram} className="size-8" />
                      <p className=" text-black font-[700] pt-4 ">
                        Statistics & Histogram
                      </p>
                      <p className="text-default font-[600] pt-2 text-b2 leading-[22px] ">
                        Visualize your grade <br /> with interactive charts
                      </p>
                    </div>
                    <div className="flex justify-start flex-col items-start mt-2 mb-2 bg-black p-7 rounded-xl bg-white/65 backdrop-blur-[100px] shadow-lg">
                      <Icon IconComponent={IconEdit} className="size-8" />
                      <p className=" text-black font-[700] pt-4 ">
                        On-the-Spot Edits
                      </p>
                      <p className=" text-default font-[600] pt-2 text-b2 leading-[22px]">
                        Modify student scores <br /> directly within the system.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-20 sm:px-[118px] iphone:max-sm:-mt-20 iphone:max-sm:px-8">
                <div className="flex flex-col items-start text-start">
                  <div className="font-[700] iphone:max-sm:!text-[28px] iphone:max-sm:!leading-[36px] flex flex-col gap-1 text-[#ec407a] drop-shadow-xl pb-2 cursor-default mt-16 leading-[56px]  items-start text-[48px] ">
                    <p>See Beyond the Scores</p>
                    <p className="text-[#1D1D1F]">
                      Where Insight Ignites Impact
                    </p>
                  </div>
                  <p className="mt-5 text-[17px] iphone:max-sm:!text-[14px] text-deemphasize font-[600] text-wrap sm:w-[750px]">
                    ScoreOBE+ turns data into actionable insights that{" "}
                    <span className="text-emphasize">
                      support teaching excellence <br /> and elevate learning
                      outcomes.
                    </span>
                  </p>
                </div>
                <div className="flex items-center">
                  <Image
                    src={chartImg}
                    alt="chartImg"
                    className="w-[85%] sm:flex iphone:max-sm:hidden max-macair133:w-[95%] max-macair133:-ml-[30%]  -ml-[20%] mx-0"
                  />
                  <div className="flex flex-col w-[40%] h-full gap-8 max-macair133:gap-4 text-[18px] ">
                    <div className="flex flex-col gap-2 items-start mt-2 mb-2">
                      <p className="font-[700] text-[36px] iphone:max-sm:!text-[24px] max-macair133:text-[34px] text-emphasize">
                        Statistics & Chart
                      </p>
                      <p className="text-[17px] max-macair133:text-[15px] text-deemphasize font-[600] text-wrap w-[750px]">
                        Visualize your grade with interactive charts
                      </p>
                    </div>
                    <div className="flex justify-start flex-col items-start mt-2 mb-2">
                      <Icon
                        IconComponent={IconChartBar}
                        className="size-9 max-macair133:size-8 -ml-1"
                      />
                      <p className=" text-black font-[700] sm:w-[400px] !w-[90vw] pt-4">
                        Clear Overview of Performance
                      </p>
                      <p className=" text-deemphasize font-[600] pt-2 text-[15px] leading-[22px] sm:w-[400px] iphone:max-sm:!w-[90vw] !w-[30vw]">
                        Provides a comprehensive view of student performance
                        <span className="text-emphasize">
                          {" "}
                          across each assignment and question.
                        </span>
                      </p>
                    </div>
                    <div className="flex justify-start flex-col items-start mt-2 mb-2">
                      <Icon
                        IconComponent={IconHistogram}
                        className="size-8 max-macair133:size-7"
                      />
                      <p className=" text-black font-[700] sm:w-[400px] iphone:max-sm:!w-[90vw] !w-[30vw] pt-4 ">
                        Unlock In-Depth Statistical Insights
                      </p>
                      <p className=" text-deemphasize font-[600] pt-2 text-[15px] leading-[22px] sm:w-[400px] iphone:max-sm:!w-[90vw] !w-[30vw]">
                        <span className="text-emphasize">
                          Analyze key metrics{" "}
                        </span>
                        like mean and standard deviation{" "}
                        <span className="text-emphasize">
                          to easily identify areas for improvement.{" "}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-20 items-center">
                  <div className="flex flex-col w-[50%] h-full gap-8 text-[18px] ">
                    <div className="flex flex-col gap-2 items-start mt-2 mb-2">
                      <p className="font-[700] iphone:max-sm:!text-[28px]  text-[36px] max-macair133:text-[34px] text-emphasize">
                        PLO Performance <br />
                        <span className="-mt-1"> Spider Chart</span>
                      </p>
                      <p className="text-[17px] max-macair133:text-[15px] text-deemphasize font-[600] text-wrap sm:w-[400px] iphone:max-sm:!w-[90vw] !w-[30vw] ">
                        Visualize student progress{" "}
                        <span className="text-emphasize">
                          in each course and across <br /> the entire curriculum{" "}
                        </span>
                        , aligned with Program Learning Outcomes (PLOs).
                      </p>
                    </div>
                    <div className="flex justify-start flex-col items-start mt-2 mb-2">
                      <Icon IconComponent={IconRadar} className="size-8" />
                      <p className=" text-black font-[700] pt-4 ">
                        Students Can Track Their Own Performance
                      </p>
                      <p className=" text-deemphasize font-[600] pt-2 text-[15px] leading-[22px] sm:w-[400px] iphone:max-sm:!w-[90vw] !w-[30vw]">
                        <span className="text-emphasize">
                          Gain clear insights into your progress{" "}
                        </span>{" "}
                        across courses and learning outcomes, and discover areas
                        to improve.
                      </p>
                      <p className=" text-deemphasize underline font-[600]  mt-10 text-[15px] leading-[22px] sm:w-[400px] iphone:max-sm:!w-[90vw] !w-[30vw]">
                        Available now
                      </p>
                    </div>
                  </div>
                  <Image
                    src={studentPLOPage}
                    alt="CMULogo"
                    className="w-[85%] sm:flex hidden max-macair133:w-[95%] max-macair133:-ml-[5%] -translate-x-28"
                  />
                </div>

                <div className="flex flex-col gap-20 iphone:max-sm:-mt-20 ">
                  <div className="flex flex-col items-center">
                    <div className="font-[700] flex flex-col iphone:max-sm:text-[28px] gap-1 text-[#ec407a] drop-shadow-xl pb-2 cursor-default mt-16 sm:leading-[56px] items-center text-[48px] max-macair133:text-[44px] ">
                      Easily Manage Scores <br />{" "}
                      <span className=" text-emphasize">
                        with Export and Publish
                      </span>
                    </div>
                    <p className="mt-5 text-[17px] max-macair133:text-[15px]  text-deemphasize font-[600] text-wrap sm:w-[400px] !w-[90vw] text-center">
                      Make managing scores easier than ever. With our intuitive
                      export and publish options, you can{" "}
                      <span className="text-emphasize">
                        quickly organize, share, and update student data with
                        just a few clicks.
                      </span>
                    </p>
                  </div>

                  <div className="sm:flex hidden justify-center gap-16">
                    <div
                      style={{
                        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.45)",
                      }}
                      className="relative rounded-2xl h-[550px] w-[600px] bg-gradient-to-b shadow-xl from-[#7161ef]  via-[#957fef] to-[#b79ced] border-t-[1px] overflow-clip"
                    >
                      <div
                        className={`h-full w-full overflow-clip rounded-xl -translate-x-20 translate-y-40 shadow-2xl max-macair133:-translate-x-14`}
                      >
                        <Image
                          src={publishScoreImg}
                          className={`h-[500px] sm:flex w-full object-cover rounded-xl translate-x-14 -translate-y-8 max-macair133:translate-x-10`}
                        />
                      </div>
                      <Icon
                        IconComponent={IconPublish1}
                        className="absolute bottom-10 right-12 max-macair133:right-2 max-macair133:size-16 size-20 text-white "
                      />
                      <Icon
                        IconComponent={IconPublish2}
                        className="absolute top-24 right-[300px] max-macair133:right-12 max-macair133:top-20  size-14 stroke-slate-200 text-white "
                      />

                      <div className="absolute top-2 left-2 rounded-xl">
                        <div className="top-0 flex flex-col justify-end p-6 ">
                          <p className="opacity-70 font-bold uppercase cursor-default  text-white">
                            Publish
                          </p>
                          <Title
                            order={3}
                            className="font-bold text-[28px] max-macair133:text-[24px] w-[500px] max-macair133:w-[400px] cursor-default text-white"
                          >
                            Quickly publish scores for individual or all
                            sections.
                          </Title>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.45)",
                      }}
                      className="relative rounded-2xl h-[550px] w-[600px] bg-gradient-to-b shadow-xl from-[#5390d9] via-[#4ea8de] to-[#48bfe3] border-t-[1px] overflow-clip"
                    >
                      <div
                        className={`h-full w-full overflow-clip rounded-xl translate-x-20 translate-y-40 max-macair133:translate-x-12 shadow-2xl`}
                      >
                        <Image
                          src={exportScoreImg}
                          className={`h-[700px] max-macair133:h-[685px] w-full object-cover rounded-xl -translate-y-[150px] -translate-x-9 max-macair133:-translate-y-[140px] max-macair133:-translate-x-1`}
                        />
                      </div>
                      <Icon
                        IconComponent={IconExcel}
                        className="absolute bottom-10 left-6 size-20 max-macair133:top-44 max-macair133:size-12 -rotate-12 text-white "
                      />
                      <Icon
                        IconComponent={IconClick}
                        className="absolute top-32 right-10 size-14 -rotate-12 text-white max-macair133:size-12 max-macair133:-mt-2 max-macair133:-ml-20"
                      />

                      <div className="absolute top-2 left-2 rounded-xl">
                        <div className="top-0 flex flex-col justify-end p-6 ">
                          <p className="opacity-70 font-bold  cursor-default  text-white">
                            EXPORT
                          </p>
                          <Title
                            order={3}
                            className="font-bold text-[28px] max-macair133:text-[22px] cursor-default text-white"
                          >
                            Export score data to .xlsx files <br />
                            for each section with a single click.
                          </Title>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TQFs */}
        <div className="sm:flex flex-col w-full h-fit iphone:max-sm:-translate-y-20 pt-16 ">
          <div className="flex flex-col items-start text-start sm:px-28 px-10">
            <div className="font-[700] flex flex-col gap-1 iphone:max-sm:text-[28px] text-[#ec407a] drop-shadow-xl pb-2 cursor-default mt-16 sm:leading-[56px]  items-start text-[48px] max-macair133:text-[44px] ">
              <p>New TQF system</p>
              <p className="text-[#1D1D1F]">Convenient, Fast and Effortless</p>
            </div>
            <p className="mt-5 text-[17px]max-macair133:text-[15px]  text-deemphasize font-[600] text-wrap sm:w-[750px] iphone:max-sm:!w-[80vw] !w-[30vw]">
              With ScoreOBE+, generating TQF 3 and TQF 5 reports is now easier
              than ever. Automatically compile course objectives, track learning
              progress, and align with program goals —all in one place. Save
              time, reduce paperwork, and focus more on what matters:{" "}
              <span className="text-emphasize">
                {" "}
                improving teaching quality and student outcomes. Effortless
                reporting for impactful education.
              </span>
            </p>
          </div>

          {/* benefit */}
          <div className="flex flex-col mt-16 iphone:max-sm:-mt-48  ">
            <div className="flex gap-16 h-screen w-screen justify-center items-center">
              <div className="flex flex-col gap-6 items-start text-start">
                <p className="font-[700]  flex flex-col gap-1 text-emphasize drop-shadow-xl cursor-default items-start text-[28px] max-macair133:text-[24px]">
                  Create TQF Reports <br /> Quickly and Easily.
                </p>
                <p className=" text-[17px] max-macair133:text-[15px] text-deemphasize font-[600] text-wrap sm:w-[400px] iphone:max-sm:!w-[80vw] !w-[30vw]">
                  <span className="text-emphasize">
                    Save time, reduce effort, and ensure consistency across all
                    your reports.
                  </span>{" "}
                  With our software, generating TQF 3 and TQF 5 reports has
                  never been easier. Streamline your process and focus on what
                  truly matters—creating quality content.
                </p>
              </div>

              {/* Image */}
              <div
                className={`sm:h-[80%] sm:w-[50% sm:flex hidden sm:object-cover rounded-xl max-macair133:w-[45%]`}
              >
                <Image
                  src={exportTQFImag}
                  className={`h-full w-full object-cover rounded-xl`}
                />
              </div>
            </div>
          </div>

          <div className="bg-[#fafafa] py-14 flex flex-col iphone:max-sm:-mt-80 gap-10 -mt-24">
            {/* TQF3 */}
            <div className="flex flex-col items-center text-center font-[600] gap-14 ">
              <div className="mx-28">
                <div className="font-[700] flex flex-col gap-1 iphone:max-sm:text-[28px] text-[#ec407a] drop-shadow-xl pb-2 cursor-default mt-16 sm:leading-[56px] items-center text-[48px] max-macair133:text-[44px] ">
                  <p>TQF 3</p>
                  <p className="text-[#1D1D1F]">Save Time & Focus on Content</p>
                </div>
                <p className="mt-5 text-[17px] max-macair133:text-[15px] text-deemphasize font-[600] text-wrap sm:w-[800px] iphone:max-sm:!w-[80vw] !w-[30vw]">
                  With our reusable TQF 3 templates, you can{" "}
                  <span className="text-emphasize">
                    {" "}
                    generate reports quickly and easily. No more redundant data
                    entry{" "}
                  </span>
                  —just fill in the essential details and get a polished report
                  ready in minutes.
                </p>
              </div>

              <div className="relative sm:flex sm:gap-16 iphone:max-sm:flex-col iphone:max-sm:gap-5  ">
                <div className="absolute left-0 right-0 top-[75%] z-0 h-20 bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00] blur-[160px]"></div>
                <div className="flex flex-col iphone:max-sm:mb-4 items-center justify-center gap-3 text-pretty w-[370px]  max-macair133:w-[330px]  border shadow-md bg-white/65 backdrop-blur-[150px] border-24 rounded-lg py-6">
                  <div className=" flex flex-col gap-1">
                    <Icon
                      IconComponent={IconBulb}
                      className="size-16 stroke-1"
                    />
                    <p className="text-center">
                      Reusable TQF 3 Templates <br />
                    </p>
                  </div>
                  <p className="text-[#86868B] max-macair133:text-[14px] ">
                    Eliminate repetitive data entry <br />
                    and quickly customize each report
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 text-pretty w-[370px]   max-macair133:w-[330px] border shadow-md bg-white/65 backdrop-blur-[150px] border-24 rounded-lg py-6">
                  <div className=" flex flex-col gap-1">
                    <Icon
                      IconComponent={IconBulb}
                      className="size-16 stroke-1"
                    />
                    <p className="text-center">
                      Consistency Across Reports <br />
                    </p>
                  </div>
                  <p className="text-[#86868B]  max-macair133:text-[14px]">
                    Ensure alignment and consistency <br /> across all reports.
                  </p>
                </div>
              </div>

              <div className="mx-28 max-macair133:mx-10 ">
                <div className=" flex h-fit w-full rounded-xl bg-white shadow-md backdrop-blur-[120px]  overflow-clip">
                  <Accordion defaultValue="1" className="p-6">
                    {tqf3List.map((item) => {
                      return (
                        <Accordion.Item
                          key={item.id}
                          value={item.id}
                          className="w-[400px] max-macair133:w-[300px]"
                          onClick={() => {
                            setSelectTQF3Image(item.img);
                          }}
                        >
                          <Accordion.Control className="h-full min-h-[80px] samsungA24:min-h-[100px] text-[18px]">
                            <p className="text-[17px] font-[700] text-emphasize">
                              Part {item.id}
                            </p>
                            <p className="text-[14px] font-[600] text-deemphasize">
                              {item.topic}
                            </p>
                          </Accordion.Control>
                          <Accordion.Panel className="text-start text-[14px] font-[600] w-[95%]">
                            {item.description}
                          </Accordion.Panel>
                        </Accordion.Item>
                      );
                    })}
                  </Accordion>

                  {/* Image */}
                  <div className="flex items-center justify-center">
                    <Image
                      src={selectTQF3Image}
                      className={`w-[90%] max-macair133:w-full max-macair133:translate-x-16 samsungA24:w-[80%] object-cover  `}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* TQF5*/}
            <div className="flex flex-col items-center text-center font-[600] gap-14">
              <div className="flex flex-col items-center mx-28">
                <div className="font-[700] flex flex-col iphone:max-sm:text-[28px] gap-1 text-[#ec407a] drop-shadow-xl pb-2 cursor-default mt-16 sm:leading-[56px] items-center text-[48px]  max-macair133:text-[44px]">
                  <p>TQF 5</p>
                  <p className="text-[#1D1D1F]">
                    Unlock Deep Insights into Your Course
                  </p>
                </div>
                <p className="mt-5 text-[17px]  max-macair133:text-[15px] text-deemphasize font-[600] text-wrap sm:w-[800px] iphone:max-sm:!w-[80vw] !w-[30vw] ">
                  <span className="text-emphasize">
                    TQF 5 helps you analyze course objectives based on real
                    student performance data
                  </span>
                  , empowering you to make data-driven improvements and align
                  your courses with institutional goals.
                </p>
              </div>

              <div className="relative sm:flex  iphone:max-sm:flex-col gap-16 ">
                <div className="absolute left-0 right-0 top-[50%] iphone:max-sm:mb-4 z-0 h-20 bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00] blur-[160px]"></div>
                <div className="relative flex flex-col items-center iphone:max-sm:mb-4 gap-3 text-pretty w-[370px] iphone:max-sm:py-8 max-macair133:w-[330px] border shadow-md bg-white/65 backdrop-blur-[150px] border-24 p-6 rounded-lg">
                  <div className=" flex flex-col gap-1">
                    <Icon
                      IconComponent={IconBulb}
                      className="size-16 stroke-1"
                    />
                    <p className="text-center">
                      System & Manual
                      <br />
                    </p>
                  </div>
                  <p className="text-[#86868B] max-macair133:text-[14px]">
                    Choose automated or manual processes for TQF 5 reports,
                    providing versatility for any reporting need.
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center iphone:max-sm:mb-4 gap-3 text-pretty w-[370px] iphone:max-sm:py-8 max-macair133:w-[330px]  border shadow-md bg-white/65 backdrop-blur-[150px] border-24 rounded-lg">
                  <div className=" flex flex-col gap-1">
                    <Icon
                      IconComponent={IconBulb}
                      className="size-16 stroke-1"
                    />
                    <p className="text-center">
                      Assessment tool mapping to CLO
                      <br />
                    </p>
                  </div>
                  <p className="text-[#86868B]  max-macair133:text-[14px]">
                    CLOs can be mapped to assessment tools
                    <br /> on a detailed, item-by-item basis <br />
                    for more precise results.
                  </p>
                </div>
                <div className="flex flex-col items-center  justify-center gap-3 text-pretty w-[370px] iphone:max-sm:py-8 max-macair133:w-[330px] border shadow-md bg-white/65 backdrop-blur-[150px] border-24 rounded-lg">
                  <div className=" flex flex-col gap-1">
                    <Icon
                      IconComponent={IconBulb}
                      className="size-16 stroke-1"
                    />
                    <p className="text-center">
                      Automated Data Analysis <br />
                    </p>
                  </div>
                  <p className="text-[#86868B]  max-macair133:text-[14px]">
                    Automatically calculate scores and easily <br />
                    view student performance through <br /> histograms within
                    the CLO score range.
                  </p>
                </div>
              </div>

              <div className="mx-28 max-macair133:mx-10 z-30">
                <div className="flex h-fit w-full rounded-xl bg-white/65 overflow-clip shadow-md ">
                  <Accordion defaultValue="1" className="p-6">
                    {tqf5List.map((item) => {
                      return (
                        <Accordion.Item
                          key={item.id}
                          value={item.id}
                          className="w-[400px] max-macair133:w-[300px]"
                          onClick={() => {
                            setSelectTQF5Image(item.img);
                          }}
                        >
                          <Accordion.Control className="h-full min-h-[160px] samsungA24:min-h-[200px] text-[18px]">
                            <p className="text-[17px] font-[700] text-emphasize">
                              Part {item.id}
                            </p>
                            <p className="text-[14px] font-[600] text-deemphasize">
                              {item.topic}
                            </p>
                          </Accordion.Control>
                          <Accordion.Panel className="text-start text-[14px] font-[600]">
                            {item.description}
                          </Accordion.Panel>
                        </Accordion.Item>
                      );
                    })}
                  </Accordion>

                  <div className="relative flex items-center justify-center py-2">
                    <Image
                      src={selectTQF5Image}
                      alt="Background Image"
                      className="w-[85%]  max-macair133:w-full max-macair133:translate-x-14 samsungA24:w-[80%] object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" sm:flex  h-fit w-full flex-col gap-28 py-36 ">
          <div className="flex flex-col iphone:max-sm:-mt-32 items-start text-start sm:px-28 px-10">
            <div className="font-[700] flex flex-col iphone:max-sm:text-[28px] gap-1 text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00] drop-shadow-xl pb-2 cursor-default sm:leading-[56px]  items-start text-[48px]  max-macair133:text-[44px]">
              <p>
                Say Goodbye to Complexity, <br /> Hello to Seamless Course
                Management!
              </p>
            </div>
            <p className="mt-5 text-[17px] max-macair133:text-[15px] text-deemphasize font-[600] text-wrap sm:w-[900px] iphone:max-sm:!w-[80vw] !w-[30vw]">
              Unlock the ultimate tools for TQF, PLO, and CLO management with
              our powerful admin features.
            </p>
          </div>

          <div className=" flex items-center justify-center iphone:max-sm:mt-8 ">
            {/* <div className="absolute left-0 right-0 top-[50%] z-0 -ml-20 h-40 bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00] blur-[200px]"></div> */}
            <Tabs defaultValue="tqf">
              <Tabs.List className="flex justify-center">
                <Tabs.Tab
                  value="tqf"
                  className="text-black font-[700] text-[20px] "
                >
                  TQF
                </Tabs.Tab>
                <Tabs.Tab
                  value="clo"
                  className="text-black font-[700] text-[20px]"
                >
                  CLO
                </Tabs.Tab>
                <Tabs.Tab
                  value="plo"
                  className="text-black font-[700] text-[20px]"
                >
                  PLO
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel
                value="tqf"
                className="mt-8 selection:flex flex-col items-center justify-center h-[80vh] w-screen"
              >
                <div className="flex flex-col items-center gap-3 text-pretty pb-8">
                  <p className="text-[24px] max-macair133:text-[20px]  font-[700] text-emphasize">
                    TQF
                  </p>
                  <p className="text-deemphasize font-[600] text-[17px] max-macair133:text-[15px]">
                    Track the status of TQFs for each course <br /> and
                    effortlessly export them as PDF files.
                  </p>
                </div>
                <div className="relative flex items-center justify-center -translate-x-[15%]">
                  <Image src={tqfOverviewImg} className="w-[60%] z-10" />
                  <Image
                    src={reuseTQF3Img}
                    className="absolute w-[35%] z-0 right-0 bottom-3"
                  />
                </div>
              </Tabs.Panel>

              <Tabs.Panel
                value="clo"
                className="mt-8 selection:flex flex-col  items-center justify-center h-[80vh] w-screen"
              >
                <div className="flex flex-col items-center gap-3 text-pretty text-center pb-8">
                  <p className="text-[24px] max-macair133:text-[20px]  font-[700] text-emphasize">
                    CLO
                  </p>
                  <p className="text-deemphasize font-[600] text-[17px] max-macair133:text-[15px]">
                    Easily view the CLOs for each course <br /> and make edits
                    to the course information as needed.
                  </p>
                </div>
                <div className="relative flex items-center justify-center">
                  <Image src={cloManagementImg} className="w-[45%]" />
                </div>
              </Tabs.Panel>

              <Tabs.Panel
                value="plo"
                className="mt-8 selection:flex flex-col  items-center justify-center h-[80vh] w-screen"
              >
                <div className="flex flex-col items-center gap-3 text-pretty">
                  <p className="text-[24px] max-macair133:text-[20px] font-[700] text-emphasize">
                    PLO
                  </p>
                  <p className="text-deemphasize text-center font-[600] text-[17px] max-macair133:text-[15px] pb-8">
                    Create and manage PLO Collections, assign them to faculty,
                    <br />
                    track average PLOs, and see mapped courses.
                  </p>
                </div>
                <div className="relative flex items-center justify-center">
                  <Image src={ploManagementImg} className="w-[60%] z-10" />
                  <Image
                    src={addPLOColImg}
                    className="absolute w-[35%] z-0 right-20 bottom-3"
                  />
                  <Image
                    src={ploMappingImg}
                    className="absolute w-[35%] z-0 left-20  bottom-3"
                  />
                </div>
              </Tabs.Panel>
            </Tabs>
          </div>

          <div className="flex h-fit items-center mt-8 iphone:max-sm:-mt-72">
            <div className="flex flex-col items-start justify-center gap-4 max-macair133:gap-2 h-[85%] iphone:max-sm:px-10  sm:pl-28 samsungA24:pl-48">
              <div className="flex flex-col gap-2 items-start mt-2 mb-2">
                <p className="font-[700] text-[36px] text-emphasize">
                  Course Management
                </p>
                <p className="text-[17px] text-deemphasize font-[600] text-wrap sm:w-[520px] iphone:max-sm:!w-[80vw] !w-[30vw]">
                  Manage courses within the Faculty of Engineering, <br />{" "}
                  organized by department.
                </p>
              </div>
              <div className="flex justify-start flex-col items-start mt-2 mb-2">
                <p className=" text-black font-[700] pt-4 ">
                  Recurrence course
                </p>
                <p className=" text-deemphasize font-[600] pt-2 text-[15px] leading-[22px] sm:w-[400px] iphone:max-sm:!w-[80vw] !w-[30vw]">
                  <span className="text-[#4285f4]">
                    Easily set courses to recur in the next semester
                  </span>
                  ,
                  <br /> saving time by avoiding the need to set up <br /> new
                  courses each term.
                </p>
              </div>
              <div className="flex justify-start flex-col items-start mt-2 mb-2 ">
                <p className=" text-black font-[700] pt-4 ">
                  Manage Co-instructors
                </p>
                <p className=" text-deemphasize font-[600] pt-2 text-[15px] leading-[22px] ">
                  <span className="text-[#4285f4]">
                    Efficiently manage co-instructors for each course
                  </span>
                  ,
                  <br /> with options to remove or add them using their <br />{" "}
                  CMU OAuth or by selecting from the instructor list.
                </p>
              </div>
              <div className="flex justify-start flex-col items-start mt-2 mb-2">
                <p className=" text-black font-[700] pt-4 ">Manage Sections</p>
                <p className=" text-deemphasize font-[600] pt-2 text-[15px] leading-[22px] sm:w-[450px] iphone:max-sm:!w-[80vw] !w-[30vw]">
                  Easily manage course sections,{" "}
                  <span className="text-[#4285f4]">
                    {" "}
                    enabling you to open or close them for the semester{" "}
                  </span>
                  with just a few clicks.
                </p>
              </div>
            </div>
            <Image
              src={courseManagementImg}
              alt="CMULogo"
              className="w-[75%] sm:flex hidden max-macair133:w-[90%] -translate-x-36 samsungA24:-translate-x-20"
            />
          </div>
        </div>

        <div className="sm:flex flex-col gap-16 items-center bg-[#fafafa] iphone:max-sm:-mt-24  h-fit text-white   sm:px-28 sm:py-20 py-12 ">
          <div className="flex flex-col gap-20 items-center ">
            <div className="text-[21px] text-center">
              <p className="font-[600] text-[60px] iphone:max-sm:text-[28px] iphone:max-sm:px-2 text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00] max-macair133:text-[48px]">
                Boost Student Success with{" "}
                <span className="font-[600] ">ScoreOBE+!</span>
              </p>
              <p className="sm:text-[18px] iphone:max-sm:text-[14px]  iphone:max-sm:mt-4 iphone:max-sm:px-5 text-default font-[600] ">
                Simplifies score announcements, tracks student progress, and
                helps instructors align with educational goals.
              </p>
            </div>

            <div className="flex flex-col gap-16 justify-center w-full font-[600] text-[17px] max-macair133:text-[15px]  px-10">
              <div className="flex items-start text-default justify-center sm:gap-28 iphone:max-sm:gap-16">
                <div className="flex flex-col items-start gap-3 text-pretty w-[370px]">
                  <Icon
                    IconComponent={IconWand}
                    className="size-16 stroke-default max-macair133:size-12 stroke-1"
                  />
                  <p className="font-[600] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                    Effortless -{"  "}
                    <span className="text-default">
                      Easily import, publish, and manage course scores in just a
                      few clicks, saving you time and effort.
                    </span>
                  </p>
                </div>
                <div className="flex flex-col items-start gap-3 text-pretty w-[370px]">
                  <Icon
                    IconComponent={IconChartBar}
                    className="size-16  max-macair133:size-12 stroke-1"
                  />
                  <p className="font-[600] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                    Insightful -{"  "}
                    <span className="text-default">
                      Access powerful, clear charts that provide deep insights
                      into scores for each assignment.
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex iphone:max-sm:mb-12 items-start text-default justify-center sm:gap-28 iphone:max-sm:gap-16">
                <div className="flex flex-col items-start gap-3 text-pretty w-[370px]">
                  <Icon
                    IconComponent={IconRocket}
                    className="size-16 max-macair133:size-12 stroke-1"
                  />
                  <p className="text-transparent font-[600] bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                    Empowering -{" "}
                    <span className="text-default">
                      Seamlessly align assessments with learning goals, ensuring
                      accuracy and alignment with program objectives.
                    </span>
                  </p>
                </div>
                <div className="flex flex-col items-start gap-3 text-pretty w-[370px]">
                  <Icon
                    IconComponent={IconChecklist}
                    className="size-16 max-macair133:size-12 stroke-1"
                  />
                  <p className="font-[600] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                    Streamlined -{" "}
                    <span className="text-default">
                      Quickly generate TQF reports for course evaluations,
                      simplifying the process with minimal effort required.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <footer className="w-full border-t  text-default  pt-10 ">
            <div className=" px-8 sm:px-4  mx-auto">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                {/* Logo and main info */}
                <div className="md:col-span-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={scoreobe}
                      alt="cpeLogo"
                      className=" sm:h-[28px] h-[22px] "
                    />
                    <h2 className="font-[600] sm:text-[18px] text-[14px] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                      ScoreOBE+
                    </h2>
                  </div>
                  <p className="sm:text-sm iphone:max-sm:text-[12px]  max-w-md">
                    Advanced scoring and assessment software designed to
                    streamline educational evaluation processes.
                  </p>
                </div>

                <div className="md:col-span-3 space-y-4">
                  <h3 className="text-sm font-semibold text-secondary ">
                    Quick Links
                  </h3>
                  <ul className="space-y-2 sm:text-[14px] iphone:max-sm:text-[12px]">
                    <li>
                      <a
                        href={OBEDocument}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a href="https://www.cmu.ac.th/th/privacy">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        className=" cursor-pointer"
                        onClick={() => setOpenModalTOS(true)}
                      >
                        Terms of Service
                      </a>
                    </li>
                  </ul>
                </div>

                {/* University links */}
                <div className="md:col-span-4 space-y-4">
                  <h3 className="text-sm font-semibold text-secondary ">
                    Chiang Mai University
                  </h3>
                  <ul className="space-y-2 sm:text-[14px] iphone:max-sm:text-[12px]">
                    <div className="flex items-center flex-row ">
                      <a href="https://www.cpe.eng.cmu.ac.th/" target="_blank">
                        Department of Computer Engineering
                      </a>
                      <Icon
                        IconComponent={IconExternal}
                        className="size-4 ml-1"
                      />
                    </div>
                    <div className="flex items-center flex-row ">
                      <a href="https://eng.cmu.ac.th/" target="_blank">
                        Faculty of Engineering
                      </a>
                      <Icon
                        IconComponent={IconExternal}
                        className="size-4 ml-1"
                      />
                    </div>
                    <div className="flex items-center flex-row ">
                      <a href="https://www.cmu.ac.th/" target="_blank">
                        Chiang Mai University
                      </a>
                      <Icon
                        IconComponent={IconExternal}
                        className="size-4 ml-1"
                      />
                    </div>
                  </ul>
                </div>
              </div>

              <div className="my-8 border-[1px]  "></div>

              <div className="flex flex-col md:flex-row justify-between md:items-center items-start  gap-4">
                <p className="sm:text-xs iphone:max-sm:text-[10px] text-slate-600  text-center md:text-left">
                  &copy; {currentYear} ScoreOBE+ Software. All rights reserved.
                </p>
                <div className="flex flex-col md:items-end md:text-end gap-1">
                  <img
                    src={cpeLogoRed}
                    alt="cpeLogo"
                    className="sm:h-[36px] mb-2 h-[30px] sm:w-[125px] w-[105px] iphone:max-sm:-ml-[4px] "
                  />
                  <p className="sm:text-xs iphone:max-sm:text-[10px] text-slate-600 ">
                    Designed and developed by the Department of Computer
                    Engineering,
                  </p>
                  <p className="sm:text-xs iphone:max-sm:text-[10px] text-slate-600 ">
                    Faculty of Engineering, Chiang Mai University
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
