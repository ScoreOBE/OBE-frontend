import { IModelCourse } from "@/models/ModelCourse";
import { createSlice } from "@reduxjs/toolkit";

export const breadcrumbsSlice = createSlice({
  name: "breadcrumbs",
  initialState: [] as Partial<
    [
      {
        title: string;
        path: string;
      }
    ]
  >,
  reducers: {
    addPath: (state, action) => {
      state.push(action.payload);
      return state;
    },
    
  },
});

export const { addPath } = breadcrumbsSlice.actions;

export default breadcrumbsSlice.reducer;
