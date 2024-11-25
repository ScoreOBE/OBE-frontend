import { createSlice } from "@reduxjs/toolkit";

export const showSidebarSlice = createSlice({
  name: "config",
  initialState: {
    dashboard: localStorage.getItem("dashboard"),
    showButtonLogin: false,
    showNavbar: false,
    showSidebar: false,
  },
  reducers: {
    setDashboard: (state, action) => {
      return { ...state, dashboard: action.payload };
    },
    setShowButtonLogin: (state, action) => {
      return { ...state, showButtonLogin: action.payload };
    },
    setShowNavbar: (state, action) => {
      return { ...state, showNavbar: action.payload };
    },
    setShowSidebar: (state, action) => {
      return { ...state, showSidebar: action.payload };
    },
  },
});

export const {
  setDashboard,
  setShowButtonLogin,
  setShowNavbar,
  setShowSidebar,
} = showSidebarSlice.actions;

export default showSidebarSlice.reducer;
