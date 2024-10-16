import cmulogoLogin from "@/assets/image/cmuLogoLoginWhite.png";
import loginImage from "@/assets/image/loginPage.png";
import { Button } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { isEmpty } from "lodash";
import { setShowSidebar } from "@/store/showSidebar";
import lockIcon from "@/assets/icons/lockIcon.svg?react";
import refresh from "@/assets/icons/refresh.svg?react";
import chevronRight from "@/assets/icons/chevronRight.svg?react";
import chevronLeft from "@/assets/icons/chevronLeft.svg?react";
import plus2 from "@/assets/icons/plus2.svg?react";
import share2 from "@/assets/icons/share2.svg?react";
import { setShowNavbar } from "@/store/showNavbar";

import Icon from "@/components/Icon";

export default function Login() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(setShowSidebar(false));
    dispatch(setShowNavbar(true));
    if (!isEmpty(user)) {
      navigate(ROUTE_PATH.DASHBOARD_INS);
    }
  }, [user]);
  return (
    <div className=" overflow-hidden  h-screen w-screen  items-center  flex">
      <div className=" items-center text-center   rounded-xl  overflow-hidden  h-full  max-h-full  flex flex-col w-full   ">
        <p className=" drop-shadow-xl cursor-default mt-16 leading-[74px] font-[600] item-center -rounded text-[#000000] text-[60px]">
          The all-in-one{" "}
          <span className=" text-secondary font-[700]">
            Score OBE <span className=" text-[#FFCD1B]"> +</span>{" "}
          </span>{" "}
          <br />
          for instructor and student
        </p>
        <p className="mt-5 text-h2 text-[#4F4D55] font-[500]">
          Discover A Better Way to Do OBE Simplify Your Academic Journey
        </p>

        <a href={import.meta.env.VITE_NEXT_PUBLIC_CMU_OAUTH_URL}>
          <Button className="mt-8 drop-shadow-lg !text-[14px] !h-[44px]">
            <img
              src={cmulogoLogin}
              alt="CMULogo"
              className="h-[13px] mr-3 rounded-1xl"
            />
            Sign in CMU Account
          </Button>
        </a>
        <div
          className="rounded-t-xl relative mt-8 w-10/12 h-4/6"
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className=" flex relative  items-center rounded-t-xl justify-center p-5 py-[9px] border-b-[1px] border-[#eeeeee] flex-row gap-0 w-full bg-white">
            <div className="flex justify-start w-[35%]   flex-row gap-6 items-center">
              <div className="flex  flex-row gap-2">
                <div className=" rounded-full w-[12px] h-[12px] bg-[#ED6A5E]"></div>
                <div className=" rounded-full w-[12px] h-[12px] bg-[#F4BF4F]"></div>
                <div className=" rounded-full w-[12px] h-[12px] bg-[#61C554]"></div>
              </div>
              <div className="flex flex-row gap-2">
                <Icon IconComponent={chevronLeft} className="text-[#8c8c8c] size-[22px]"/>
                <Icon IconComponent={chevronRight} className="text-[#8c8c8c] size-[22px]"/>
              </div>
            </div>
            <div className="flex w-[30%] flex-row gap-2">
              <div className=" h-[28px] relative rounded-lg w-full text-[12px] gap-2 font-medium flex  items-center bg-[#F1F1F1]">
                <div className="justify-center gap-2 items-center w-full flex">
                  <Icon IconComponent={lockIcon} className=" size-[14px]" />
                  score-obe.cpe.eng.cmu.ac.th
                </div>
                <Icon
                  IconComponent={refresh}
                  className="absolute right-3 justify-end size-[12px] "
                />
              </div>
            </div>
            <div className="flex w-[35%] justify-end items-center flex-row gap-2">
              <Icon IconComponent={share2} className="text-[#8c8c8c] size-[20px]" />
              <Icon IconComponent={plus2} className="text-[#8c8c8c] size-[20px]" />
            </div>
          </div>

          <img className=" z-50 w-full " src={loginImage} alt="loginImage" />
        </div>
        <div className=" absolute bottom-0 rotate-180 -z-50 w-screen h-screen overflow-hidden flex justify-center">
          <div className="rounded-full h-3/6 w-3/6 bg-[#00DFDF] opacityy-50 bg-blur"></div>
          <div className="rounded-full h-3/6 w-3/6 bg-[#0A7CFF] opacityy-50 bg-blur"></div>
          <div className="rounded-full h-3/6 w-3/6 bg-[#7733FF] opacityy-50 bg-blur"></div>
          <div className="rounded-full h-3/6 w-3/6 bg-[#FF469D] opacityy-50 bg-blur"></div>
          <div className="rounded-full h-3/6 w-3/6 bg-[#FF7847] opacityy-50 bg-blur"></div>
        </div>
      </div>
    </div>
  );
}
