import _ from "lodash";
import numbro from "numbro";
import { Map as StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";
import { ColumnLayer } from "@deck.gl/layers/typed";
// common functions
import { getFillColor } from "./lib/getFillColor";
// types
import { BaseColumnLayerDataType, MapProps, GetTooltip } from "./types";
// constants
import { INITIAL_VIEW_STATE, MAPBOX_ACCESS_TOKEN } from "./constants";
import { MANTISSA } from "../../constants";
// redux
import { useAppDispatch, useAppSelector } from "@/pages/app/store/hooks";
import { fetchUserTop } from "@/pages/app/store/features/select";
// ahooks
import { useMount } from "ahooks";
import { UserTopData } from "@/pages/app/store/features/select/types";

export default function Map(props: MapProps) {
  const dispatch = useAppDispatch();

  useMount(() => {
    dispatch(fetchUserTop());
  });

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

  const layers = [userTopColumnLayer];

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
      getTooltip={getColumnLayerTooltip}
    >
      <StaticMap
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle={"mapbox://styles/2017302590157/cksbi52rm50pk17npkgfxiwni"}
      />
    </DeckGL>
  );
}
