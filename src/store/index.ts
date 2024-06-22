import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import userReducer from "./user";
import academicYearReducer from "./academicYear";
import courseReducer from "./course";
import loadingReducer from "./loading";

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    user: userReducer,
    academicYear: academicYearReducer,
    course: courseReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
