import _ from "lodash";
// deck.gl
import { Map as StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";
import { LightingEffect } from "@deck.gl/core/typed";
import { ColumnLayer, ArcLayer } from "@deck.gl/layers/typed";
import { CPUGridLayer } from "@deck.gl/aggregation-layers/typed";
// common functions
import { getFillColor } from "./lib/getFillColor";
import { getUniqueByKey } from "@/lib/getUniqueByKey";
import { updatePoiProportion } from "./lib/updatePoiProportion";
// types
import { BaseColumnLayerDataType, MapProps, PoiArcDataType } from "./types";
import { POI_COLOR_RANGE } from "./constants";
// constants
import { INITIAL_VIEW_STATE, MAPBOX_ACCESS_TOKEN } from "./constants";
// redux
import { useAppDispatch, useAppSelector } from "@/pages/app/store/hooks";
import { fetchUserTop } from "@/pages/app/store/features/select";
import {
  fetchPOI,
  singleSelectPoisForPie,
  doubleSelectPoisForPie,
  clearPoisForPie,
} from "@/pages/app/store/features/common";
import { POI, POIForPie } from "@/pages/app/store/features/common/types";
// hooks
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useMount } from "ahooks";
import { UserTopData } from "@/pages/app/store/features/select/types";
import { useLayersVisibility } from "./hooks/useLayersVisibility";
import { useView } from "./hooks/useView";

export default function TMap(props: MapProps) {
  const { setTrue = () => {}, isDoubleSelected = false } = props;

  const dispatch = useAppDispatch();

  useMount(() => {
    dispatch(fetchUserTop());
    dispatch(fetchPOI());
  });

  // 视角操作逻辑
  const { prevViewState, flyToFocusPoint } = useView(INITIAL_VIEW_STATE);

  // 管理图层可视
  const {
    state: layerManagement,
    isOwn,
    dispatch: layerManagementDispatch,
  } = useLayersVisibility();

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
  // POI 图层
  const poiGridLayer = new CPUGridLayer<POI>({
    id: "poi",
    visible: layerManagement.poiGridLayer.visible,
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
    onClick: (info) => {
      // console.log("src/pages/app/components/map/", info);
      const data = updatePoiProportion(info);
      if (!isDoubleSelected) {
        dispatch(singleSelectPoisForPie(Object.values(data)));
        flyToFocusPoint(info?.object?.position);
      } else {
        dispatch(doubleSelectPoisForPie(Object.values(data)));
      }
    },
  });

  /** 双选 POI 连线 */
  const poisForPie = useAppSelector<POIForPie[][]>(
    (state) => state.common.poisForPie
  );
  const [poiArcData, setPoiArcData] = useState<PoiArcDataType>([]);
  useEffect(() => {
    if (poisForPie.length % 2 === 0) {
      const res: PoiArcDataType = [];
      for (let i = 0; i < poisForPie.length; i += 2) {
        const from = {
          name: "起点",
          location: poisForPie?.[i]?.[0]?.cellCenter!,
        };
        const to = {
          name: "终点",
          location: poisForPie?.[i + 1]?.[0]?.cellCenter!,
        };
        res.push({
          from,
          to,
        });
      }
      setPoiArcData(res);
    }
  }, [poisForPie]);
  const poiArcLayer = new ArcLayer({
    id: "poi-arc",
    data: poiArcData,
    pickable: true,
    getWidth: 3,
    greatCircle: true,
    getSourcePosition: (d) => d.from.location,
    getTargetPosition: (d) => d.to.location,
    getSourceColor: [255, 241, 240],
    getTargetColor: [255, 77, 79],
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
    visible: layerManagement.userTopColumnLayer.visible,
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

  useLayoutEffect(() => {
    dispatch(clearPoisForPie());
  }, [isDoubleSelected]);

  const registerLayers = [poiGridLayer, userTopColumnLayer, poiArcLayer];
  const lightingEffect = new LightingEffect();
  const getTooltip = () => {
    if (!isOwn) return undefined;
    const target = Object.values(layerManagement).find(
      (object) => object.visible
    );
    return target?.getTooltip;
  };
  const getCursor = () => {
    if (!isOwn) return undefined;
    const target = Object.values(layerManagement).find(
      (object) => object.visible
    );
    return target?.getCursor;
  };

  return (
    <DeckGL
      initialViewState={prevViewState}
      controller={true}
      effects={[lightingEffect]}
      layers={registerLayers}
      getCursor={getCursor()}
      getTooltip={getTooltip()}
    >
      <StaticMap
        onRender={() => {
          setTrue();
        }}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle={"mapbox://styles/2017302590157/cksbi52rm50pk17npkgfxiwni"}
      />
    </DeckGL>
  );
}
