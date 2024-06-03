import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@store/user";
import Login from "@pages/login";
import Page404 from "@pages/Page404";
import { getUserInfo } from "@services/user/user.service";
import CMUOAuthCallback from "@pages/cmuOAuthCallback";
import { removeLocalStorage } from "@helpers/functions/localStorage";
import { ROUTE_PATH } from "@helpers/constants/route";

function App() {
  const user = useSelector((state: any) => state.user.value);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.role) return;

    const fetchData = async () => {
      const res = await getUserInfo();
      if (res.role) {
        dispatch(setUser(res));
      } else {
        removeLocalStorage("token");
      }
    };

    fetchData();
  }, [user, dispatch]);

  return (
    <Router>
      <Routes>
        <Route path={ROUTE_PATH.LOGIN} element={<Login />} />
        <Route
          path={ROUTE_PATH.CMU_OAUTH_CALLBACK}
          element={<CMUOAuthCallback />}
        />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  );
}

export default App;
