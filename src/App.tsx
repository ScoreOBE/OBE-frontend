import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Radio, Group } from "@mantine/core";
import "@mantine/core/styles.css";
import "tailwindcss/tailwind.css";
import "./App.css";
import Login from "./pages/login";

function App() {
  const [count, setCount] = useState(0);

  return (
    
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
