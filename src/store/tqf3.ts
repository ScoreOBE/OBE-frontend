import { IModelCourse } from "@/models/ModelCourse";
import { IModelPLO } from "@/models/ModelPLO";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { createSlice } from "@reduxjs/toolkit";

export const tqf3Slice = createSlice({
  name: "tqf3",
  initialState: {} as IModelTQF3 &
    IModelCourse & {
      topic?: string;
      ploRequired?: string[];
      coursePLO?: Partial<IModelPLO>;
    },
  reducers: {
    resetDataTQF3: () => {
      return {} as any;
    },
    setDataTQF3: (state, action) => {
      return { coursePLO: { ...state.coursePLO }, ...action.payload };
    },
    setPloTQF3: (state, action) => {
      return { ...state, coursePLO: action.payload };
    },
    setSelectTqf3Topic: (state, action) => {
      return { ...state, topic: action.payload };
    },
    updatePartTQF3: (state, action) => {
      return { ...state, [action.payload.part]: { ...action.payload.data } };
    },
  },
});

export const {
  resetDataTQF3,
  setDataTQF3,
  setPloTQF3,
  setSelectTqf3Topic,
  updatePartTQF3,
} = tqf3Slice.actions;

export default tqf3Slice.reducer;
