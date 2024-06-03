import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Radio, Group } from "@mantine/core";
import "@mantine/core/styles.css";
import "tailwindcss/tailwind.css";
import "./App.css";
import Login from "./pages/login";
import SelectDepartment from "./pages/selectDepartment";

function App() {

  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/selectDepartment" element={<SelectDepartment />} />
      </Routes>
    </Router>
  );
}

export default App;
