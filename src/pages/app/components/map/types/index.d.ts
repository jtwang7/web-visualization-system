import { TooltipContent } from "@deck.gl/core/typed/lib/tooltip";
import { PickingInfo } from "@deck.gl/core/typed";
import React from "react";

export interface MapProps {
  setTrue?: () => void;
  style?: React.CSSProperties;
  isDoubleSelected?: boolean;
}

export type BaseColumnLayerDataType = {
  [key: string]: any;
  count: number;
  coordinates: [number, number];
};

export type GetTooltip = (info: PickingInfo) => TooltipContent;

export interface PoiArcDataItem {
  from: {
    name: string;
    location: [number, number];
  };
  to: {
    name: string;
    location: [number, number];
  };
}
export type PoiArcDataType = PoiArcDataItem[];
