import { IModelCourse } from "@/models/ModelCourse";
import { createSlice } from "@reduxjs/toolkit";

export const courseSlice = createSlice({
  name: "course",
  initialState: [] as IModelCourse[],
  reducers: {
    setCourse: (state, data) => {
      return [...state, ...data.payload];
    },
  },
});

export const { setCourse } = courseSlice.actions;

export default courseSlice.reducer;
