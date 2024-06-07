import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import { createSlice } from "@reduxjs/toolkit";

export const AcademicYearSlice = createSlice({
  name: "academicYear",
  initialState: [] as IModelAcademicYear[],
  reducers: {
    setAcademicYear: (state, data) => {
      return [...state, ...data.payload];
    },
  },
});

export const { setAcademicYear } = AcademicYearSlice.actions;

export default AcademicYearSlice.reducer;
