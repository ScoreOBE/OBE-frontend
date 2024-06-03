import React from "react";
import cmulogo from "../assets/image/cmuLogo.png";
import entlogo from "../assets/image/entLogo.png";
import cmulogoLogin from "../assets/image/cmuLogoLogin.png";
import { Button } from "@mantine/core";

export default function Login() {
  return (
    <div className=" custom-radial-gradient h-screen w-screen items-center justify-center flex">
      <img
        src={cmulogo}
        alt="CMULogo"
        className=" absolute top-12 left-12 h-[24px]"
      />

      <div className="rounded-[25px] items-center justify-center p-12 px-24 flex flex-col w-auto h-auto bg-[rgba(78,78,80,0.35)] drop-shadow-xl shadow-red-700 ">
        <img src={entlogo} alt="CMULogo" className="h-[130px]" />
        <div className=" cursor-default mt-7 font-sf-pro-rounded text-white text-4xl">
          Score OBE
          <span className=" text-[#FFCD1B]"> +</span>
        </div>

        <div className=" cursor-default text-[16px] mb-1 mt-10 font-notoThai text-white">
          ลงชื่อเข้าสู่ระบบ
        </div>
        {/* // button login */}
        <a href={import.meta.env.VITE_NEXT_PUBLIC_CMU_OAUTH_URL}>
          <Button
            style={{ borderRadius: "12px" }}
            className="bg-white mt-1  text-[#696AA9] font-sf-pro-rounded font-medium text-[14px] border-0 h-10 hover:bg-[#DFDFDF] hover:text-[#696AA9] hover:border-0 focus:outline-0"
          >
            <img
              src={cmulogoLogin}
              alt="CMULogo"
              className="h-[13px] mr-3 rounded-3xl"
            />
            Sign in CMU Account
          </Button>
        </a>
      </div>
    </div>
  );
}
