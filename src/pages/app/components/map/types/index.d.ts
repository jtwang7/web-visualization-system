import { TooltipContent } from "@deck.gl/core/typed/lib/tooltip";
import { PickingInfo } from "@deck.gl/core/typed";

export interface MapProps {}

export type BaseColumnLayerDataType = {
  [key: string]: any;
  count: number;
  coordinates: [number, number];
};

export type GetTooltip = (info: PickingInfo) => TooltipContent;
