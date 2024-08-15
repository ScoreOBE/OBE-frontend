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
      return state.map((course) =>
        course.id === action.payload.id
          ? { ...course, ...action.payload }
          : course
      );
    },
    removeCourse: (state, action) => {
      return state.filter((course) => course.id != action.payload);
    },
  },
});

export const { setCourseList, addLoadMoreCourse, editCourse, removeCourse } =
  courseSlice.actions;

export default courseSlice.reducer;
