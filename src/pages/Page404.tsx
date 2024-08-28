import { ROLE } from "@/helpers/constants/enum";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch, useAppSelector } from "@/store";
import { setShowSidebar } from "@/store/showSidebar";
import { Button } from "@mantine/core";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(setShowSidebar(false));
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
    <div className="flex flex-col w-screen h-screen gap-10 -rounded font-extrabold justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <p className="text-9xl font-bold">404</p>
        <p className="text-3xl font-bold">Page Not Found</p>
      </div>
      <Button onClick={goDashboard}>Go Home</Button>
    </div>
  );
}
