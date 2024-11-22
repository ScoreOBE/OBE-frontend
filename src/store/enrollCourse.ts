import { IModelEnrollCourse } from "@/models/ModelEnrollCourse";
import { createSlice } from "@reduxjs/toolkit";

export const enrollCourseSlice = createSlice({
  name: "enrollCourse",
  initialState: { year: 0, semester: 0, courses: [] as IModelEnrollCourse[] },
  reducers: {
    setEnrollCourseList: (state, action) => {
      return { ...action.payload };
    },
  },
});

export const { setEnrollCourseList } = enrollCourseSlice.actions;

export default enrollCourseSlice.reducer;
