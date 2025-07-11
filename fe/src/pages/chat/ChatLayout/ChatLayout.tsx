import { Layout } from "antd";
import ChatList from "../ChatList/ChatList";
import styles from "./ChatLayout.module.scss";
import classNames from "classnames/bind";
import { Outlet } from "react-router-dom";

const { Sider, Content } = Layout;
const cx = classNames.bind(styles);

export default function ChatLayout() {
  return (
    <Layout className={cx("messenger")}>
      <Sider width={350} className={cx("sider")}>
        <ChatList />
      </Sider>

      <Content className={cx("content")}>
        <Outlet />
      </Content>
    </Layout>
  );
}
