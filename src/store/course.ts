import { IModelCourse } from "@/models/ModelCourse";
import { createSlice } from "@reduxjs/toolkit";

export const courseSlice = createSlice({
  name: "course",
  initialState: { total: 0, search: "", courses: [] } as {
    total: number;
    search: string;
    courses: IModelCourse[];
  },
  reducers: {
    resetSeachCourse: (state) => {
      return { ...state, search: "" };
    },
    setCourseList: (state, action) => {
      return {
        total: action.payload.totalCount ?? state.total,
        search: action.payload.search ?? state.search,
        courses: [...(action.payload.courses ?? action.payload)],
      };
    },
    addLoadMoreCourse: (state, action) => {
      return { ...state, courses: [...state.courses, ...action.payload] };
    },
    editCourse: (state, action) => {
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload.id
            ? { ...course, ...action.payload }
            : course
        ),
      };
    },
    editSection: (state, action) => {
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload.id
            ? {
                ...course,
                sections: course.sections
                  .map((sec) =>
                    sec.id === action.payload.secId
                      ? { ...sec, ...action.payload.data }
                      : sec
                  )
                  .sort((a, b) => a.sectionNo - b.sectionNo),
              }
            : course
        ),
      };
    },
    removeCourse: (state, action) => {
      return {
        total: state.total - 1,
        search: state.search,
        courses: state.courses.filter((course) => course.id != action.payload),
      };
    },
    removeSection: (state, action) => {
      return {
        total: state.total - 1,
        search: state.search,
        courses: state.courses.map((course) =>
          course.id === action.payload.id
            ? {
                ...course,
                sections: course.sections.filter(
                  (sec) => sec.id !== action.payload.secId
                ),
              }
            : course
        ),
      };
    },
  },
});

export const {
  resetSeachCourse,
  setCourseList,
  addLoadMoreCourse,
  editCourse,
  editSection,
  removeCourse,
  removeSection,
} = courseSlice.actions;

export default courseSlice.reducer;
