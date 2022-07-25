import { useReducer } from "react";

export type ACTION_TYPE =
  | { type: "poi"; payload: null }
  | { type: "userTop"; payload: null };

export const useLayersVisibility = () => {
  const initState = {
    poiGridLayerVisibility: true,
    userTopColumnLayerVisibility: false,
  };

  const reducer = (state: typeof initState, action: ACTION_TYPE) => {
    switch (action.type) {
      case "poi":
        return {
          ...state,
          poiGridLayerVisibility: !state.poiGridLayerVisibility,
        };
      case "userTop":
        return {
          ...state,
          userTopColumnLayerVisibility: !state.userTopColumnLayerVisibility,
        };
      default:
        return { ...state };
    }
  };

  const [state, dispatch] = useReducer(reducer, initState);

  return [state, dispatch] as const;
};
