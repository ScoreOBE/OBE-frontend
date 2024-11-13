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
import IconShare2 from "@/assets/icons/share2.svg?react";
import IconHistogram from "@/assets/icons/histogram.svg?react";
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
import tqf3pt1 from "@/assets/image/tqf3pt1.png";

export default function Login() {
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const data = [
    {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png",

      title: "Best forests to visit in North America",
      category: "nature",
    },
    {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png",
      title: "Hawaii beaches review: better than you think",
      category: "beach",
    },
    {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png",
      title: "Mountains at night: 12 best locations to enjoy the view",
      category: "nature",
    },
    {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png",
      title: "Aurora in Norway: when to visit for best experience",
      category: "nature",
    },
    {
      image:
        "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png",
      title: "Best places to visit this winter",
      category: "tourism",
    },
  ];

  const tqf3List = [
    {
      id: "1",
      topic: "Course Information",
      description:
        "Fascinated with cooking, though has no sense of tasteFascinated with cooking, though has no sense ",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png",
    },
    {
      id: "2",
      topic: "Description and Planning",
      description:
        "Fascinated with cooking, though has no sense of tasteFascinated with cooking, though has no sense ",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png",
    },
    {
      id: "3",
      topic: "Course Evaluation",
      description:
        "Fascinated with cooking, though has no sense of tasteFascinated with cooking, though has no sense ",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png",
    },
    {
      id: "4",
      topic: "Assessment Mapping",
      description:
        "Fascinated with cooking, though has no sense of tasteFascinated with cooking, though has no sense ",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png",
    },
    {
      id: "5",
      topic: "Course Materials",
      description:
        "Fascinated with cooking, though has no sense of tasteFascinated with cooking, though has no sense ",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png",
    },
    {
      id: "6",
      topic: "Course evaluation and improvement processes",
      description:
        "Fascinated with cooking, though has no sense of tasteFascinated with cooking, though has no sense ",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png",
    },
    {
      id: "7",
      topic: "Curriculum Mapping",
      description:
        "Fascinated with cooking, though has no sense of tasteFascinated with cooking, though has no sense ",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png",
    },
  ];

  const tqf5List = [
    {
      id: "1",
      topic: "Course Evaluation",
      description:
        "Fascinated with cooking, though has no sense of tasteFascinated with cooking, though has no sense ",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png",
    },
    {
      id: "2",
      topic: "Assessment tool mapping to CLO",
      description:
        "Fascinated with cooking, though has no sense of tasteFascinated with cooking, though has no sense ",
      img: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png",
    },
    {
      id: "3",
      topic: "(Rubrics for CLO evaluation",
      description:
        "Fascinated with cooking, though has no sense of tasteFascinated with cooking, though has no sense ",
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
        <p className="text-center drop-shadow-xl cursor-default px-[12px] w-full mt-[70px] sm:mt-8 font-[600] sm:font-[500] item-start rounded text-[#000000] text-[30px] mb-5 sm:mb-0 sm:text-[50px] leading-[48px] sm:leading-[66px]">
          <span className="font-[600] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
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
          <div className="relative items-start text-start px-[118px] pb-32 justify-start w-full overflow-clip">
            {" "}
            <div className="absolute left-0 right-0 bottom-0 z-0 h-52 bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00] blur-[160px]"></div>
            <div className="relative z-30">
              <div className="h-fit w-full bg-red-400 p-20 mt-16 rounded-2xl">
                <p className="drop-shadow-xl pb-2 cursor-default leading-[56px]  items-start -rounded text-[#000000] text-[48px]">
                  <span className="font-[600]  text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                    Upload, Publish
                    <br /> grading efficiency.
                  </span>{" "}
                  <br />
                </p>
                <div className=" flex items-center justify-between">
                  <p className="mt-5 text-[19px] text-default font-[500]">
                    Effortless score uploads, instant analytics, <br /> and
                    visual insights! Elevate your grading today! <br />
                    <span className="mt-5 underline text-b1  text-[#7b7b7c] font-[500]">
                      Available in December or January
                    </span>
                  </p>
                  <div className="flex justify-end gap-5">
                    {" "}
                    <div className="flex justify-start flex-col items-start mt-2 mb-2">
                      <img
                        src={gradescope}
                        alt="CMULogo"
                        className="h-[32px]"
                      />
                      <p className=" text-black font-[700] pt-4 ">
                        Gradescope Support
                      </p>
                      <p className=" text-default font-[500] pt-2 text-b2  leading-[22px]">
                        Effortless grade import Gradescope <br />
                        assignment template
                      </p>
                    </div>
                    <div className="flex justify-start flex-col items-start mt-2 mb-2">
                      <Icon IconComponent={IconHistogram} className="size-8" />
                      <p className=" text-black font-[700] pt-4 ">
                        Statistics & Histogram
                      </p>
                      <p className=" text-default font-[500] pt-2 text-b2 leading-[22px]">
                        Visualize your grade <br /> with interactive charts
                      </p>
                    </div>
                    <div className="flex justify-start flex-col items-start mt-2 mb-2">
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
              <div className="flex flex-col gap-20 ">
                <div className="flex flex-col items-start text-start">
                  <div className="font-[700] flex flex-col gap-1 text-[#ec407a] drop-shadow-xl pb-2 cursor-default mt-16 leading-[56px]  items-start text-[48px] ">
                    <p>Powerful Insight</p>
                    <p className="text-[#1D1D1F]">
                      Convenient, Fast and Effortless
                    </p>
                  </div>
                  <p className="mt-5 text-[17px] text-deemphasize font-[600] text-wrap w-[750px]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor
                  </p>
                </div>
                <div className="flex gap-20">
                  <img
                    src={studentPLOPage}
                    alt="CMULogo"
                    className="w-[85%] h-[85%] -ml-[20%]  bg-red-400 mx-0"
                  />
                  <div className="w-[40%] text-[18px]">
                    <p>PLO</p>
                    <p className="text-[#86868B]">
                      Seamlessly align assessments with learning goals, ensuring
                      accuracy and alignment with program objectives.
                    </p>
                  </div>
                </div>
                <div className="flex gap-20">
                  <div className="w-[40%] text-[18px]">
                    <p>PLO</p>
                    <p className="text-[#86868B]">
                      Seamlessly align assessments with learning goals, ensuring
                      accuracy and alignment with program objectives.
                    </p>
                  </div>
                  <img
                    src={studentPLOPage}
                    alt="CMULogo"
                    className="w-[85%] h-[85%] -mr-[20%]  bg-red-400 mx-0"
                  />
                </div>

                <div className="flex flex-col gap-20 ">
                  <div className="flex flex-col items-center">
                    <div className="font-[700] flex flex-col gap-1 text-[#ec407a] drop-shadow-xl pb-2 cursor-default mt-16 leading-[56px] items-center text-[48px] ">
                      <p>TQF 3</p>
                      <p className="text-[#1D1D1F]">
                        Save Time & Focus on Content
                      </p>
                    </div>
                    <p className="mt-5 text-[17px] text-deemphasize font-[600] text-wrap w-[800px] text-center">
                      With our reusable TQF 3 templates, you can{" "}
                      <span className="text-emphasize">
                        {" "}
                        generate reports quickly and easily. No more redundant
                        data entry{" "}
                      </span>
                      —just fill in the essential details and get a polished
                      report ready in minutes.
                    </p>
                  </div>
                  <div className="flex relative justify-center gap-16">
                    <div className="flex flex-col justify-center items-center gap-2">
                      <p className="text-[24px] font-[600]">Publish</p>
                      <div className="bg-black rounded-2xl h-[550px] w-[600px]">
                        {/* <Image
                      src={studentPLOPage}
                      className={`h-full w-full object-cover rounded-xl`}
                    /> */}

                        {/* <div className="absolute inset-0 bg-black bg-opacity-40 mr-8 rounded-xl">
                      <div className="top-0 flex flex-col justify-end p-6">
                        <p className="text-white opacity-70 font-bold uppercase cursor-default">
                          Topic
                        </p>
                        <Title
                          order={3}
                          className="text-white font-bold text-2xl cursor-default"
                        >
                          Detail
                        </Title>
                      </div>
                    </div> */}
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-center gap-2">
                      <p className="text-[24px] font-[600]">Export</p>
                      <div className="bg-black rounded-2xl h-[550px] w-[600px]">
                        {/* <Image
                      src={studentPLOPage}
                      className={`h-full w-full object-cover rounded-xl`}
                    /> */}

                        {/* <div className="absolute inset-0 bg-black bg-opacity-40 mr-8 rounded-xl">
                      <div className="top-0 flex flex-col justify-end p-6">
                        <p className="text-white opacity-70 font-bold uppercase cursor-default">
                          Topic
                        </p>
                        <Title
                          order={3}
                          className="text-white font-bold text-2xl cursor-default"
                        >
                          Detail
                        </Title>
                      </div>
                    </div> */}
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

            <div className="flex gap-16 h-screen w-screen justify-center items-center">
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

              {/* Image */}
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

              {/* Image */}
              <Image
                src={
                  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png"
                }
                className={`h-[80%] w-[50%] object-cover rounded-xl `}
              />
            </div>
          </div>

          <div className="bg-[#fdd7d7] py-14 flex flex-col gap-10">
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

              <div className="flex gap-16">
                <div className="flex flex-col items-center gap-3 text-pretty w-[370px] border border-[#dddddd] border-24 p-6 rounded-lg">
                  <div className=" flex flex-col gap-1">
                    <Icon
                      IconComponent={IconBulb}
                      className="size-16 stroke-1"
                    />
                    <p className="text-center">
                      Topic <br />
                    </p>
                  </div>
                  <p className="text-[#86868B]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 text-pretty w-[370px] border border-[#dddddd] border-24 p-6 rounded-lg">
                  <div className=" flex flex-col gap-1">
                    <Icon
                      IconComponent={IconBulb}
                      className="size-16 stroke-1"
                    />
                    <p className="text-center">
                      Topic <br />
                    </p>
                  </div>
                  <p className="text-[#86868B]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 text-pretty w-[370px] border border-[#dddddd] border-24 p-6 rounded-lg">
                  <div className=" flex flex-col gap-1">
                    <Icon
                      IconComponent={IconBulb}
                      className="size-16 stroke-1"
                    />
                    <p className="text-center">
                      Topic <br />
                    </p>
                  </div>
                  <p className="text-[#86868B]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor
                  </p>
                </div>
              </div>

              <div className="flex h-fit w-full rounded-xl bg-white border-[#dddddd] border-2 overflow-clip">
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
                        <Accordion.Control className="h-full min-h-[80px] text-[18px]">
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
                  className={`h-full w-[70%] object-cover  `}
                />
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

              <div className="flex gap-16">
                <div className="flex flex-col items-center gap-3 text-pretty w-[370px] border border-[#dddddd] border-24 p-6 rounded-lg">
                  <div className=" flex flex-col gap-1">
                    <Icon
                      IconComponent={IconBulb}
                      className="size-16 stroke-1"
                    />
                    <p className="text-center">
                      Topic <br />
                    </p>
                  </div>
                  <p className="text-[#86868B]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 text-pretty w-[370px] border border-[#dddddd] border-24 p-6 rounded-lg">
                  <div className=" flex flex-col gap-1">
                    <Icon
                      IconComponent={IconBulb}
                      className="size-16 stroke-1"
                    />
                    <p className="text-center">
                      Topic <br />
                    </p>
                  </div>
                  <p className="text-[#86868B]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 text-pretty w-[370px] border border-[#dddddd] border-24 p-6 rounded-lg">
                  <div className=" flex flex-col gap-1">
                    <Icon
                      IconComponent={IconBulb}
                      className="size-16 stroke-1"
                    />
                    <p className="text-center">
                      Topic <br />
                    </p>
                  </div>
                  <p className="text-[#86868B]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor
                  </p>
                </div>
              </div>

              <div className="flex h-fit w-full rounded-xl bg-white border-[#dddddd] border-2 overflow-clip">
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
                        <Accordion.Control className="h-full min-h-[140px] text-[18px]">
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
                  className={`h-full w-[70%] object-cover  `}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#edebce] sm:flex hidden h-fit w-full flex-col gap-28 py-36">
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

            <div className="flex flex-col items-start justify-center gap-8 -translate-x-[45%] h-[70%] ">
              <div className="flex flex-col items-start gap-3 text-pretty w-[370px]">
                <Icon
                  IconComponent={IconSparkle}
                  className="size-16 stroke-1"
                />
                <p>
                  TQF -{" "}
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
                  CLO -{" "}
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
                  PLO -{" "}
                  <span className="text-[#86868B]">
                    Seamlessly align assessments with learning goals, ensuring
                    accuracy and alignment with program objectives.
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center -mt-48">
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
                <div className="bg-[#4285f4]/10 h-[600px] w-[750px] rounded-xl flex items-center justify-center">
                  Image TQF
                </div>
                <div className="h-[600px] flex flex-col gap-4">
                  <div className="bg-[#4285f4]/10 h-full w-[450px] rounded-xl flex items-center justify-center">
                    TQF
                  </div>
                  <div className="bg-[#4285f4]/10 h-full w-[450px] rounded-xl flex items-center justify-center">
                    TQF
                  </div>
                </div>
              </Tabs.Panel>
              <Tabs.Panel value="clo" className="mt-8 flex gap-4">
                <div className="bg-[#ec407a]/10 h-[600px] w-[750px] rounded-xl flex items-center justify-center">
                  Image CLO
                </div>
                <div className="h-[600px] flex flex-col gap-4">
                  <div className="bg-[#ec407a]/10 h-full w-[450px] rounded-xl flex items-center justify-center">
                    CLO
                  </div>
                  <div className="bg-[#ec407a]/10 h-full w-[450px] rounded-xl flex items-center justify-center">
                    CLO
                  </div>
                </div>
              </Tabs.Panel>
              <Tabs.Panel value="plo" className="mt-8 flex gap-4">
                <div className="bg-[#a06ee1]/10 h-[600px] w-[750px] rounded-xl flex items-center justify-center">
                  Image PLO
                </div>
                <div className="h-[600px] flex flex-col gap-4">
                  <div className="bg-[#a06ee1]/10 h-full w-[450px] rounded-xl flex items-center justify-center">
                    PLO
                  </div>
                  <div className="bg-[#a06ee1]/10 h-full w-[450px] rounded-xl flex items-center justify-center">
                    PLO
                  </div>
                </div>
              </Tabs.Panel>
            </Tabs>
          </div>

          <div className="text-center gap-20 font-[700] flex flex-col text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]  drop-shadow-xl pb-2 cursor-default leading-[72px] items-center justify-center w-screen h-screen text-[60px] ">
            <p>
              There's never been a better time <br /> for an upgrade than right
              now.
            </p>
            <img src={studentPLOPage} alt="CMULogo" className="h-[75%]" />
          </div>
        </div>

        <div className="w-full  py-20 sm:flex flex-col gap-10 hidden">
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

                  <div className="absolute inset-0 bg-black bg-opacity-40 mr-8 rounded-xl">
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
        </div>

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
