"use client";
import cmulogoLogin from "@/assets/image/cmuLogoLoginWhite.png";
import loginImage from "@/assets/image/loginPage.png";
import { Button, Paper, Title } from "@mantine/core";
import { Image } from "@mantine/core";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "@/helpers/constants/route";
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
import Loading from "@/components/Loading";
import gradescope from "@/assets/image/gradescope.png";
import "@mantine/carousel/styles.css";
import { Carousel, Embla } from "@mantine/carousel";
import { ROLE } from "@/helpers/constants/enum";
import { goToDashboard } from "@/helpers/functions/function";

export default function Login() {
  const loading = useAppSelector((state) => state.loading);
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right"); // Track the slide direction
  const [scrollProgress, setScrollProgress] = useState(0);
  const [embla, setEmbla] = useState<Embla | null>(null);

  const handleScroll = useCallback(() => {
    if (!embla) return;
    const progress = Math.max(0, Math.min(1, embla.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [embla, setScrollProgress]);

  useEffect(() => {
    if (embla) {
      embla.on("scroll", handleScroll);
      handleScroll();
    }
  }, [embla]);

  // const handleNext = () => {
  //   setDirection("right");
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex === images.length - 1 ? 0 : prevIndex + 1
  //   );
  // };

  // const handlePrev = () => {
  //   setDirection("left");
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex === 0 ? images.length - 1 : prevIndex - 1
  //   );
  // };

  useEffect(() => {
    dispatch(setShowSidebar(false));
    dispatch(setShowNavbar(true));
    if (!isEmpty(user)) {
      goToDashboard(user.role);
    }
  }, [user]);

  return loading ? (
    <Loading />
  ) : (
    <div className=" bg-[#fafafa]  h-full w-screen items-center flex flex-col overflow-y-auto overflow-x-hidden">
      <div className="flex    flex-col w-full ">
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
        <div className="flex items-center  mt-8 text-center w-full justify-center px-[12px] mb-8  sm:hidden">
          <p className="text-center  font-medium flex flex-col  text-[#4F4D55]">
            <span className="font-bold text-b1 text-secondary ">
              ScoreOBE + is not available <br/> on your current window size.
            </span>
            <br />
            <span className="text-b2">
            To log in, please use ScoreOBE + on a tablet in landscape mode <br/> or a desktop for the best experience.
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
          <div className=" sm:flex relative hidden  items-center rounded-t-xl justify-center p-5 py-[9px] border-b-[1px] border-[#eeeeee] flex-row gap-0 w-full bg-white">
            <div className=" absolute -top-10 py-20  rotate-180 -z-50 w-screen h-screen  flex justify-center">
              <div className="rounded-full h-full w-3/6 bg-[#FF7847] opacityy-50 bg-blur"></div>
              <div className="rounded-full h-[97%] w-3/6 bg-[#FF469D] opacityy-50 bg-blur"></div>
              <div className="rounded-full h-[97%] w-3/6 bg-[#7733FF] opacityy-50 bg-blur"></div>
              <div className="rounded-full h-[97%] w-3/6 bg-[#0A7CFF] opacityy-50 bg-blur"></div>{" "}
              <div className="rounded-full h-[97%] w-3/6 bg-[#00abdf] opacityy-50 bg-blur"></div>
            </div>
            <div className="flex justify-start w-[35%]   flex-row gap-6 items-center">
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
          <div className="items-start text-start px-[118px] pb-12 justify-start w-full ">
            {" "}
            <p className=" drop-shadow-xl pb-2 cursor-default mt-16 leading-[56px]  items-start -rounded text-[#000000] text-[48px]">
              <span className="font-[600]  text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                Upload, Publish
                <br /> grading efficiency.
              </span>{" "}
              <br />
            </p>
            <div className=" flex items-center justify-between">
              <p className="mt-5 text-[19px] text-default font-[500]">
                Effortless score uploads, instant analytics, <br /> and visual
                insights! Elevate your grading today! <br />
                <span className="mt-5 underline text-b1  text-[#7b7b7c] font-[500]">
                  Available in December or January
                </span>
              </p>
              <div className="flex justify-end gap-5">
                {" "}
                <div className="flex justify-start flex-col items-start mt-2 mb-2">
                  <img src={gradescope} alt="CMULogo" className="h-[32px]" />
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
            {/* <div className="flex flex-col items-center my-3">
              <div className="w-full h-full max-w-[60vw] !rounded-xl flex justify-center items-center">
                <Image
                  src={images[currentIndex].url}
                  alt={images[currentIndex].label}
                  className="rounded-xl"
                />
              </div>

              <div className=" flex  w-full max-w-[60vw] items-center justify-between">
                <div className="mt-4 text-lg font-semibold text-center">
                  {images[currentIndex].label}
                </div>

                <div className="flex justify-end  mt-4">
                  <Button variant="subtle" onClick={handlePrev}>
                    <Icon IconComponent={IconChevronLeft} className="size-6" />
                  </Button>
                  <Button
                    variant="subtle"
                    onClick={handleNext}
                    className=" rounded-full"
                  >
                    <Icon IconComponent={IconChevronRight} className="size-6" />
                  </Button>
                </div>
              </div> */}
            {/* </div> */}
          </div>
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

        {/* Admin View */}
        <div className="bg-[#fafafa] sm:flex hidden h-full w-full flex-col gap-16 ">
          <div className="flex flex-col items-center ">
            <p className=" drop-shadow-xl pb-2 cursor-default mt-16 leading-[56px]  items-start -rounded text-[#000000] text-[48px]">
              <span className="font-[600]  text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                Admin View
              </span>{" "}
              <br />
            </p>
            <p className="mt-5 text-[19px] text-default font-[500] text-center mx-40">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
              <span className="mt-5 underline text-b1  text-[#7b7b7c] font-[500]">
                Available in December or January
              </span>
            </p>
          </div>
          <div className=" flex items-center justify-center gap-36">
            <div className="flex flex-col my-2">
              <div className="pb-2 border-b-2 w-48 text-start">
                <p className=" text-black font-[700]  text-[19px]  pt-4 ">
                  TQF
                </p>
              </div>
              <p className=" text-default font-[500] pt-2 text-b2 leading-[22px] text-start text-wrap w-48 ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="flex flex-col my-2">
              <div className="pb-2 border-b-2 w-48 text-start">
                <p className=" text-black font-[700]  text-[19px]  pt-4 ">
                  CLO
                </p>
              </div>
              <p className=" text-default font-[500] pt-2 text-b2 leading-[22px] text-start text-wrap w-48">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="flex flex-col my-2">
              <div className="pb-2 border-b-2 w-48 text-start">
                <p className=" text-black font-[700]  text-[19px]  pt-4 ">
                  PLO
                </p>
              </div>
              <p className=" text-default font-[500] pt-2 text-b2 leading-[22px] text-start text-wrap w-48">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-16 items-center bg-black h-fit text-white px-28 py-20">
            <div className="flex flex-col gap-16 items-center">
              <p className="font-[600] text-[48px] ">
                Boost Student Success with{" "}
                <span className="font-[600]  text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                  ScoreOBE+!
                </span>
              </p>

              <div>
                <Image
                  src={
                    "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png"
                  }
                  className={`h-[380px] w-[880px] object-cover rounded-xl `}
                />
              </div>

              <div className="flex flex-col gap-16 justify-center w-full font-[600] text-[17px] px-10">
                <div className="flex items-start justify-center gap-28">
                  <div className="flex flex-col items-start gap-3 text-pretty w-[370px]">
                    <Icon
                      IconComponent={IconBulb}
                      className="size-16 stroke-1"
                    />
                    <p>
                      Effortless -{"  "}
                      <span className="text-[#86868B]">
                        Easily upload, publish, and manage course scores in just
                        a few clicks, saving you time and effort.
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-3 text-pretty w-[370px]">
                    <Icon
                      IconComponent={IconBulb}
                      className="size-16 stroke-1"
                    />
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
                        Seamlessly align assessments with learning goals,
                        ensuring accuracy and alignment with program objectives.
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
    </div>
  );
}
