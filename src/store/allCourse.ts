import { IModelCourse } from "@/models/ModelCourse";
import { createSlice } from "@reduxjs/toolkit";

export const allCourseSlice = createSlice({
  name: "allCourse",
  initialState: { total: 0, search: "", departmentCode: [], courses: [] } as {
    total: number;
    search: string;
    departmentCode: string[];
    courses: IModelCourse[];
  },
  reducers: {
    resetSeachAllCourse: (state) => {
      return { ...state, search: "" };
    },
    setSearchDepartmentCode: (state, action) => {
      return { ...state, departmentCode: [...action.payload] };
    },
    setAllCourseList: (state, action) => {
      return {
        total: action.payload.totalCount ?? state.total,
        search: action.payload.search ?? state.search,
        departmentCode: [
          ...(action.payload.departmentCode ?? state.departmentCode),
        ],
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
  setSearchDepartmentCode,
  setAllCourseList,
  addLoadMoreAllCourse,
} = allCourseSlice.actions;

export default allCourseSlice.reducer;
