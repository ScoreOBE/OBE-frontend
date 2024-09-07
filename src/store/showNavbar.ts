import { createSlice } from "@reduxjs/toolkit";

export const showNavbarSlice = createSlice({
  name: "showNavbar",
  initialState: true,
  reducers: {
    setShowNavbar: (state, action) => {
      return action.payload;
    },
  },
});

export const { setShowNavbar } = showNavbarSlice.actions;

export default showNavbarSlice.reducer;
