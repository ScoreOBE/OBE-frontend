import { createSlice } from "@reduxjs/toolkit";

export const progressSlice = createSlice({
  name: "progress",
  initialState: 0,
  reducers: {
    setProgress: (state, action) => {
      return action.payload;
    },
  },
});

export const { setProgress } = progressSlice.actions;

export default progressSlice.reducer;
