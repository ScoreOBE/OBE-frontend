import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/store/user";
import { logIn } from "@/services/authentication/authentication.service";
import { Button } from "@mantine/core";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch, useAppSelector } from "@/store";
import { setShowSidebar } from "@/store/showSidebar";
import { setShowNavbar } from "@/store/showNavbar";
import { ROLE } from "@/helpers/constants/enum";

export default function CMUOAuthCallback() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get("code");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setShowSidebar(false));
    dispatch(setShowNavbar(false));
    if (!code) {
      navigate(ROUTE_PATH.LOGIN);
      return;
    } else if (user.id) {
      switch (user.role) {
        case ROLE.STUDENT:
          navigate(ROUTE_PATH.STD_DASHBOARD);
          return;
        case ROLE.SUPREME_ADMIN:
        case ROLE.ADMIN:
          navigate(ROUTE_PATH.ADMIN_DASHBOARD);
          return;
        default:
          navigate(ROUTE_PATH.INS_DASHBOARD);
          return;
      }
    }

    const fetchData = async () => {
      const res = await logIn(code);
      if (res) {
        localStorage.setItem("token", res.token);
        dispatch(setUser(res.user));
        if (res.user.departmentCode.length)
          navigate(ROUTE_PATH.INS_DASHBOARD, { replace: true });
        else navigate(ROUTE_PATH.SELECTED_DEPARTMENT, { replace: true });
      }
    };
    fetchData();
  }, [code, user]);

  return (
    <div className="flex flex-col w-screen h-screen gap-10 -rounded font-extrabold justify-center items-center">
      <h1 className="text-3xl whitespace-break-spaces">Redirecting ...</h1>
      <div className="justify-center flex flex-row gap-10 text-xl">
        {!user.id && (
          <Button
            color="red"
            className="!text-lg"
            onClick={() => navigate(ROUTE_PATH.LOGIN)}
          >
            Back
          </Button>
        )}
      </div>
    </div>
  );
}
