import { IModelCourse } from "@/models/ModelCourse";
import { IModelPLORequire } from "@/models/ModelCourseManagement";
import { IModelPLO } from "@/models/ModelPLO";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { createSlice } from "@reduxjs/toolkit";

export const tqf3Slice = createSlice({
  name: "tqf3",
  initialState: { courseSyllabus: false } as IModelTQF3 &
    IModelCourse & {
      topic?: string;
      curriculum?: string[];
      ploRequired?: IModelPLORequire[];
      coursePLO?: Partial<IModelPLO>[];
      courseSyllabus: boolean;
    },
  reducers: {
    resetDataTQF3: () => {
      return { courseSyllabus: false } as any;
    },
    setDataTQF3: (state, action) => {
      return {
        topic: state.topic,
        curriculum: state.curriculum,
        coursePLO: state.coursePLO,
        ...action.payload,
      };
    },
    setPloTQF3: (state, action) => {
      return {
        ...state,
        curriculum: action.payload.curriculum,
        coursePLO: action.payload.coursePLO,
      };
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
