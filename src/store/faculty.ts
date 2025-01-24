import { IModelFaculty } from "@/models/ModelFaculty";
import { createSlice } from "@reduxjs/toolkit";

export const facultySlice = createSlice({
  name: "faculty",
  initialState: {} as IModelFaculty,
  reducers: {
    setFaculty: (state, action) => {
      return { ...action.payload };
    },
    updateCurriculumList: (state, action) => {
      return { ...state, curriculum: [...action.payload] };
    },
  },
});

export const { setFaculty, updateCurriculumList } = facultySlice.actions;

export default facultySlice.reducer;
