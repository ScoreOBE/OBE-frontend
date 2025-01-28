import { IModelFaculty } from "@/models/ModelFaculty";
import { createSlice } from "@reduxjs/toolkit";

export const facultySlice = createSlice({
  name: "faculty",
  initialState: {} as IModelFaculty,
  reducers: {
    setFaculty: (state, action) => {
      return { ...action.payload };
    },
    addCurriculum: (state, action) => {
      state.curriculum.push({ ...action.payload });
      return state;
    },
    editCurriculum: (state, action) => {
      state.curriculum = state.curriculum.map((item) =>
        item.code === action.payload.code
          ? { ...item, ...action.payload.value }
          : item
      );
      return state;
    },
    removeCurriculum: (state, action) => {
      state.curriculum = state.curriculum.filter(
        ({ code }) => code != action.payload
      );
      return state;
    },
  },
});

export const { setFaculty, addCurriculum, editCurriculum, removeCurriculum } =
  facultySlice.actions;

export default facultySlice.reducer;
