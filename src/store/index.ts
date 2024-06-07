import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import { useDispatch, useSelector } from "react-redux";
import academicYearReducer from "./academicYear";

const store = configureStore({
  reducer: {
    user: userReducer,
    academicYear: academicYearReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
