import { IModelCourseManagement } from "@/models/ModelCourseManagement";
import { createSlice } from "@reduxjs/toolkit";

export const courseManagementSlice = createSlice({
  name: "courseManagement",
  initialState: { total: 0, search: "", courseManagements: [] } as {
    total: number;
    search: string;
    courseManagements: IModelCourseManagement[];
  },
  reducers: {
    setCourseManagementList: (state, action) => {
      return {
        total: action.payload.totalCount ?? state.total,
        search: action.payload.search ?? state.search,
        courseManagements: [...(action.payload.courses ?? action.payload)],
      };
    },
    addLoadMoreCourseManagement: (state, action) => {
      return {
        ...state,
        courseManagements: [...state.courseManagements, ...action.payload],
      };
    },
    editCourseManagement: (state, action) => {
      return {
        ...state,
        courseManagements: state.courseManagements.map((courseManagement) =>
          courseManagement.id === action.payload.id
            ? { ...courseManagement, ...action.payload }
            : courseManagement
        ),
      };
    },
    removeCourseManagement: (state, action) => {
      return {
        total: state.total - 1,
        search: state.search,
        courseManagements: state.courseManagements.filter(
          (courseManagement) => courseManagement.id != action.payload
        ),
      };
    },
  },
});

export const {
  setCourseManagementList,
  addLoadMoreCourseManagement,
  editCourseManagement,
  removeCourseManagement,
} = courseManagementSlice.actions;

export default courseManagementSlice.reducer;
