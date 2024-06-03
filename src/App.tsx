import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/user";
import Login from "@/pages/login";
import Page404 from "@/pages/Page404";
import { getUserInfo } from "@/services/user/user.service";
import CMUOAuthCallback from "@/pages/cmuOAuthCallback";
import { removeLocalStorage } from "@/helpers/functions/localStorage";
import { ROUTE_PATH } from "@/helpers/constants/route";
import SelectDepartment from "@/pages/selectDepartment";
import { IModelUser } from "@/models/ModelUser";
import Dashboard from "@/pages/dashboard";

function App() {
  const user: IModelUser = useSelector((state: any) => state.user.value);
  const dispatch = useDispatch();
  const path = window.location.pathname;
  const showSidebar = ![ROUTE_PATH.LOGIN, ROUTE_PATH.SELECTED_DEPARTMENT, ROUTE_PATH.CMU_OAUTH_CALLBACK].includes(path as any);

  useEffect(() => {
    if (user.role || path == ROUTE_PATH.CMU_OAUTH_CALLBACK) return;

    const fetchData = async () => {
      const res = await getUserInfo();
      if (res.role) {
        dispatch(setUser(res));
      } else {
        if (path != ROUTE_PATH.LOGIN) {
          removeLocalStorage("token");
          window.location.replace(ROUTE_PATH.LOGIN);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <Router>
      <div
        className={`flex  h-screen w-screen ${
          showSidebar ? "sidebar-linear-gradient" : ""
        }`}
      >
        {showSidebar && <Sidebar />}
        <div className="flex flex-col w-full">
          {showSidebar && <Navbar />}
          <Routes>
            <Route path={ROUTE_PATH.LOGIN} element={<Login />} />
            <Route
              path={ROUTE_PATH.CMU_OAUTH_CALLBACK}
              element={<CMUOAuthCallback />}
            />
            <Route
              path={ROUTE_PATH.SELECTED_DEPARTMENT}
              element={<SelectDepartment />}
            />
            <Route path={ROUTE_PATH.DASHBOARD_INS} element={<Dashboard />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
