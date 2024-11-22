import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import configReducer from "./config";
import loadingReducer from "./loading";
import errorResponseReducer from "./errorResponse";
import userReducer from "./user";
import academicYearReducer from "./academicYear";
import courseReducer from "./course";
import courseManagementReducer from "./courseManagement";
import tqf3Reducer from "./tqf3";
import allCourseReducer from "./allCourse";
import facultyReducer from "./department";

const store = configureStore({
  reducer: {
    config: configReducer,
    loading: loadingReducer,
    errorResponse: errorResponseReducer,
    user: userReducer,
    faculty: facultyReducer,
    academicYear: academicYearReducer,
    allCourse: allCourseReducer,
    course: courseReducer,
    courseManagement: courseManagementReducer,
    tqf3: tqf3Reducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
