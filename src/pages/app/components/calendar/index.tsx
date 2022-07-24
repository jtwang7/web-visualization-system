import { Heatmap, HeatmapConfig } from "@ant-design/plots";
import { CalendarProps } from "./types";

export default function Calendar(props: CalendarProps) {
  const { data } = props;

  const config: HeatmapConfig = {
    data,
    autoFit: true,
    xField: "week", // x轴对应映射的字段
    yField: "day", // y轴对应映射的字段
    colorField: "value", // 色块颜色对应映射的字段
    reflect: "y", // 坐标轴映射
    shape: "rect", // 热力图格子形状
    meta: {
      day: {
        type: "cat",
        values: [
          "星期日",
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六",
        ],
      },
      week: {
        type: "cat",
      },
      commits: {
        sync: true,
      },
      date: {
        type: "cat",
      },
    },
    yAxis: {
      grid: null,
    },
    tooltip: {
      title: "date",
      showMarkers: false,
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
    xAxis: {
      position: "top",
      tickLine: null,
      line: null,
      label: {
        offset: 12,
        style: {
          fontSize: 12,
          fill: "#666",
          textBaseline: "top",
        },
        formatter: (val) => {
          if (val === "2") {
            return "MAY";
          } else if (val === "6") {
            return "JUN";
          } else if (val === "10") {
            return "JUL";
          } else if (val === "15") {
            return "AUG";
          } else if (val === "19") {
            return "SEP";
          } else if (val === "24") {
            return "OCT";
          }

          return "";
        },
      },
    },
  };

  return <Heatmap {...config} />;
}
