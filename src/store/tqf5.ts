import { IModelCourse } from "@/models/ModelCourse";
import { IModelPLORequire } from "@/models/ModelCourseManagement";
import { IModelPLO } from "@/models/ModelPLO";
import { IModelTQF5 } from "@/models/ModelTQF5";
import { createSlice } from "@reduxjs/toolkit";

export type OldRecommendation = {
  curriculum: string;
  recommendAbnormalScoreFactor: string;
  recommendReviewingSLO: string;
};

export const tqf5Slice = createSlice({
  name: "tqf5",
  initialState: {} as IModelTQF5 &
    IModelCourse & {
      topic?: string;
      curriculum?: string[];
      ploRequired?: IModelPLORequire[];
      coursePLO?: Partial<IModelPLO>[];
      oldRecommendation: OldRecommendation[];
    },
  reducers: {
    resetDataTQF5: () => {
      return {} as any;
    },
    setDataTQF5: (state, action) => {
      return {
        topic: state.topic,
        curriculum: state.curriculum,
        coursePLO: state.coursePLO,
        ...action.payload,
      };
    },
    setPloTQF5: (state, action) => {
      return {
        ...state,
        curriculum: action.payload.curriculum,
        coursePLO: action.payload.coursePLO,
      };
    },
    setSelectTqf5Topic: (state, action) => {
      return { ...state, topic: action.payload };
    },
    updatePartTQF5: (state, action) => {
      return { ...state, [action.payload.part]: { ...action.payload.data } };
    },
    setAssignmentsMap: (state, action) => {
      return { ...state, assignmentsMap: [...action.payload] };
    },
  },
});

export const {
  resetDataTQF5,
  setDataTQF5,
  setPloTQF5,
  setSelectTqf5Topic,
  updatePartTQF5,
  setAssignmentsMap,
} = tqf5Slice.actions;

export default tqf5Slice.reducer;
