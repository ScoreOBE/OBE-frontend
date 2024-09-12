import { ROLE } from "@/helpers/constants/enum";
import { STATUS_CODE } from "@/helpers/constants/response.enum";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch, useAppSelector } from "@/store";
import { setErrorResponse } from "@/store/errorResponse";
import { setLoading } from "@/store/loading";
import { setShowNavbar } from "@/store/showNavbar";
import { setShowSidebar } from "@/store/showSidebar";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
          ? ROUTE_PATH.DASHBOARD_STD
          : ROUTE_PATH.DASHBOARD_INS
      );
    } else {
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
            <p className="text-4xl text-gray-600 mt-6  font-semibold">
              <span className=" text-amber-600 ">Bad Request</span>{" "}
            </p>
            <p className="text-lg  font-medium text-gray-600">
              Something went wrong, we encountered an issue processing
            </p>{" "}
            <Button
              onClick={goDashboard}
              leftSection={
                <IconArrowLeft className="size-5 -mr-1" stroke={1.5} />
              }
              className="inline-block -ml-4 mt-3 bg-transparent hover:bg-transparent hover:text-blue-500 hover:underline text-blue-500 !font-bold !rounded transition"
            >
              Back to home
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
            <p className="text-4xl text-pink-500 mt-6 font-semibold">
              Unauthorized
            </p>
            <p className="text-lg  font-medium text-gray-600">
              We couldn't validate or support your credentials <br /> Please try
              again
            </p>
            <Button
              onClick={goDashboard}
              leftSection={
                <IconArrowLeft className="size-5 -mr-1" stroke={1.5} />
              }
              className="inline-block -ml-4 mt-3 bg-transparent hover:bg-transparent hover:text-blue-500 hover:underline text-blue-500 !font-bold !rounded transition"
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
            <p className="text-4xl text-[#24aa79] mt-6 font-semibold">
              Access Denied
            </p>
            <p className="text-lg  font-medium text-gray-600">
              Look like your CMU account don't have permission to access{" "}
              <span className=" text-secondary "> Score OBE</span>
              <span className=" text-[#dab531]"> +</span>
              <br />
              Reach out to the system administrator to gain access
            </p>
            <Button
              onClick={goDashboard}
              leftSection={
                <IconArrowLeft className="size-5 -mr-1" stroke={1.5} />
              }
              className="inline-block -ml-4 mt-3 bg-transparent hover:bg-transparent hover:text-blue-500 hover:underline text-blue-500 !font-bold !rounded transition"
            >
              Back to login
            </Button>
          </div>
          <p className="text-[120px] text-[#24aa79] font-medium ">403</p>
        </div>
      )}
      {error.statusCode == STATUS_CODE.SERVER_ERROR && (
        <div className="text-start bg-[#ecebfb] text-white w-screen px-36 h-full flex justify-between items-center ">
          <div className="flex flex-col gap-4">
            <p className="text-3xl   font-semibold">
              <span className=" text-gray-600 font-normal ">
                Sorry, this is unexpected...{" "}
              </span>
            </p>
            <p className="text-4xl text-gray-600 mt-6  font-semibold">
              <span className=" text-secondary ">Score OBE </span>{" "}
              <span className=" text-[#FFCD1B]"> +</span> Lost
            </p>
            <p className="text-lg  font-medium text-gray-600">
              We're facing an internal server error. Our team're trying to fix
              <br />
              Please be patient or try again later
            </p>
            <Button
              onClick={goDashboard}
              leftSection={
                <IconArrowLeft className="size-5 -mr-1" stroke={1.5} />
              }
              className="inline-block -ml-4 mt-3 bg-transparent hover:bg-transparent hover:text-blue-500 hover:underline text-blue-500 !font-bold !rounded transition"
            >
              Back to login
            </Button>
          </div>
          <p className="text-[120px] text-secondary font-medium ">500</p>
        </div>
      )}
    </div>
  );
}
