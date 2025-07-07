import { Input, List, Avatar, Typography } from "antd";
import styles from "../../styles/chat.module.scss";
import classNames from "classnames/bind";

const { Title } = Typography;
const cx = classNames.bind(styles);

const dummyConversations = [
  { id: 1, name: "Hà Nguyễn", lastMessage: "Tối đi ăn nhé?", avatar: "https://i.pravatar.cc/300" },
  { id: 2, name: "Tuấn Trần", lastMessage: "Oke anh!", avatar: "https://i.pravatar.cc/301" },
];

export default function ChatList() {
  return (
    <div className={cx("chat-list")}>
      <Title>Tin nhắn</Title>
      <Input.Search placeholder="Tìm kiếm" className={cx("search")} />
      <List
        itemLayout="horizontal"
        dataSource={dummyConversations}
        renderItem={(item) => (
          <List.Item className={cx("chat-item")}>
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={<span>{item.name}</span>}
              description={<span>{item.lastMessage}</span>}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
