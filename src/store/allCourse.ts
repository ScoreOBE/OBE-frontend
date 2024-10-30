import { IModelCourse } from "@/models/ModelCourse";
import { createSlice } from "@reduxjs/toolkit";

export const allCourseSlice = createSlice({
  name: "allCourse",
  initialState: { total: 0, search: "", courses: [] } as {
    total: number;
    search: string;
    courses: IModelCourse[];
  },
  reducers: {
    resetSeachAllCourse: (state) => {
      return { ...state, search: "" };
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

export const { resetSeachAllCourse, setAllCourseList, addLoadMoreAllCourse } =
  allCourseSlice.actions;

export default allCourseSlice.reducer;
