import { IModelCourse } from "@/models/ModelCourse";
import { createSlice } from "@reduxjs/toolkit";

export const courseSlice = createSlice({
  name: "courseSyllabus",
  initialState: { total: 0, search: "", courses: [] } as {
    total: number;
    search: string;
    courses: IModelCourse[];
  },
  reducers: {
    setSeachCourseSyllabus: (state, action) => {
      return { ...state, search: action.payload };
    },
    setCourseSyllabus: (state, action) => {
      return {
        total: action.payload.totalCount ?? state.total,
        search: action.payload.search ?? state.search,
        courses: [...(action.payload.courses ?? action.payload)],
      };
    },
    addLoadMoreCourseSyllabus: (state, action) => {
      return { ...state, courses: [...state.courses, ...action.payload] };
    },
  },
});

export const {
  setSeachCourseSyllabus,
  setCourseSyllabus,
  addLoadMoreCourseSyllabus,
} = courseSlice.actions;

export default courseSlice.reducer;
