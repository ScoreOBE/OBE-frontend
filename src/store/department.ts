import { IModelDepartment, IModelFaculty } from "@/models/ModelFaculty";
import { createSlice } from "@reduxjs/toolkit";

export const facultySlice = createSlice({
  name: "faculty",
  initialState: { faculty: {}, department: [] } as {
    faculty: Partial<IModelFaculty>;
    department: Partial<IModelDepartment>[];
  },
  reducers: {
    setFaculty: (state, action) => {
      return {
        ...state,
        faculty: { ...action.payload },
      };
    },
    setDepartment: (state, action) => {
      return {
        ...state,
        department: [...action.payload],
      };
    },
  },
});

export const { setFaculty, setDepartment } = facultySlice.actions;

export default facultySlice.reducer;
