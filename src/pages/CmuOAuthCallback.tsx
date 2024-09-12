import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/store/user";
import { login } from "@/services/authentication/authentication.service";
import { Button } from "@mantine/core";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch, useAppSelector } from "@/store";
import { setShowSidebar } from "@/store/showSidebar";
import { setShowNavbar } from "@/store/showNavbar";

export default function CMUOAuthCallback() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get("code");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setShowSidebar(false));
    dispatch(setShowNavbar(false));
    if (!code || user.id) return;

    const fetchData = async () => {
      const res = await login(code);
      if (res) {
        localStorage.setItem("token", res.token);
        dispatch(setUser(res.user));
        if (res.user.departmentCode.length)
          navigate(ROUTE_PATH.DASHBOARD_INS, { replace: true });
        else navigate(ROUTE_PATH.SELECTED_DEPARTMENT, { replace: true });
      }
    };
    fetchData();
  }, [code]);

  return (
    <div className="flex flex-col w-screen h-screen gap-10 -rounded font-extrabold justify-center items-center">
      <h1 className="text-3xl whitespace-break-spaces">Redirecting ...</h1>
      <div className="justify-center flex flex-row gap-10 text-xl">
        {!user.id && (
          <Button
            className="bg-[#ED3838] !text-lg hover:bg-[#ff6c6c]"
            onClick={() => navigate(ROUTE_PATH.LOGIN)}
          >
            Back
          </Button>
        )}
      </div>
    </div>
  );
}
