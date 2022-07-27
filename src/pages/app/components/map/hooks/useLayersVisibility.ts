import { MANTISSA } from "@/pages/app/constants";
import { DeckProps } from "@deck.gl/core/typed";
import numbro from "numbro";
import _ from "lodash";
import { useReducer } from "react";
import { updatePoiProportion } from "../lib/updatePoiProportion";
import { TOOLTIP_STYLE } from "../constants";

// Action 类型
export type ACTION_TYPE =
  | { type: "poi"; payload: null }
  | { type: "userTop"; payload: null };

export interface INIT_STATE {
  [key: string]: {
    visible?: boolean;
    getTooltip?: DeckProps["getTooltip"];
    getCursor?: DeckProps["getCursor"];
  };
}

export const useLayersVisibility = () => {
  const initState: INIT_STATE = {
    poiGridLayer: {
      visible: true,
      getTooltip: (info) => {
        if (!info.picked) return null;
        // console.log("src/pages/app/components/map/index.tsx", info);
        const data = updatePoiProportion(info);
        return {
          style: TOOLTIP_STYLE,
          html: `<div><div>POI数量：${
            info?.object?.points?.length
          }</div>${Object.entries(data).reduce((prev, cur) => {
            return prev + `<div>${cur[1].type}：${cur[1].value}</div>`;
          }, "")}</div>`,
        };
      },
      getCursor: (({ isHovering }) =>
        isHovering ? "pointer" : "default") as DeckProps["getCursor"],
    },
    userTopColumnLayer: {
      visible: false,
      getTooltip: (info) => {
        if (!info.picked) return null;
        // console.log("src/pages/app/components/map/index.tsx", info);
        return {
          style: TOOLTIP_STYLE,
          html: `<div><div>用户编号: ${
            info.object?.id
          }</div><div>经度: ${numbro(info.object?.coordinates[0]).format({
            mantissa: MANTISSA,
          })}</div><div>纬度: ${numbro(info.object?.coordinates[1]).format({
            mantissa: MANTISSA,
          })}</div><div>出行次数: ${info.object?.count}</div></div>`,
        };
      },
      getCursor: undefined,
    },
  };

  const reducer = (state: typeof initState, action: ACTION_TYPE) => {
    let newState = null;
    switch (action.type) {
      case "poi":
        newState = _.cloneDeep(state);
        newState.poiGridLayer.visible = !newState.poiGridLayer.visible;
        return newState;
      case "userTop":
        newState = _.cloneDeep(state);
        newState.userTopColumnLayer.visible =
          !newState.userTopColumnLayer.visible;
        return newState;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initState);

  // 是否唯一图层可视
  const isOwn =
    Object.values(state).filter((item) => item.visible).length === 1;

  return {
    state,
    dispatch,
    isOwn,
  };
};
