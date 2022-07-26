import { Pie, PieConfig } from "@ant-design/plots";
import { Card } from "antd";
import { PoiPieProps } from "./types";

export default function PoiPie(props: PoiPieProps) {
  const { data } = props;

  const config: PieConfig = {
    height: 150,
    autoFit: true,
    padding: "auto",
    appendPadding: 16,
    data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.64,
    label: {
      type: "outer",
      offset: 12,
      labelHeight: 24,
      content: "{percentage}",
      layout: [
        {
          type: "fixed-overlap",
        },
      ],
    },
    legend: {
      position: "right",
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: false,
    },
    state: {
      active: {
        style: {
          lineWidth: 2,
          stroke: "#ffd591",
        },
      },
    },
    // theme: {
    //   colors10: POI_COLOR_RANGE,
    // },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.type,
          value: datum.value,
        };
      },
    },
  };
  return (
    <Card>
      <Pie {...config} />
    </Card>
  );
}
