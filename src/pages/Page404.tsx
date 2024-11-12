import Icon from "@/components/Icon";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch } from "@/store";
import { setLoading, setLoadingOverlay } from "@/store/loading";
import { setShowNavbar } from "@/store/showNavbar";
import { setShowSidebar } from "@/store/showSidebar";
import { Button } from "@mantine/core";
import IconArrowLeft from "@/assets/icons/arrowLeft.svg?react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setLoading(false));
    dispatch(setLoadingOverlay(false));
    dispatch(setShowSidebar(false));
    dispatch(setShowNavbar(false));
  }, []);

  const goBack = () => {
    if (localStorage.getItem("token")) {
      navigate(-1);
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
              <span className="text-white font-normal ">Ooops ! </span>
            </p>
            <p className="text-4xl mt-6 font-semibold">You've lost in space</p>
            <p className="text-lg  font-medium text-gray-400">
              The page you're looking for is now beyond the known universe.
            </p>
            <Button
              onClick={goBack}
              leftSection={
                <Icon
                  IconComponent={IconArrowLeft}
                  className="size-6 -mr-1 stroke-2"
                />
              }
              className="inline-block !text-[16px] -ml-4 mt-3 bg-transparent hover:bg-transparent hover:underline text-white !font-bold !rounded transition"
            >
              Back
            </Button>
          </div>

          <p className="text-[120px] font-medium ">404</p>
        </div>
      </div>
    </div>
  );
}
