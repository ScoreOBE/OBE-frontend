import { IModelCourse } from "@/models/ModelCourse";
import { IModelPLO } from "@/models/ModelPLO";
import { IModelTQF5 } from "@/models/ModelTQF5";
import { createSlice } from "@reduxjs/toolkit";

export const tqf5Slice = createSlice({
  name: "tqf5",
  initialState: {} as IModelTQF5 &
    IModelCourse & {
      topic?: string;
      ploRequired?: string[];
      coursePLO?: Partial<IModelPLO>;
    },
  reducers: {
    resetDataTQF5: () => {
      return {} as any;
    },
    setDataTQF5: (state, action) => {
      return { coursePLO: { ...state.coursePLO }, ...action.payload };
    },
    setPloTQF5: (state, action) => {
      return { ...state, coursePLO: action.payload };
    },
    setSelectTqf5Topic: (state, action) => {
      return { ...state, topic: action.payload };
    },
    updatePartTQF5: (state, action) => {
      return { ...state, [action.payload.part]: { ...action.payload.data } };
    },
  },
});

export const {
  resetDataTQF5,
  setDataTQF5,
  setPloTQF5,
  setSelectTqf5Topic,
  updatePartTQF5,
} = tqf5Slice.actions;

export default tqf5Slice.reducer;
