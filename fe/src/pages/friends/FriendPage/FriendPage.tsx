import { Layout, Menu } from "antd";
import { UserAddOutlined, TeamOutlined, SendOutlined, HeartOutlined } from "@ant-design/icons";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./FriendPage.module.scss";

const cx = classNames.bind(styles);
const { Sider, Content } = Layout;

const items = [
  { key: "/friends", icon: <TeamOutlined />, label: "Danh sách bạn bè" },
  { key: "/friends/requests", icon: <UserAddOutlined />, label: "Lời mời kết bạn" },
  { key: "/friends/suggestions", icon: <HeartOutlined />, label: "Gợi ý kết bạn" },
  { key: "/friends/sent", icon: <SendOutlined />, label: "Lời mời đã gửi" },
];

export default function FriendsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout className={cx("container")}>
      <Sider width={250} className={cx("sider")}>
        <Menu mode="inline" selectedKeys={[location.pathname]} onClick={({ key }) => navigate(key)} items={items} />
      </Sider>
      <Content className={cx("content")}>
        <Outlet />
      </Content>
    </Layout>
  );
}
