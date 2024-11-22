import { createSlice } from "@reduxjs/toolkit";

export const showSidebarSlice = createSlice({
  name: "config",
  initialState: {
    dashboard: localStorage.getItem("dashboard"),
    showNavbar: false,
    showSidebar: false,
  },
  reducers: {
    setDashboard: (state, action) => {
      return { ...state, dashboard: action.payload };
    },
    setShowNavbar: (state, action) => {
      return { ...state, showNavbar: action.payload };
    },
    setShowSidebar: (state, action) => {
      return { ...state, showSidebar: action.payload };
    },
  },
});

export const { setDashboard, setShowNavbar, setShowSidebar } =
  showSidebarSlice.actions;

export default showSidebarSlice.reducer;
