"use client";
import cmulogoLogin from "@/assets/image/cmuLogoLoginWhite.png";
import loginImage from "@/assets/image/loginPage.png";
import { Accordion, Button, Tabs, Title } from "@mantine/core";
import { Image } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isEmpty } from "lodash";
import { setShowSidebar } from "@/store/showSidebar";
import Icon from "@/components/Icon";
import IconLock from "@/assets/icons/lockIcon.svg?react";
import IconEdit from "@/assets/icons/edit.svg?react";
import IconRefresh from "@/assets/icons/refresh.svg?react";
import IconChevronRight from "@/assets/icons/chevronRight.svg?react";
import IconBulb from "@/assets/icons/bulb.svg?react";
import IconSparkle from "@/assets/icons/sparkle.svg?react";
import IconChevronLeft from "@/assets/icons/chevronLeft.svg?react";
import IconPlus2 from "@/assets/icons/plus2.svg?react";
import IconExcel from "@/assets/icons/excel.svg?react";
import IconShare2 from "@/assets/icons/share2.svg?react";
import IconHistogram from "@/assets/icons/histogram.svg?react";
import IconClick from "@/assets/icons/click.svg?react";
import IconPublish1 from "@/assets/icons/eyePublish.svg?react";
import IconPublish2 from "@/assets/icons/publishEach.svg?react";
import IconSpiderChart from "@/assets/icons/spiderChart.svg?react";
import { setShowNavbar } from "@/store/showNavbar";
import gradescope from "@/assets/image/gradescope.png";
import "@mantine/carousel/styles.css";
import { Carousel } from "@mantine/carousel";
import { goToDashboard } from "@/helpers/functions/function";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import testPhoto from "@/assets/image/testPhoto.png";
import studentPLOPage from "@/assets/image/studentPLO.png";
import LoadingOverlay from "@/components/Loading/LoadingOverlay";
import exportScoreImg from "@/assets/image/exporScore.png";
import publishScoreImg from "@/assets/image/publishScore.png";
import tqf3Pt1Img from "@/assets/image/tqf3pt1.png";
import tqf3Pt2Img from "@/assets/image/tqf3pt2.png";
import tqf3Pt3Img from "@/assets/image/tqf3pt3.png";
import tqf3Pt4Img from "@/assets/image/tqf3pt4.png";
import tqf3Pt5Img from "@/assets/image/tqf3pt5.png";
import tqf3Pt6Img from "@/assets/image/tqf3pt6.png";
import tqf3Pt7Img from "@/assets/image/tqf3pt7.png";
export default function Login() {
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  const tqf5List = [
    {
      id: "1",
      topic: "Course Evaluation",
      description:
        "Upload grade sheets for processing, or manually enter the number of students who received each grade and complete the corresponding criteria.",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png",
    },
    {
      id: "2",
      topic: "Assessment tool mapping to CLO",
      description:
        "Select the assessment tool to use for this CLO and determine which items to process.",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png",
    },
    {
      id: "3",
      topic: "(Rubrics for CLO evaluation",
      description:
        "Review the assessment tool scores and score ranges for each CLO, and include the rubrics for CLO/CSO evaluation.",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png",
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right"); // Track the slide direction
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectTQF3Image, setSelectTQF3Image] = useState(tqf3List[0].img);
  const [selectTQF5Image, setSelectTQF5Image] = useState(tqf5List[0].img);
  const [openItem, setOpenItem] = useState("1");

  useEffect(() => {
    dispatch(setShowSidebar(false));
    dispatch(setShowNavbar(true));
    if (!isEmpty(user)) {
      goToDashboard(user.role);
    }
  }, [user]);

  return (
    <div className=" bg-[#fafafa] h-full w-screen items-center flex flex-col overflow-y-auto overflow-x-hidden">
      {loading && <LoadingOverlay />}
      <div className="flex flex-col w-full">
        <p className="text-center drop-shadow-xl cursor-default px-[12px] w-full mt-[70px] sm:mt-8 font-[700] sm:font-[500] item-start rounded text-emphasize text-[48px] mb-5 sm:mb-0 sm:text-[50px] leading-[48px] sm:leading-[66px]">
          <span className="font-[700] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
            ScoreOBE +{" "}
          </span>
          Academic Supercharger
          <br />
          for instructors and students
        </p>
        <p className="mt-5 text-h2 text-[#4F4D55] w-full hidden sm:flex justify-center items-center text-center px-[118px] font-[500]">
          Discover A Better Way to Do OBE Simplify Your Academic Journey
        </p>

        {/* Smartphone size */}
        <div className="flex items-center  mt-8 text-center w-full justify-center px-[40px] mb-8  sm:hidden">
          <p className="text-center  font-medium flex flex-col  text-[#4F4D55]">
            <span className="font-bold text-b1 text-secondary ">
              ScoreOBE + is not available <br /> on your current window size.
            </span>
            <br />
            <span className="text-b2">
              To log in, please use ScoreOBE + on a tablet in landscape mode{" "}
              <br /> or a desktop for the best experience.
            </span>
          </p>
        </div>

        <div className="items-center mt-8 text-center w-full justify-center px-[118px] hidden sm:flex">
          <a href={import.meta.env.VITE_NEXT_PUBLIC_CMU_OAUTH_URL}>
            <Button className=" bg-[#5768d5] hover:bg-[#4b5bc5] active:bg-[#4857ba] drop-shadow-lg !text-[14px] !h-[44px]">
              <img
                src={cmulogoLogin}
                alt="CMULogo"
                className="h-[13px] mr-3 rounded-1xl"
              />
              Sign in CMU Account
            </Button>
          </a>
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
          <div className=" sm:flex relative hidden items-center rounded-t-xl justify-center p-5 py-[9px] border-b-[1px] border-[#eeeeee] flex-row gap-0 w-full bg-white">
            <div className=" absolute -top-10 py-20  rotate-180 -z-50 w-screen h-screen  flex justify-center">
              <div className="rounded-full h-full w-3/6 bg-[#FF7847] opacityy-50 bg-blur"></div>
              <div className="rounded-full h-[97%] w-3/6 bg-[#FF469D] opacityy-50 bg-blur"></div>
              <div className="rounded-full h-[97%] w-3/6 bg-[#7733FF] opacityy-50 bg-blur"></div>
              <div className="rounded-full h-[97%] w-3/6 bg-[#0A7CFF] opacityy-50 bg-blur"></div>{" "}
              <div className="rounded-full h-[97%] w-3/6 bg-[#00abdf] opacityy-50 bg-blur"></div>
            </div>
            <div className="flex justify-start w-[35%] flex-row gap-6 items-center">
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
            <div className="flex w-[30%] flex-row gap-2">
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
        <div className="bg-[#fafafa] sm:flex hidden h-full w-full gap-16 ">
          <div className="relative items-start text-start pb-32 justify-start w-full overflow-clip">
            {" "}
            <div className="absolute left-0 right-0 bottom-0 z-0 h-40 bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00] blur-[160px]"></div>
            <div className="relative">
              <div className="relative h-fit w-full py-20 mt-16 px-[118px]">
                <div className="absolute ml-[40%] left-0 right-0 bottom-40 z-0 h-20 bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00] blur-[160px]"></div>
                <p className="drop-shadow-xl pb-2 cursor-default leading-[56px]  items-start text-[#000000] text-[48px] ">
                  <span className="font-[700] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00] drop-shadow-xl pb-2 cursor-default leading-[56px]  items-start text-[48px] ">
                    Upload, Publish
                    <br /> grading efficiency.
                  </span>{" "}
                  <br />
                </p>
                <div className="flex items-center justify-between">
                  <p className="mt-5 text-[19px] text-black font-[500]">
                    Effortless score uploads, instant analytics, <br /> and
                    visual insights! Elevate your grading today! <br />
                    <span className="mt-5 underline text-b1  text-[#7b7b7c] font-[500]">
                      Available in December or January
                    </span>
                  </p>
                  <div className="flex justify-end gap-10 -mt-14">
                    <div className="flex justify-start flex-col items-start mt-2 mb-2 p-7 rounded-xl bg-white/65 backdrop-blur-[100px] shadow-lg">
                      <img
                        src={gradescope}
                        alt="CMULogo"
                        className="h-[32px]"
                      />
                      <p className=" text-black font-[700] pt-4 ">
                        Gradescope Support
                      </p>
                      <p className=" text-default font-[500] pt-2 text-b2  leading-[22px]">
                        Effortless import Gradescope <br /> assignment template
                      </p>
                    </div>
                    <div className="flex justify-start flex-col items-start mt-2 mb-2 bg-black p-7 rounded-xl bg-white/65 backdrop-blur-[100px] shadow-lg">
                      <Icon IconComponent={IconHistogram} className="size-8" />
                      <p className=" text-black font-[700] pt-4 ">
                        Statistics & Histogram
                      </p>
                      <p className="text-default font-[500] pt-2 text-b2 leading-[22px] ">
                        Visualize your grade <br /> with interactive charts
                      </p>
                    </div>
                    <div className="flex justify-start flex-col items-start mt-2 mb-2 bg-black p-7 rounded-xl bg-white/65 backdrop-blur-[100px] shadow-lg">
                      <Icon IconComponent={IconEdit} className="size-8" />
                      <p className=" text-black font-[700] pt-4 ">
                        On-the-Spot Edits
                      </p>
                      <p className=" text-default font-[500] pt-2 text-b2 leading-[22px]">
                        Modify student scores <br /> directly within the system.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-20 px-[118px]">
                <div className="flex flex-col items-start text-start">
                  <div className="font-[700] flex flex-col gap-1 text-[#ec407a] drop-shadow-xl pb-2 cursor-default mt-16 leading-[56px]  items-start text-[48px] ">
                    <p>See Beyond the Scores</p>
                    <p className="text-[#1D1D1F]">
                      Where Insight Ignites Impact
                    </p>
                  </div>
                  <p className="mt-5 text-[17px] text-deemphasize font-[600] text-wrap w-[750px]">
                    ScoreOBE+ turns data into actionable insights that{" "}
                    <span className="text-emphasize">
                      support teaching excellence <br /> and elevate learning
                      outcomes.
                    </span>
                  </p>
                </div>
                <div className="flex items-center">
                  <img
                    src={studentPLOPage}
                    alt="CMULogo"
                    className="w-[85%] h-[85%] -ml-[20%] mx-0"
                  />
                  <div className="flex flex-col w-[40%] h-full gap-8 text-[18px] ">
                    <div className="flex flex-col gap-2 items-start mt-2 mb-2">
                      <p className="font-[700] text-[36px] text-emphasize">
                        Statistics & Histogram
                      </p>
                      <p className="text-[17px] text-deemphasize font-[600] text-wrap w-[750px]">
                        Visualize your grade with interactive charts
                      </p>
                    </div>
                    <div className="flex justify-start flex-col items-start mt-2 mb-2">
                      <Icon IconComponent={IconHistogram} className="size-8" />
                      <p className=" text-black font-[700] pt-4 ">
                        Clear Overview of Performance
                      </p>
                      <p className=" text-deemphasize font-[500] pt-2 text-[15px] leading-[22px]">
                        Provides a comprehensive view of student performance
                        <br />
                        <span className="text-emphasize">
                          across each assignment and question.
                        </span>
                      </p>
                    </div>
                    <div className="flex justify-start flex-col items-start mt-2 mb-2">
                      <Icon IconComponent={IconHistogram} className="size-8" />
                      <p className=" text-black font-[700] pt-4 ">
                        Unlock In-Depth Statistical Insights
                      </p>
                      <p className=" text-deemphasize font-[500] pt-2 text-[15px] leading-[22px]">
                        <span className="text-emphasize">
                          Analyze key metrics{" "}
                        </span>
                        like mean and standard deviation <br />{" "}
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
                      {/* <Icon
                        IconComponent={IconSpiderChart}
                        className="size-9 stroke-[10px] pb-1"
                      /> */}
                      <p className="font-[700] text-[36px] text-emphasize">
                        PLO Performance <br /> Spider Chart
                      </p>
                      <p className="text-[17px] text-deemphasize font-[600] text-wrap w-[520px]">
                        Visualize student progress{" "}
                        <span className="text-emphasize">
                          {" "}
                          in each course and across <br /> the entire curriculum{" "}
                        </span>
                        , aligned with Program Learning <br /> Outcomes (PLOs).
                      </p>
                    </div>
                    <div className="flex justify-start flex-col items-start mt-2 mb-2">
                      <Icon
                        IconComponent={IconSpiderChart}
                        className="size-8"
                      />
                      <p className=" text-black font-[700] pt-4 ">
                        Students Can Track Their Own Performance
                      </p>
                      <p className=" text-deemphasize font-[500] pt-2 text-[15px] leading-[22px]">
                        <span className="text-emphasize">
                          {" "}
                          Gain clear insights into your progress{" "}
                        </span>{" "}
                        across courses and learning outcomes, and discover areas
                        to improve.
                      </p>
                    </div>
                  </div>
                  <img
                    src={studentPLOPage}
                    alt="CMULogo"
                    className="w-[85%] h-[85%] -translate-x-28"
                  />
                </div>

                <div className="flex flex-col gap-20 ">
                  <div className="flex flex-col items-center">
                    <div className="font-[700] flex flex-col gap-1 text-[#ec407a] drop-shadow-xl pb-2 cursor-default mt-16 leading-[56px] items-center text-[48px] ">
                      Easily Manage Scores <br />{" "}
                      <span className=" text-emphasize">
                        with Export and Publish
                      </span>
                    </div>
                    <p className="mt-5 text-[17px] text-deemphasize font-[600] text-wrap w-[800px] text-center">
                      Make managing scores easier than ever. With our intuitive
                      export and publish options, you can{" "}
                      <span className="text-emphasize">
                        quickly organize, share, and update student data with
                        just a few clicks.
                      </span>
                    </p>
                  </div>

                  <div className="flex  justify-center gap-16">
                    <div className="relative rounded-2xl h-[550px] w-[600px] bg-gradient-to-b shadow-xl from-[#7161ef]  via-[#957fef] to-[#b79ced] border-t-[1px] overflow-clip">
                      <div
                        className={`h-full w-full overflow-clip rounded-xl -translate-x-20 translate-y-40 shadow-2xl`}
                      >
                        <Image
                          src={publishScoreImg}
                          className={`h-[500px] w-full object-cover rounded-xl translate-x-14 -translate-y-8`}
                        />
                      </div>
                      <Icon
                        IconComponent={IconPublish1}
                        className="absolute bottom-10 right-12 size-20 text-white "
                      />
                      <Icon
                        IconComponent={IconPublish2}
                        className="absolute top-24 right-[300px] size-14 stroke-slate-200 text-white "
                      />

                      <div className="absolute top-2 left-2 rounded-xl">
                        <div className="top-0 flex flex-col justify-end p-6 ">
                          <p className="opacity-70 font-bold uppercase cursor-default  text-white">
                            Publish
                          </p>
                          <Title
                            order={3}
                            className="font-bold text-[28px] cursor-default text-white"
                          >
                            Quickly publish scores for individual <br /> or all
                            sections.
                          </Title>
                        </div>
                      </div>
                    </div>
                    <div className="relative rounded-2xl h-[550px] w-[600px] bg-gradient-to-b shadow-xl from-[#5390d9] via-[#4ea8de] to-[#48bfe3] border-t-[1px] overflow-clip">
                      <div
                        className={`h-full w-full overflow-clip rounded-xl translate-x-20 translate-y-40 shadow-2xl`}
                      >
                        <Image
                          src={exportScoreImg}
                          className={`h-[700px] w-full object-cover rounded-xl -translate-y-[150px] -translate-x-9`}
                        />
                      </div>
                      <Icon
                        IconComponent={IconExcel}
                        className="absolute bottom-10 left-6 size-20 -rotate-12 text-white "
                      />
                      <Icon
                        IconComponent={IconClick}
                        className="absolute top-32 right-10 size-14 -rotate-12 text-white "
                      />

                      <div className="absolute top-2 left-2 rounded-xl">
                        <div className="top-0 flex flex-col justify-end p-6 ">
                          <p className="opacity-70 font-bold uppercase cursor-default  text-white">
                            Export
                          </p>
                          <Title
                            order={3}
                            className="font-bold text-[28px] cursor-default text-white"
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
        <div className="sm:flex flex-col w-full h-fit pt-16 hidden">
          <div className="flex flex-col items-start text-start px-28">
            <div className="font-[700] flex flex-col gap-1 text-[#ec407a] drop-shadow-xl pb-2 cursor-default mt-16 leading-[56px]  items-start text-[48px] ">
              <p>New TQF system</p>
              <p className="text-[#1D1D1F]">Convenient, Fast and Effortless</p>
            </div>
            <p className="mt-5 text-[17px] text-deemphasize font-[600] text-wrap w-[750px]">
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
          <div className="flex flex-col">
            <div className="flex gap-16 h-screen w-screen justify-center items-center">
              <div className="flex flex-col gap-6 items-start text-start">
                <p className="font-[700] flex flex-col gap-1 text-emphasize drop-shadow-xl cursor-default items-start text-[28px] ">
                  Create TQF Reports <br /> Quickly and Easily.
                </p>
                <p className=" text-[17px] text-deemphasize font-[600] text-wrap w-[400px]">
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
              <Image
                src={
                  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png"
                }
                className={`h-[80%] w-[50%] object-cover rounded-xl`}
              />
            </div>

            {/* <div className="flex gap-16 h-screen w-screen justify-center items-center">
              <div className="flex flex-col gap-6 items-start text-start">
                <p className="font-[700] flex flex-col gap-1 text-emphasize drop-shadow-xl cursor-default items-start text-[28px] ">
                  Reusable TQF 3 Templates.
                </p>
                <p className="text-[17px] text-deemphasize font-[600] text-wrap w-[400px]">
                  Speed up report creation by reusing TQF 3 templates.
                  <span className="text-emphasize">
                    {" "}
                    Eliminate repetitive data entry and quickly customize each
                    report
                  </span>
                  , allowing you to focus on delivering valuable insights
                  without the hassle of starting from scratch.
                </p>
              </div>

          
              <Image
                src={
                  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png"
                }
                className={`h-[80%] w-[50%] object-cover rounded-xl `}
              />
            </div>

            <div className="flex gap-16 h-screen w-screen justify-center items-center">
              <div className="flex flex-col gap-6 items-start text-start">
                <p className="font-[700] flex flex-col gap-1 text-emphasize drop-shadow-xl cursor-default items-start text-[28px] ">
                  Powerful ScoreOBE+ <br />
                  Analysis with TQF 5.
                </p>
                <p className="text-[17px] text-deemphasize font-[600] text-wrap w-[400px]">
                  <span className="text-emphasize">
                    Unlock detailed analysis and summaries of course objectives
                    with TQF 5. Based on real student performance data
                  </span>
                  , this feature empowers you to fine-tune and enhance your
                  curriculum for improved outcomes. Drive course effectiveness
                  and align with institutional goals effortlessly.
                </p>
              </div>

              <Image
                src={
                  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png"
                }
                className={`h-[80%] w-[50%] object-cover rounded-xl `}
              />
            </div> */}
          </div>

          <div className="bg-[#fafafa] py-14 flex flex-col gap-10">
            {/* TQF3 */}
            <div className="flex flex-col items-center text-center font-[600] gap-14 mx-28">
              <div>
                <div className="font-[700] flex flex-col gap-1 text-[#ec407a] drop-shadow-xl pb-2 cursor-default mt-16 leading-[56px] items-center text-[48px] ">
                  <p>TQF 3</p>
                  <p className="text-[#1D1D1F]">Save Time & Focus on Content</p>
                </div>
                <p className="mt-5 text-[17px] text-deemphasize font-[600] text-wrap w-[800px]">
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

              <div className="relative flex gap-16">
                <div className="absolute left-0 right-0 top-[75%] z-0 h-20 bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00] blur-[160px]"></div>
                <div className="flex flex-col items-center justify-center gap-3 text-pretty w-[370px]  border shadow-md bg-white/65 backdrop-blur-[150px] border-24 rounded-lg py-6">
                  <div className=" flex flex-col gap-1">
                    <Icon
                      IconComponent={IconBulb}
                      className="size-16 stroke-1"
                    />
                    <p className="text-center">
                      Reusable TQF 3 Templates <br />
                    </p>
                  </div>
                  <p className="text-[#86868B]">
                    Eliminate repetitive data entry <br />
                    and quickly customize each report
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 text-pretty w-[370px]  border shadow-md bg-white/65 backdrop-blur-[150px] border-24 rounded-lg py-6">
                  <div className=" flex flex-col gap-1">
                    <Icon
                      IconComponent={IconBulb}
                      className="size-16 stroke-1"
                    />
                    <p className="text-center">
                      Consistency Across Reports <br />
                    </p>
                  </div>
                  <p className="text-[#86868B]">
                    Ensure alignment and consistency <br /> across all reports.
                  </p>
                </div>
              </div>

              <div className="relative flex h-fit w-full rounded-xl bg-white shadow-md backdrop-blur-[120px]  overflow-clip">
                <Accordion
                  defaultValue="1"
                  onChange={() => setOpenItem}
                  className="p-6"
                >
                  {tqf3List.map((item) => {
                    return (
                      <Accordion.Item
                        key={item.id}
                        value={item.id}
                        className="w-[400px]"
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
                    className={`h-fit w-[90%] samsungA24:w-[80%] object-cover  `}
                  />
                </div>
              </div>
            </div>

            {/* TQF5*/}
            <div className="flex flex-col items-center text-center font-[600] gap-14 mx-28 ">
              <div className="flex flex-col items-center">
                <div className="font-[700] flex flex-col gap-1 text-[#ec407a] drop-shadow-xl pb-2 cursor-default mt-16 leading-[56px] items-center text-[48px] ">
                  <p>TQF 5</p>
                  <p className="text-[#1D1D1F]">
                    Unlock Deep Insights into Your Course
                  </p>
                </div>
                <p className="mt-5 text-[17px] text-deemphasize font-[600] text-wrap w-[800px] ">
                  TQF 5 helps you analyze course objectives based on real
                  student performance data, empowering you to make data-driven
                  improvements and align your courses with institutional goals.
                </p>
              </div>

              <div className="relative flex gap-16">
                <div className="absolute left-0 right-0 top-[50%] z-0 h-20 bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00] blur-[160px]"></div>
                <div className="relative flex flex-col items-center gap-3 text-pretty w-[370px] border shadow-md bg-white/65 backdrop-blur-[150px] border-24 p-6 rounded-lg">
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
                  <p className="text-[#86868B]">
                    Choose automated or manual processes for TQF 5 reports,
                    providing versatility for any reporting need.
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 text-pretty w-[370px]  border shadow-md bg-white/65 backdrop-blur-[150px] border-24 rounded-lg">
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
                  <p className="text-[#86868B]">
                    CLOs can be mapped to assessment tools
                    <br /> on a detailed, item-by-item basis <br />
                    for more precise results.
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 text-pretty w-[370px]  border shadow-md bg-white/65 backdrop-blur-[150px] border-24 rounded-lg">
                  <div className=" flex flex-col gap-1">
                    <Icon
                      IconComponent={IconBulb}
                      className="size-16 stroke-1"
                    />
                    <p className="text-center">
                      Automated Data Analysis <br />
                    </p>
                  </div>
                  <p className="text-[#86868B]">
                    Automatically calculate scores and easily <br />
                    view student performance through <br /> histograms within
                    the CLO score range.
                  </p>
                </div>
              </div>

              <div className="flex h-fit w-full rounded-xl bg-white/65 overflow-clip">
                <Accordion
                  defaultValue="1"
                  onChange={() => setOpenItem}
                  className="p-6"
                >
                  {tqf5List.map((item) => {
                    return (
                      <Accordion.Item
                        key={item.id}
                        value={item.id}
                        className="w-[400px]"
                        onClick={() => {
                          setSelectTQF3Image(item.img);
                        }}
                      >
                        <Accordion.Control className="h-full min-h-[160px] text-[18px]">
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

                {/* Image */}
                <Image
                  src={selectTQF3Image}
                  className={`h-full w-[70%] object-cover`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F2F2F2] sm:flex hidden h-fit w-full flex-col gap-28 py-36">
          <div className="flex flex-col items-start text-start px-28">
            <div className="font-[700] flex flex-col gap-1 text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00] drop-shadow-xl pb-2 cursor-default leading-[56px]  items-start text-[48px] ">
              <p>
                Say Goodbye to Complexity, <br /> Hello to Seamless Course
                Management!
              </p>
            </div>
            <p className="mt-5 text-[17px] text-deemphasize font-[600] text-wrap w-[900px]">
              Unlock the ultimate tools for TQF, PLO, and CLO management with
              our powerful admin features.
            </p>
          </div>

          <div className="flex h-fit">
            <img
              src={studentPLOPage}
              alt="CMULogo"
              className="h-[75%] -translate-x-[15%]"
            />

            <div className="flex flex-col items-start justify-center gap-16 -translate-x-[45%] h-[70%] ">
              <div className="flex flex-col items-start gap-3 text-pretty w-[370px]">
                <p className="text-[24px] font-[700] text-emphasize">TQF</p>
                <p className="text-deemphasize font-[600] text-[17px]">
                  Track the status of TQFs for each course and effortlessly
                  export them as PDF files.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 text-pretty w-[390px]">
                <p className="text-[24px] font-[700] text-emphasize">CLO</p>
                <p className="text-deemphasize font-[600] text-[17px]">
                  Easily view the CLOs for each course and make edits to the
                  course information as needed.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 text-pretty w-[370px]">
                <p className="text-[24px] font-[700] text-emphasize">PLO</p>
                <p className="text-deemphasize font-[600] text-[17px]">
                  Create and manage PLO Collections, assign them to faculty,
                  track average PLOs, and see mapped courses.
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center -mt-48">
            <div className="absolute left-0 right-0 top-[50%] z-0 -ml-20 h-40 bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00] blur-[200px]"></div>
            <Tabs defaultValue="tqf">
              <Tabs.List className="flex justify-center">
                <Tabs.Tab
                  value="tqf"
                  className="text-black font-[700] text-[20px]"
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

              <Tabs.Panel value="tqf" className="mt-8 flex gap-4">
                <div className="relative bg-[#FFFFFF] rounded-2xl h-[600px] w-[750px] shadow-xl border-[#e3e3e3] border-t-[1px] overflow-clip">
                  <Image
                    src={studentPLOPage}
                    className={`h-full w-full object-cover rounded-xl -translate-x-20 translate-y-36`}
                  />

                  <div className="absolute inset-0 rounded-xl">
                    <div className="top-0 flex flex-col justify-end p-6 text-emphasize">
                      <p className="opacity-70 font-bold uppercase cursor-default">
                        TQF Status
                      </p>
                      <Title
                        order={3}
                        className="font-bold text-[20px] cursor-default"
                      >
                        Lorem
                      </Title>
                    </div>
                  </div>
                </div>
                <div className="h-[600px] flex flex-col gap-4">
                  <div className="relative bg-[#FFFFFF] rounded-2xl h-full w-[450px] shadow-xl border-[#e3e3e3] border-t-[1px] overflow-clip">
                    <Image
                      src={studentPLOPage}
                      className={`h-full w-full object-cover rounded-xl translate-x-[40%] translate-y-20`}
                    />

                    <div className="absolute inset-0 rounded-xl">
                      <div className="top-0 flex flex-col justify-end p-6 text-emphasize">
                        <p className="opacity-70 font-bold uppercase cursor-default">
                          Export TQF
                        </p>
                        <Title
                          order={3}
                          className="font-bold text-[20px] cursor-default"
                        >
                          Lorem
                        </Title>
                      </div>
                    </div>
                  </div>
                  <div className="relative bg-[#FFFFFF] rounded-2xl h-full w-[450px] shadow-xl border-[#e3e3e3] border-t-[1px] overflow-clip">
                    <Image
                      src={studentPLOPage}
                      className={`h-full w-full object-cover rounded-xl translate-y-[40%]`}
                    />

                    <div className="absolute inset-0 rounded-xl text-center">
                      <div className="top-0 flex flex-col justify-end p-6 text-emphasize">
                        <p className="opacity-70 font-bold uppercase cursor-default">
                          Export TQF
                        </p>
                        <Title
                          order={3}
                          className="font-bold text-[20px] cursor-default"
                        >
                          Lorem
                        </Title>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Panel>
              <Tabs.Panel value="clo" className="mt-8 flex gap-4">
                <div className="relative bg-[#FFFFFF] rounded-2xl h-[600px] w-[750px] shadow-xl border-[#e3e3e3] border-t-[1px] overflow-clip">
                  <Image
                    src={studentPLOPage}
                    className={`h-full w-full object-cover rounded-xl -translate-x-20 translate-y-36`}
                  />

                  <div className="absolute inset-0 rounded-xl">
                    <div className="top-0 flex flex-col justify-end p-6 text-emphasize">
                      <p className="opacity-70 font-bold uppercase cursor-default">
                        OVerview CLOs
                      </p>
                      <Title
                        order={3}
                        className="font-bold text-[20px] cursor-default"
                      >
                        Lorem
                      </Title>
                    </div>
                  </div>
                </div>
                <div className="h-[600px] flex flex-col gap-4">
                  <div className="relative bg-[#FFFFFF] rounded-2xl h-full w-[450px] shadow-xl border-[#e3e3e3] border-t-[1px] overflow-clip">
                    <Image
                      src={studentPLOPage}
                      className={`h-full w-full object-cover rounded-xl translate-x-[40%] translate-y-20`}
                    />

                    <div className="absolute inset-0 rounded-xl">
                      <div className="top-0 flex flex-col justify-end p-6 text-emphasize">
                        <p className="opacity-70 font-bold uppercase cursor-default">
                          Other
                        </p>
                        <Title
                          order={3}
                          className="font-bold text-[20px] cursor-default"
                        >
                          Lorem
                        </Title>
                      </div>
                    </div>
                  </div>
                  <div className="relative bg-[#FFFFFF] rounded-2xl h-full w-[450px] shadow-xl border-[#e3e3e3] border-t-[1px] overflow-clip">
                    <Image
                      src={studentPLOPage}
                      className={`h-full w-full object-cover rounded-xl translate-y-[40%]`}
                    />

                    <div className="absolute inset-0 rounded-xl text-center">
                      <div className="top-0 flex flex-col justify-end p-6 text-emphasize">
                        <p className="opacity-70 font-bold uppercase cursor-default">
                          Tooltip CLOs
                        </p>
                        <Title
                          order={3}
                          className="font-bold text-[20px] cursor-default"
                        >
                          Lorem
                        </Title>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Panel>
              <Tabs.Panel value="plo" className="mt-8 flex gap-4">
                <div className="relative bg-[#FFFFFF] rounded-2xl h-[600px] w-[750px] shadow-xl border-[#e3e3e3] border-t-[1px] overflow-clip">
                  <Image
                    src={studentPLOPage}
                    className={`h-full w-full object-cover rounded-xl -translate-x-20 translate-y-36`}
                  />

                  <div className="absolute inset-0 rounded-xl">
                    <div className="top-0 flex flex-col justify-end p-6 text-emphasize">
                      <p className="opacity-70 font-bold uppercase cursor-default">
                        PLO Management
                      </p>
                      <Title
                        order={3}
                        className="font-bold text-[20px] cursor-default"
                      >
                        Lorem
                      </Title>
                    </div>
                  </div>
                </div>
                <div className="h-[600px] flex flex-col gap-4">
                  <div className="relative bg-[#FFFFFF] rounded-2xl h-full w-[450px] shadow-xl border-[#e3e3e3] border-t-[1px] overflow-clip">
                    <Image
                      src={studentPLOPage}
                      className={`h-full w-full object-cover rounded-xl translate-x-[40%] translate-y-20`}
                    />

                    <div className="absolute inset-0 rounded-xl">
                      <div className="top-0 flex flex-col justify-end p-6 text-emphasize">
                        <p className="opacity-70 font-bold uppercase cursor-default">
                          Track average PLOs
                        </p>
                        <Title
                          order={3}
                          className="font-bold text-[20px] cursor-default"
                        >
                          Lorem
                        </Title>
                      </div>
                    </div>
                  </div>
                  <div className="relative bg-[#FFFFFF] rounded-2xl h-full w-[450px] shadow-xl border-[#e3e3e3] border-t-[1px] overflow-clip">
                    <Image
                      src={studentPLOPage}
                      className={`h-full w-full object-cover rounded-xl translate-y-[40%]`}
                    />

                    <div className="absolute inset-0 rounded-xl text-center">
                      <div className="top-0 flex flex-col justify-end p-6 text-emphasize">
                        <p className="opacity-70 font-bold uppercase cursor-default">
                          Export PLO
                        </p>
                        <Title
                          order={3}
                          className="font-bold text-[20px] cursor-default"
                        >
                          Lorem
                        </Title>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Panel>
            </Tabs>
          </div>

          <div className="flex h-fit mt-24">
            <div className="flex flex-col items-start justify-center gap-4 h-[70%] pl-28">
              <div className="flex flex-col gap-2 items-start mt-2 mb-2">
                <p className="font-[700] text-[36px] text-emphasize">
                  Course Management
                </p>
                <p className="text-[17px] text-deemphasize font-[600] text-wrap w-[520px]">
                  Manage courses within the Faculty of Engineering, <br />{" "}
                  organized by department.
                </p>
              </div>
              <div className="flex justify-start flex-col items-start mt-2 mb-2">
                <p className=" text-black font-[700] pt-4 ">
                  Recurrence course
                </p>
                <p className=" text-deemphasize font-[500] pt-2 text-[15px] leading-[22px] w-[400px]">
                  Easily set courses to recur in the next semester,
                  <br /> saving time by avoiding the need to set up <br /> new
                  courses each term.
                </p>
              </div>
              <div className="flex justify-start flex-col items-start mt-2 mb-2">
                <p className=" text-black font-[700] pt-4 ">
                  Manage Co-instructors
                </p>
                <p className=" text-deemphasize font-[500] pt-2 text-[15px] leading-[22px] ">
                  Efficiently manage co-instructors for each course,
                  <br /> with options to remove or add them using their <br />{" "}
                  CMU OAuth or by selecting from the instructor list.
                </p>
              </div>
              <div className="flex justify-start flex-col items-start mt-2 mb-2">
                <p className=" text-black font-[700] pt-4 ">Manage Sections</p>
                <p className=" text-deemphasize font-[500] pt-2 text-[15px] leading-[22px] w-[400px]">
                  Easily manage course sections, enabling you to open or close
                  them for the semester with just a few clicks.
                </p>
              </div>
            </div>
            <img src={studentPLOPage} alt="CMULogo" className="h-[75%] " />
          </div>

          {/* 
          <div className="text-center gap-20 font-[700] flex flex-col text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]  drop-shadow-xl pb-2 cursor-default leading-[72px] items-center justify-center w-screen h-screen text-[60px] ">
            <p>
              There's never been a better time <br /> for an upgrade than right
              now.
            </p>
            <img src={studentPLOPage} alt="CMULogo" className="h-[75%]" />
          </div> */}
        </div>

        {/* <div className="w-full  py-20 sm:flex flex-col gap-10 hidden">
          <div className="px-20 font-[700] flex flex-col gap-1 bg-clip-text bg-gradient-to-r text-[#4285f4] drop-shadow-xl pb-2 cursor-default leading-[56px] items-start text-[40px] ">
            <p>Explore More Features Beyond the Essentials</p>
          </div>
          <div className="flex-col items-center pb-8 sm:flex hidden">
            <Carousel
              slideSize="60%"
              slideGap="xl"
              height={450}
              initialSlide={0}
              align="center"
              withIndicators
              controlsOffset="xl"
              dragFree
              skipSnaps={true}
              loop={true}
              classNames={{
                control: "size-10 absolute top-64 right-0 mr-24",
                slide: "",
              }}
              previousControlProps={{
                className: "mr-40",
              }}
              onSlideChange={(index: number) => setCurrentIndex(index)}
            >
              {data.map((img, index) => (
                <Carousel.Slide key={index}>
                  <Image
                    src={img.image}
                    className={`h-full w-full object-cover rounded-xl`}
                  />

                  <div className="absolute inset-0  mr-8 rounded-xl">
                    <div className="top-0 flex flex-col justify-end p-6">
                      <p className="text-white opacity-70 font-bold uppercase cursor-default">
                        {img.category}
                      </p>
                      <Title
                        order={3}
                        className="text-white font-bold text-2xl cursor-default"
                      >
                        {img.title}
                      </Title>
                    </div>
                  </div>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
        </div> */}

        <div className="sm:flex flex-col gap-16 items-center bg-black h-fit text-white px-28 py-20 hidden">
          <div className="flex flex-col gap-20 items-center">
            <div className="text-[21px] text-center">
              <p className="font-[600] text-[60px] ">
                Boost Student Success with{" "}
                <span className="font-[600] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                  ScoreOBE+!
                </span>
              </p>
              <p>
                Simplifies score announcements, tracks student progress, and
                helps instructors align with educational goals.
              </p>
            </div>

            <img src={studentPLOPage} alt="CMULogo" className="h-[50%]" />

            <div className="flex flex-col gap-16 justify-center w-full font-[600] text-[17px] px-10">
              <div className="flex items-start justify-center gap-28">
                <div className="flex flex-col items-start gap-3 text-pretty w-[370px]">
                  <Icon IconComponent={IconBulb} className="size-16 stroke-1" />
                  <p>
                    Effortless -{"  "}
                    <span className="text-[#86868B]">
                      Easily upload, publish, and manage course scores in just a
                      few clicks, saving you time and effort.
                    </span>
                  </p>
                </div>
                <div className="flex flex-col items-start gap-3 text-pretty w-[370px]">
                  <Icon IconComponent={IconBulb} className="size-16 stroke-1" />
                  <p>
                    Insightful -{"  "}
                    <span className="text-[#86868B]">
                      Access powerful, clear charts that provide deep insights
                      into scores for each assignment.
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start justify-center gap-28">
                <div className="flex flex-col items-start gap-3 text-pretty w-[370px]">
                  <Icon
                    IconComponent={IconSparkle}
                    className="size-16 stroke-1"
                  />
                  <p>
                    Empowering -{" "}
                    <span className="text-[#86868B]">
                      Seamlessly align assessments with learning goals, ensuring
                      accuracy and alignment with program objectives.
                    </span>
                  </p>
                </div>
                <div className="flex flex-col items-start gap-3 text-pretty w-[370px]">
                  <Icon
                    IconComponent={IconSparkle}
                    className="size-16 stroke-1"
                  />
                  <p>
                    Streamlined -{" "}
                    <span className="text-[#86868B]">
                      Quickly generate TQF reports for course evaluations,
                      simplifying the process with minimal effort required.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
