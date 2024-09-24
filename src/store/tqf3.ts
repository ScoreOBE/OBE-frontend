import { IModelCourse } from "@/models/ModelCourse";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { createSlice } from "@reduxjs/toolkit";

export const tqf3Slice = createSlice({
  name: "tqf3",
  initialState: {} as IModelTQF3 & IModelCourse,
  reducers: {
    setDataTQF3: (state, action) => {
      return { ...action.payload };
    },
    updatePartTQF3: (state, action) => {
      return { ...state, [action.payload.part]: { ...action.payload.data } };
    },
  },
});

export const { setDataTQF3, updatePartTQF3 } = tqf3Slice.actions;

export default tqf3Slice.reducer;
