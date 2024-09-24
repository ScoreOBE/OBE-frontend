import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import showSidebarReducer from "./showSidebar";
import loadingReducer from "./loading";
import errorResponseReducer from "./errorResponse";
import userReducer from "./user";
import academicYearReducer from "./academicYear";
import courseReducer from "./course";
import courseManagementReducer from "./courseManagement";
import showNavbarReducer from "./showNavbar";
import tqf3Reducer from "./tqf3";

const store = configureStore({
  reducer: {
    showNavbar: showNavbarReducer,
    showSidebar: showSidebarReducer,
    loading: loadingReducer,
    errorResponse: errorResponseReducer,
    user: userReducer,
    academicYear: academicYearReducer,
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
