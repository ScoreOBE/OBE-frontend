import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import { createSlice } from "@reduxjs/toolkit";

export const academicYearSlice = createSlice({
  name: "academicYear",
  initialState: [] as IModelAcademicYear[],
  reducers: {
    setAcademicYear: (state, action) => {
      return [...action.payload];
    },
    setProcessTQF3: (state, action) => {
      return state.map((e) => {
        if (e.id == action.payload.id) {
          return action.payload;
        }
        return e;
      });
    },
  },
});

export const { setAcademicYear, setProcessTQF3 } = academicYearSlice.actions;

export default academicYearSlice.reducer;
