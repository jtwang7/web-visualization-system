import { Scatter, ScatterConfig } from "@ant-design/plots";
import { AntdScatterProps } from "./types";

export default function AntdScatter(props: AntdScatterProps) {
  const { data, configOptions } = props;

  const config: ScatterConfig = {
    appendPadding: 10,
    data,
    xField: "xField",
    yField: "yField",
    shape: "circle",
    colorField: "value",
    size: 4,
    yAxis: {
      nice: true,
      line: {
        style: {
          stroke: "#aaa",
        },
      },
    },
    xAxis: {
      min: -100,
      grid: {
        line: {
          style: {
            stroke: "#eee",
          },
        },
      },
      line: {
        style: {
          stroke: "#aaa",
        },
      },
    },
  };

  return <Scatter {...config} />;
}
