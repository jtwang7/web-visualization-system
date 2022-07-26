import { clearPoisForPie } from "@/pages/app/store/features/common";
import { useAppDispatch } from "@/pages/app/store/hooks";
import { useEffect, useState } from "react";
import { INITIAL_VIEW_STATE } from "../constants";

/**
 * 地图视角操作逻辑
 */
export const useView = (initViewState = INITIAL_VIEW_STATE) => {
  const dispatch = useAppDispatch();
  // 上一(初始)帧
  const [prevViewState, setViewState] = useState(initViewState);
  // 视角切换过渡效果
  const flyToFocusPoint = (location: [number, number]) => {
    setViewState((state) => ({
      ...state,
      longitude: location[0],
      latitude: location[1],
      zoom: initViewState.zoom + 3,
    }));
  };

  // "ESC"回退操作 - 初始化视角 & 清空数据
  useEffect(() => {
    const backToInitView = (ev: KeyboardEvent): any => {
      if (ev.key === "Escape" || ev.key === "Esc") {
        setViewState(initViewState);
        dispatch(clearPoisForPie());
      }
    };
    window.addEventListener("keyup", backToInitView);
    return () => {
      window.removeEventListener("keyup", backToInitView);
    };
  }, []);

  return {
    prevViewState,
    setViewState,
    flyToFocusPoint,
  };
};
