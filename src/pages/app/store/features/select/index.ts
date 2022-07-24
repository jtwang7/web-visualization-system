import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { UserTopData } from "./types";

export const NAME = "select";

export interface SelectState {
  userTopData: UserTopData;
}
const initialState: SelectState = {
  userTopData: [],
};

// 异步逻辑
export const fetchUserTop = createAsyncThunk(
  `${NAME}/fetchUserTop`,
  async () => {
    const { data } = await axios.get(
      `${process.env.PUBLIC_URL}/mock/userTop5.json`
    );
    return data.data;
  }
);

export const selectSlice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserTop.fulfilled, (state, action) => {
      state.userTopData = action.payload;
      console.log("src/pages/app/store/features/select", action.payload);
    });
  },
});

export const {} = selectSlice.actions;

export default selectSlice.reducer;
