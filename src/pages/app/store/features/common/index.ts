import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { limitMemberCounts } from "./lib/limitMemberCounts";
import { POI, POIForPie } from "./types";

export interface CommonState {
  pois: POI[];
  poisForPie: POIForPie[][];
}
const initialState: CommonState = {
  pois: [],
  // cell 单元格各类 POI 占比环状图基础数据
  poisForPie: [],
};

// 异步请求
export const fetchPOI = createAsyncThunk("common/fetchPOI", async () => {
  const { data } = await axios.get(
    `${process.env.PUBLIC_URL}/mock/shenzhen-poi.json`
  );
  const result = data.map((item: any) => {
    const { typeId, location, ...subItem } = item;
    return {
      ...subItem,
      count: 1,
      typeId: +typeId,
      location: location
        ?.split(",")
        .map((item: string) => +parseFloat(item).toFixed(4)),
    };
  });
  // console.log("@/pages/app/store/features/common/", data);
  // console.log("@/pages/app/store/features/common/", result);
  return result;
});

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    singleSelectPoisForPie: (state, action: PayloadAction<POIForPie[]>) => {
      limitMemberCounts(state.poisForPie, action.payload, 1);
    },
    doubleSelectPoisForPie: (state, action: PayloadAction<POIForPie[]>) => {
      limitMemberCounts(state.poisForPie, action.payload, 2);
    },
    clearPoisForPie: (state) => {
      state.poisForPie.length = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchPOI.fulfilled,
      (state, action: PayloadAction<POI[]>) => {
        state.pois = action.payload;
      }
    );
  },
});

export const {
  singleSelectPoisForPie,
  doubleSelectPoisForPie,
  clearPoisForPie,
} = commonSlice.actions;

export default commonSlice.reducer;
