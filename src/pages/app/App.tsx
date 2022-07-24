import { Layout, Menu, MenuProps } from "antd";
import {
  EnvironmentOutlined,
  BulbOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import styles from "./styles/index.module.scss";
import Map from "./components/map";

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
            <Map />
          </Content>
          <Footer style={{zIndex: 1}} ></Footer>
        </Layout>
        <Sider width={400} theme={"light"}>
          <Outlet />
        </Sider>
      </Layout>
    </Layout>
  );
}
