import { configureStore } from "@reduxjs/toolkit";
import selectSlice from "./features/select";
import commonSlice from "./features/common";

const reducer = {
  common: commonSlice,
  select: selectSlice,
};

const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
