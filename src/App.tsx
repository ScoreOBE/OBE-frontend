import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@mantine/core/styles.css";
import "tailwindcss/tailwind.css";
import "./App.css";
import Sidebar from "./component/Sidebar";
import Login from "./pages/login";
import SelectDepartment from "./pages/selectDepartment";
import Dashboard from "./pages/dashboard";

function App() {
  const location = window.location.pathname;
  const showSidebar = location !== "/";

  return (
    <Router>
      <div
        className={`flex  h-screen w-screen ${
          showSidebar ? "sidebar-linear-gradient" : ""
        }`}
      >
        {showSidebar && <Sidebar />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/selectDepartment" element={<SelectDepartment />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
