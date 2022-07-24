import { configureStore } from "@reduxjs/toolkit";
import selectSlice from "./features/select";

const reducer = {
  select: selectSlice,
};

const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
