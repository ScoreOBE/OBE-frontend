import cmulogo from "@/assets/image/cmuLogo.png";
import entlogo from "@/assets/image/entLogo.png";
import cmulogoLogin from "@/assets/image/cmuLogoLoginWhite.png";
import { Button } from "@mantine/core";
import { useAppSelector } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { isEmpty } from "lodash";

export default function Login() {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isEmpty(user)) {
      navigate(ROUTE_PATH.DASHBOARD_INS);
    }
  }, [user]);
  return (
    <div className=" custom-radial-gradient h-screen w-screen items-center justify-center flex">
      {/* <img
        src={cmulogo}
        alt="CMULogo"
        className=" absolute top-12 left-12 h-[24px]"
      /> */}

      <div
        className=" items-center text-center justify-center p-12 px-24 flex flex-col w-full h-full drop-shadow-xl shadow-red-700 "
        style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.35)" }}
      >
        {/* <img src={entlogo} alt="CMULogo" className="h-[130px]" /> */}
        {/* <div className=" cursor-default mt-7 font-bold -rounded text-[#333333] text-4xl">
          Welcome to Score OBE
          <span className=" text-[#FFCD1B]"> +</span>
        </div> */}
        <p className=" drop-shadow-xl cursor-default mt-5 leading-[60px] font-bold item-center -rounded text-[#333333] text-5xl">
          The all-in-one <span className=" text-secondary">OBE Score system </span> <br/>for instructor and student
        </p>
        <p className="mt-4 text-h2 font-medium">Discover A Better Way to Do OBE Simplify Your Academic Journey</p>

        

        {/* <div className=" cursor-default text-[16px] mb-1 mt-10 font-notoThai text-white">
          ลงชื่อเข้าสู่ระบบ
        </div> */}
        {/* // button login */}
        <a href={import.meta.env.VITE_NEXT_PUBLIC_CMU_OAUTH_URL}>
          <Button color="#5768d5" className=" mt-12 rounded-[12px] text-[#fffff] -rounded font-medium text-[14px] font-semibold h-10 ">
            <img
              src={cmulogoLogin}
              alt="CMULogo"
              className="h-[13px] mr-3 rounded-1xl"
            />
            Sign in CMU Account
          </Button>
        </a>
      </div>
    </div>
  );
}
