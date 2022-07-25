import { Color, FlyToInterpolator } from "@deck.gl/core/typed";

// 地图配置项
export const INITIAL_VIEW_STATE = {
  longitude: 114.17,
  latitude: 22.65,
  zoom: 9,
  pitch: 60,
  bearing: 50,
  transitionDuration: 500,
  transitionInterpolator: new FlyToInterpolator(),
};

export const POI_COLOR_RANGE: Color[] = [
  [166, 206, 227],
  [31, 120, 180],
  [178, 223, 138],
  [51, 160, 44],
  [251, 154, 153],
  [227, 26, 28],
  [253, 191, 111],
  [255, 127, 0],
  [202, 178, 214],
  [106, 61, 154],
  [255, 255, 153],
  [177, 89, 40],
];

// mapbox 密钥
export const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiMjAxNzMwMjU5MDE1NyIsImEiOiJja3FqM3RjYmIxcjdyMnhsbmR0bHo2ZGVpIn0.wNBmzyxhzCMx9PhIH3rwCA";
