import { IModelCourse } from "@/models/ModelCourse";
import { createSlice } from "@reduxjs/toolkit";

export const courseSlice = createSlice({
  name: "course",
  initialState: [] as IModelCourse[],
  reducers: {
    setCourseList: (state, action) => {
      return [...action.payload];
    },
    addLoadMoreCourse: (state, action) => {
      return [...state, ...action.payload];
    },
    editCourse: (state, action) => {
      return state.forEach((e) => {
        if (e.id == action.payload.id) {
          e = { ...e, ...action.payload };
        }
      });
    },
    removeCourse: (state, action) => {
      return state.filter((e) => e.id != action.payload);
    },
  },
});

export const { setCourseList, addLoadMoreCourse, removeCourse } =
  courseSlice.actions;

export default courseSlice.reducer;
