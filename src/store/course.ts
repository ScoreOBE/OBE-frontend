import { IModelCourse } from "@/models/ModelCourse";
import { createSlice } from "@reduxjs/toolkit";

export const courseSlice = createSlice({
  name: "course",
  initialState: [] as IModelCourse[],
  reducers: {
    setCourse: (state, action) => {
      return [...action.payload];
    },
    addLoadMoreCourse: (state, action) => {
      return [...state, ...action.payload];
    },
    removeCourse: (state, action) => {
      return state.filter((e) => e.id != action.payload);
    },
  },
});

export const { setCourse, addLoadMoreCourse, removeCourse } =
  courseSlice.actions;

export default courseSlice.reducer;
