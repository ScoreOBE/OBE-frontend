import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import { createSlice } from "@reduxjs/toolkit";

export const academicYearSlice = createSlice({
  name: "academicYear",
  initialState: [] as IModelAcademicYear[],
  reducers: {
    setAcademicYear: (state, action) => {
      return [...action.payload];
    },
  },
});

export const { setAcademicYear } = academicYearSlice.actions;

export default academicYearSlice.reducer;
