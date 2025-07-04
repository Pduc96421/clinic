import { Layout } from "antd";
import ChatList from "../components/ChatList/ChatList";
import ChatWindow from "../components/ChatWindow/ChatWindow";
import styles from "../styles/chat.module.scss";
import classNames from "classnames/bind";

const { Sider, Content } = Layout;
const cx = classNames.bind(styles);

export default function ChatLayout() {
  return (
    <Layout className={cx("messenger")}>

      <Sider width={300} className={cx("sider")}>
        <ChatList />
      </Sider>

      <Content className={cx("content")}>
        <ChatWindow />
      </Content>
      
    </Layout>
  );
}
