import _ from "lodash";
import numbro from "numbro";
// deck.gl
import { Map as StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";
import { LightingEffect, LayerProps } from "@deck.gl/core/typed";
import { ColumnLayer } from "@deck.gl/layers/typed";
import { CPUGridLayer } from "@deck.gl/aggregation-layers/typed";
// common functions
import { getFillColor } from "./lib/getFillColor";
import { getUniqueByKey } from "@/lib/getUniqueByKey";
// types
import { BaseColumnLayerDataType, MapProps, GetTooltip } from "./types";
import { POI_COLOR_RANGE } from "./constants";
// constants
import { INITIAL_VIEW_STATE, MAPBOX_ACCESS_TOKEN } from "./constants";
import { MANTISSA } from "../../constants";
// redux
import { useAppDispatch, useAppSelector } from "@/pages/app/store/hooks";
import { fetchUserTop } from "@/pages/app/store/features/select";
import { fetchPOI, updatePoisForPie } from "@/pages/app/store/features/common";
import { POI, POIForPie } from "@/pages/app/store/features/common/types";
// hooks
import { useMemo, useState } from "react";
import { useMount } from "ahooks";
import { UserTopData } from "@/pages/app/store/features/select/types";
import { useLayersVisibility } from "./hooks/useLayersVisibility";

export default function TMap(props: MapProps) {
  const dispatch = useAppDispatch();

  useMount(() => {
    dispatch(fetchUserTop());
    dispatch(fetchPOI());
  });

  // 上一(初始)帧
  const [prevViewState, setViewState] = useState(INITIAL_VIEW_STATE);
  // 视角切换过渡效果
  const flyToFocusPoint = (location: [number, number]) => {
    setViewState((state) => ({
      ...state,
      longitude: location[0],
      latitude: location[1],
      zoom: INITIAL_VIEW_STATE.zoom + 3,
    }));
  };

  // 管理图层可视
  const [layersVisibility, layersVisibilityDispatch] = useLayersVisibility();

  /** POI */
  // POI 数据
  const pois = useAppSelector<POI[]>((state) => state.common.pois);
  // 获取 POI 类别编号
  const poiTypes = useMemo(
    () =>
      getUniqueByKey(pois, function (poi) {
        return poi?.typeId;
      }),
    [pois]
  );
  // 筛选 cell 单元格内占比最大的 type 类别，并返回该类别对应映射的 color 权重
  const getColorValueByPoiGridLayer: any = (array: any) => {
    const map = _.countBy(array, (item) => item.typeId);
    const idx = Object.values(map).findIndex(
      (item, idx, arr) => item === Math.max(...arr)
    );
    const value = poiTypes.findIndex((type) => {
      return +Object.keys(map)[idx] === type;
    });
    return value;
  };
  // 基于 cell 单元格内聚合的 POI 点数返回对应的 bar height 权重
  const getElevationValueByPoiGridLayer: any = (array: any) => array.length;
  // 点击 cell 单元更新 POI 环状占比图数据
  const updateDataByClick: LayerProps<POI>["onClick"] = (info) => {
    const originData = info?.object?.points as Array<any>;
    const data = originData.reduce((prev, { source }) => {
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
    }, {} as { [key: string]: POIForPie });
    dispatch(updatePoisForPie(Object.values(data)));
  };
  // POI 图层
  const poiGridLayer = new CPUGridLayer<POI>({
    id: "poi",
    visible: layersVisibility.poiGridLayerVisibility,
    colorRange: POI_COLOR_RANGE,
    data: pois,
    pickable: true,
    extruded: true,
    cellSize: 400,
    elevationScale: 4,
    getPosition: (d) => d.location!,
    getColorValue: getColorValueByPoiGridLayer,
    getElevationValue: getElevationValueByPoiGridLayer,
    onHover: (info) => {
      // console.log("src/pages/app/components/map/", info);
    },
    onClick: (info, event) => {
      // console.log("src/pages/app/components/map/", info);
      updateDataByClick(info, event);
      flyToFocusPoint(info?.object?.position);
    },
  });

  /** 用户前 5 个高频出行统计特征分布图 */
  const baseUserTopData = useAppSelector<UserTopData>(
    (state) => state.select.userTopData
  );
  const handleUserTopData = () => {
    return _.flatMap(baseUserTopData, ({ id, data }) => {
      return data.map(({ lnglat, count }) => ({
        id,
        count,
        coordinates: lnglat,
      }));
    });
  };
  const userTopColumnLayer = new ColumnLayer<BaseColumnLayerDataType>({
    id: "user-top",
    visible: layersVisibility.userTopColumnLayerVisibility,
    data: handleUserTopData(),
    diskResolution: 12,
    radius: 250,
    extruded: true,
    pickable: true,
    elevationScale: 10, // 柱状图高度比例
    getPosition: (d) => d.coordinates,
    getFillColor: (d) => getFillColor(d.count) as any,
    getElevation: (d) => d.count, // 柱状图高度
  });
  const getColumnLayerTooltip: GetTooltip = (info) => {
    if (!info.picked) return null;
    // console.log("src/pages/app/components/map/index.tsx", info);
    return {
      style: { background: "#ffffff", borderRadius: "5px" },
      html: `<div><div>用户编号: ${info.object?.id}</div><div>经度: ${numbro(
        info.object?.coordinates[0]
      ).format({
        mantissa: MANTISSA,
      })}</div><div>纬度: ${numbro(info.object?.coordinates[1]).format({
        mantissa: MANTISSA,
      })}</div><div>出行次数: ${info.object?.count}</div></div>`,
    };
  };

  const registerLayers = [poiGridLayer, userTopColumnLayer];
  const lightingEffect = new LightingEffect();

  return (
    <DeckGL
      initialViewState={prevViewState}
      controller={true}
      effects={[lightingEffect]}
      layers={registerLayers}
      getCursor={({ isHovering }) => (isHovering ? "pointer" : "default")}
      // getTooltip={getColumnLayerTooltip}
    >
      <StaticMap
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle={"mapbox://styles/2017302590157/cksbi52rm50pk17npkgfxiwni"}
      />
    </DeckGL>
  );
}
