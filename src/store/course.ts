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
    setSearchCourse: (state, action) => {
      return { ...state, search: action.payload };
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
    updateSections: (state, action) => {
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload.id
            ? {
                ...course,
                sections: course.sections
                  .map((sec) => {
                    const updateSec = action.payload.sections.find(
                      (section: any) => section.id == sec.id
                    );
                    if (updateSec) {
                      return { ...sec, ...updateSec };
                    } else {
                      return sec;
                    }
                  })
                  .sort((a, b) => a.sectionNo! - b.sectionNo!),
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
    updateStudentList: (state, action) => {
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload.id
            ? {
                ...course,
                sections: course.sections
                  .map((sec) => {
                    const updateSec = action.payload.sections.find(
                      (section: any) => section.id == sec.id
                    );
                    if (updateSec) {
                      return { ...sec, students: updateSec.students };
                    } else {
                      return sec;
                    }
                  })
                  .sort((a, b) => a.sectionNo! - b.sectionNo!),
              }
            : course
        ),
      };
    },
    updateAssignments: (state, action) => {
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload.id
            ? {
                ...course,
                sections: course.sections
                  .map((sec) => ({
                    ...sec,
                    ...action.payload.sections.find(
                      (item: any) => sec.sectionNo == item.sectionNo
                    ),
                  }))
                  .sort((a, b) => a.sectionNo - b.sectionNo),
              }
            : course
        ),
      };
    },
  },
});

export const {
  setSearchCourse,
  setCourseList,
  addLoadMoreCourse,
  editCourse,
  editSection,
  updateSections,
  removeCourse,
  removeSection,
  updateStudentList,
  updateAssignments,
} = courseSlice.actions;

export default courseSlice.reducer;
