import { POIForPie } from "@/pages/app/store/features/common/types";
import { PickingInfo } from "@deck.gl/core/typed";

export interface PoiProportionType {
  [key: string]: POIForPie;
}

export const updatePoiProportion = (info: PickingInfo) => {
  const originData = info?.object?.points as Array<any>;
  const data = originData.reduce<PoiProportionType>((prev, { source }) => {
    const { typeId, type } = source;
    if (!Reflect.has(prev, typeId)) {
      Reflect.set(prev, typeId, {
        typeId,
        type,
        value: 1,
      });
    } else {
      Reflect.set(prev[typeId], "value", prev[typeId].value + 1);
    }
    return prev;
  }, {});
  return data;
};
