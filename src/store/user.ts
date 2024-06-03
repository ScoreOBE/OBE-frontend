import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    value: {},
  },
  reducers: {
    setUser: (state: any, data: any) => {
      state.value = data.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
