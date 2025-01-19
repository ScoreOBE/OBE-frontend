import { IModelCourse } from "@/models/ModelCourse";
import { createSlice } from "@reduxjs/toolkit";

export const allCourseSlice = createSlice({
  name: "allCourse",
  initialState: { total: 0, search: "", curriculum: [], courses: [] } as {
    total: number;
    search: string;
    courses: IModelCourse[];
  },
  reducers: {
    resetSeachAllCourse: (state) => {
      return { ...state, search: "" };
    },
    setSearchCurriculum: (state, action) => {
      return { ...state, curriculum: [...action.payload] };
    },
    setAllCourseList: (state, action) => {
      return {
        total: action.payload.totalCount ?? state.total,
        search: action.payload.search ?? state.search,
        courses: [...(action.payload.courses ?? action.payload)],
      };
    },
    addLoadMoreAllCourse: (state, action) => {
      return { ...state, courses: [...state.courses, ...action.payload] };
    },
  },
});

export const {
  resetSeachAllCourse,
  setSearchCurriculum,
  setAllCourseList,
  addLoadMoreAllCourse,
} = allCourseSlice.actions;

export default allCourseSlice.reducer;
