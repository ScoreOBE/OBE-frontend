import { ROLE } from "@/helpers/constants/enum";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch, useAppSelector } from "@/store";
import { setShowNavbar } from "@/store/showNavbar";
import { setShowSidebar } from "@/store/showSidebar";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(setShowSidebar(false));
    dispatch(setShowNavbar(false));
  }, []);

  const goDashboard = () => {
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
    <div className="flex flex-col bg-black bodyError w-screen h-full px-36  -rounded font-extrabold justify-center items-start">
      <div className="stars"></div>

      <div className="text-start text-white w-full items-center ">
        <div className="flex  items-center justify-between">
          <div className="flex flex-col gap-4">
          <p className="text-3xl   font-semibold">
            <span className="text-white font-normal ">
              Ooops!{" "}
            </span>
          </p>
            <p className="text-4xl mt-6 font-semibold">
              You've lost in space
            </p>
            <p className="text-lg  font-medium text-gray-400">
              The page you're looking for is now beyond the known universe.
            </p>{" "}
            <Button
              onClick={goDashboard}
              leftSection={
                <IconArrowLeft className="h-5 w-5 -mr-1" stroke={1.5} />
              }
              className="inline-block  -ml-4 mt-3 w-fit bg-transparent hover:bg-transparent hover:underline   text-white text-md font-bold rounded  transition"
            >
              Back to home
            </Button>
          </div>

          <p className="text-[180px] font-bold ">404</p>
        </div>
      </div>
    </div>
  );
}
