import { ScatterConfig } from "@ant-design/plots";

export interface ConfigOptions {
  xField: string;
  yField: string;
  colorField: string;
  shape: ScatterConfig["shape"];
}

export interface AntdScatterData {
  xField: string;
  yField: string;
  value: number;
}

export interface AntdScatterProps {
  configOptions: ConfigOptions;
  data: AntdScatterData[];
}
