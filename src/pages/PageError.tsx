import { ROLE } from "@/helpers/constants/enum";
import { STATUS_CODE } from "@/helpers/constants/response.enum";
import scoreobe from "@/assets/image/scoreOBElogobold.png";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch, useAppSelector } from "@/store";
import { setErrorResponse } from "@/store/errorResponse";
import { setLoading } from "@/store/loading";
import { setShowNavbar } from "@/store/showNavbar";
import { setShowSidebar } from "@/store/showSidebar";
import { Button } from "@mantine/core";
import IconArrowLeft from "@/assets/icons/arrowLeft.svg?react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/Icon";
import { setUser } from "@/store/user";

export default function PageError() {
  const error = useAppSelector((state) => state.errorResponse);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setLoading(false));
    dispatch(setShowSidebar(false));
    dispatch(setShowNavbar(false));
  }, []);

  const goDashboard = () => {
    dispatch(setErrorResponse({}));
    if (localStorage.getItem("token")) {
      navigate(
        user.role == ROLE.STUDENT
          ? ROUTE_PATH.STD_DASHBOARD
          : user.role == ROLE.INSTRUCTOR
          ? ROUTE_PATH.INS_DASHBOARD
          : `${ROUTE_PATH.ADMIN_DASHBOARD}/${ROUTE_PATH.TQF}`
      );
    } else {
      dispatch(setUser({}));
      navigate(ROUTE_PATH.LOGIN);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen">
      {error.statusCode == STATUS_CODE.BAD_REQUEST && (
        <div className="text-start bg-[#faefdc] text-white w-screen px-36 h-full flex justify-between items-center ">
          <div className="flex flex-col gap-4">
            <p className="text-3xl   font-semibold">
              <span className=" text-gray-600 font-normal ">Whoops! </span>
            </p>
            <div className="text-4xl font-semibold flex items-center my-4 gap-4">
              <img
                src={scoreobe}
                alt="cpeLogo"
                className=" h-[60px] w-[60px] "
              />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                ScoreOBE +
              </span>{" "}
              <p className="-translate-x-2 text-amber-600 ">Bad Request</p>{" "}
            </div>
            <p className="text-lg  font-medium text-gray-600">
              Something went wrong, we encountered an issue processing
            </p>{" "}
            <Button
              onClick={goDashboard}
              leftSection={
                <Icon
                  IconComponent={IconArrowLeft}
                  className="size-6 -mr-1 stoke-[3px]"
                />
              }
              className="inline-block -ml-4 mt-3 !text-[16px] bg-transparent hover:bg-transparent hover:text-blue-500 hover:underline text-blue-500 !font-bold !rounded transition"
            >
              Back to Dashboard
            </Button>
          </div>
          <p className="text-[120px] text-amber-600 font-medium ">400</p>
        </div>
      )}
      {error.statusCode == STATUS_CODE.UNAUTHORIZED && (
        <div className="text-start bg-[#fff1f1] text-white w-screen px-36 h-full flex justify-between items-center ">
          <div className="flex flex-col gap-4">
            <p className="text-3xl   font-semibold">
              <span className=" text-gray-600 font-normal ">Oh No! </span>
            </p>
            <div className="flex text-4xl font-semibold items-center my-4 gap-4">
              <img
                src={scoreobe}
                alt="cpeLogo"
                className=" h-[60px] w-[60px] "
              />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                ScoreOBE +
              </span>
              <p className="-translate-x-2 text-pink-500 ">Unauthorized</p>
            </div>
            <p className="text-lg  font-medium text-gray-600">
              We couldn't validate or support your credentials <br /> Please try
              again
            </p>
            <Button
              onClick={goDashboard}
              leftSection={
                <Icon
                  IconComponent={IconArrowLeft}
                  className="size-6 -mr-1 stoke-[3px]"
                />
              }
              className="inline-block -ml-4 mt-3 !text-[16px] bg-transparent hover:bg-transparent hover:text-blue-500 hover:underline text-blue-500 !font-bold !rounded transition"
            >
              Back to login
            </Button>
          </div>
          <p className="text-[120px] text-pink-500 font-medium ">401</p>
        </div>
      )}
      {error.statusCode == STATUS_CODE.FORBIDDEN && (
        <div className="text-start bg-[#f1fff8] text-white w-screen px-36 h-full flex justify-between items-center ">
          <div className="flex flex-col gap-4">
            <p className="text-3xl   font-semibold">
              <span className=" text-gray-600 font-normal ">Hold on... </span>
            </p>
            <div className="flex  font-semibold text-4xl items-center my-4 gap-4">
              <img
                src={scoreobe}
                alt="cpeLogo"
                className=" h-[60px] w-[60px] "
              />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                ScoreOBE +
              </span>
              <p className=" -translate-x-2 text-[#24aa79] ">Access Denied</p>
            </div>
            <p className="text-lg  font-medium text-gray-600">
              Your CMU account don't have permission to this website <br />
              contact to the admin to gain access
            </p>
            <Button
              onClick={goDashboard}
              leftSection={
                <Icon
                  IconComponent={IconArrowLeft}
                  className="size-6 -mr-1 stoke-[3px]"
                />
              }
              className="inline-block -ml-4 mt-3 !text-[16px] bg-transparent hover:bg-transparent hover:text-blue-500 hover:underline text-blue-500 !font-bold !rounded transition"
            >
              Back to login
            </Button>
          </div>
          <p className="text-[120px] text-[#24aa79] font-medium ">403</p>
        </div>
      )}
      {/* {error.statusCode == STATUS_CODE.SERVER_ERROR && ( */}
        <div className="text-start bg-[#e9fdff] text-white w-screen px-36 h-full flex justify-between items-center ">
          <div className="flex flex-col gap-4">
            <p className="text-3xl   font-semibold">
              <span className=" text-[#487ded] font-normal ">
                Sorry, this is unexpected...{" "}
              </span>
            </p>
            <div className="flex items-center my-4 gap-4">
              <img
                src={scoreobe}
                alt="cpeLogo"
                className=" h-[60px] w-[60px] "
              />
              <p className="text-4xl text-gray-600   font-semibold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                  ScoreOBE +
                </span>{" "}
                LOST
              </p>
            </div>
            <p className="text-lg  font-medium text-gray-600">
              We're facing an internal server error. Our team're trying to fix
              <br />
              Please be patient or try again by hit Command/Ctrl + R
            </p>
            <Button
              onClick={goDashboard}
              leftSection={
                <Icon
                  IconComponent={IconArrowLeft}
                  className="size-6 -mr-1 stoke-[3px]"
                />
              }
              className="inline-block -ml-4 mt-3 !text-[16px] bg-transparent hover:bg-transparent hover:text-blue-500 hover:underline text-blue-500 !font-bold !rounded transition"
            >
              Back to login
            </Button>
          </div>

          <p className="text-[120px] text-[#487ded] font-medium ">500</p>
        </div>
      {/* )} */}
    </div>
  );
}
