import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { setUser } from "@/store/user";
import Login from "@/pages/login";
import Page404 from "@/pages/Page404";
import { getUserInfo } from "@/services/user/user.service";
import CMUOAuthCallback from "@/pages/cmuOAuthCallback";
import { ROUTE_PATH } from "@/helpers/constants/route";
import SelectDepartment from "@/pages/selectDepartment";
import Dashboard from "@/pages/dashboard";
import { useAppDispatch, useAppSelector } from "@/store";
import { isEmpty } from "lodash";

function App() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const path = window.location.pathname;
  const routesWithoutSidebar = [
    ROUTE_PATH.LOGIN,
    ROUTE_PATH.SELECTED_DEPARTMENT,
    ROUTE_PATH.CMU_OAUTH_CALLBACK,
  ];
  const isPageNotFound = !Object.values(ROUTE_PATH).includes(path);
  const showSidebar = !isPageNotFound && !routesWithoutSidebar.includes(path);

  useEffect(() => {
    if (path == ROUTE_PATH.CMU_OAUTH_CALLBACK || isPageNotFound) return;

    const fetchData = async () => {
      const res = await getUserInfo();
      if (res.email) {
        dispatch(setUser(res));
        if (path == ROUTE_PATH.LOGIN) {
          window.location.replace(ROUTE_PATH.DASHBOARD_INS);
        }
      } else if (path != ROUTE_PATH.LOGIN) {
        window.location.replace(ROUTE_PATH.LOGIN);
      }
    };
    if (isEmpty(user)) {
      fetchData();
    }
  }, [user]);

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
