import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/store/user";
import { login } from "@/services/authentication/authentication.service";
import { Button } from "@mantine/core";
import { setLocalStorage } from "@/helpers/functions/localStorage";
import { ROUTE_PATH } from "@/helpers/constants/route";

export default function CMUOAuthCallback() {
  const user = useSelector((state: any) => state.user.value);
  const dispatch = useDispatch();
  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get("code");
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!code || user.accountType) return;

    const fetchData = async () => {
      const res = await login(code);
      if (res.token) {
        dispatch(setUser(res.user));
        localStorage.setItem("token", res.token);
        if (res.user.department) navigate(ROUTE_PATH.DASHBOARD_INS);
        else navigate(ROUTE_PATH.SELECTED_DEPARTMENT);
      } else {
        setMessage(res);
      }
    };

    fetchData();
  }, [code, user, navigate, dispatch]);

  return (
    <div className="flex flex-col w-screen h-screen gap-10 font-sf-pro-rounded font-extrabold justify-center items-center">
      <h1 className="text-3xl whitespace-break-spaces">
        {message || "Redirecting ..."}
      </h1>
      <div className="justify-center flex flex-row gap-10 text-xl">
        {!user.type && (
          <Button
            className="bg-[#ED3838] text-lg hover:bg-[#ff6c6c]"
            onClick={() => navigate(ROUTE_PATH.LOGIN)}
          >
            Back
          </Button>
        )}
      </div>
    </div>
  );
}
