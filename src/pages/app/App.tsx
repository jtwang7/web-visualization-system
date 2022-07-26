import { Layout, Menu, MenuProps, Row, Col, Spin, Card, Checkbox } from "antd";
import {
  EnvironmentOutlined,
  BulbOutlined,
  CarOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import styles from "./styles/index.module.scss";
import Map from "./components/map";
import PoiPie from "./components/map/components/poi-pie";
import { useBoolean } from "ahooks";
import { useSelectLogic } from "./hooks/useSelectLogic";
import { useMemo } from "react";
import { DOUBLE_SELECT } from "./constants";
import { useAppSelector } from "./store/hooks";

const { Header, Content, Sider, Footer } = Layout;

export default function App() {
  // 菜单项
  const items: MenuProps["items"] = [
    {
      label: "Select",
      key: "select",
      title: "select",
      disabled: false,
      icon: <EnvironmentOutlined style={{ color: "#ffd04b" }} />,
    },
    {
      label: "Analysis",
      key: "analysis",
      title: "analysis",
      disabled: true,
      icon: <BulbOutlined style={{ color: "#ffd04b" }} />,
    },
    {
      label: "Predict",
      key: "predict",
      title: "predict",
      disabled: true,
      icon: <CarOutlined style={{ color: "#ffd04b" }} />,
    },
  ];

  const pieData = useAppSelector((state) => state.common.poisForPie);

  // 双选逻辑 (支持 Shift 快捷键)
  const { options, checkedValue, onCheckboxValueChange } = useSelectLogic();
  const isDoubleSelected = useMemo(
    () => checkedValue.includes(DOUBLE_SELECT),
    [checkedValue]
  );

  // 管理 WebGL 加载
  const [state, { setTrue }] = useBoolean(false);

  return (
    <Layout className={styles.appLayout}>
      <Header>
        <Menu
          items={items}
          mode="horizontal"
          theme="light"
          defaultSelectedKeys={["select"]}
        />
      </Header>
      <Layout>
        <Layout>
          <Content style={{ position: "relative" }}>
            <Spin
              spinning={!state}
              delay={500}
              indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />}
            >
              <Map setTrue={setTrue} isDoubleSelected={isDoubleSelected} />
            </Spin>
          </Content>
          <Footer style={{ zIndex: 1, padding: 10 }}>
            <Card bodyStyle={{ padding: 10 }}>
              <Row>
                <Col span={3}>
                  <Checkbox.Group
                    options={options}
                    value={checkedValue}
                    onChange={onCheckboxValueChange}
                  />
                </Col>
              </Row>
            </Card>
          </Footer>
        </Layout>
        <Sider width={400} theme={"light"} style={{ padding: "10px" }}>
          <Row>
            {pieData.map((data) => (
              <Col span={24}>
                <PoiPie data={data} />
              </Col>
            ))}
            <Col span={24}>
              <Outlet />
            </Col>
          </Row>
        </Sider>
      </Layout>
    </Layout>
  );
}
