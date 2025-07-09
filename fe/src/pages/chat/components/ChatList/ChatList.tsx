import { useEffect, useState } from "react";
import { Input, List, Avatar, Typography, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ChatList.module.scss";
import classNames from "classnames/bind";
import { listRoomChat } from "../../../../services/room-chat.service";
import { PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;
const cx = classNames.bind(styles);

export default function ChatList() {
  const [rooms, setRooms] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await listRoomChat();
      setRooms(res.data.result || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách phòng:", err);
    }
  };

  return (
    <div className={cx("chat-list")}>
      <div className={cx("header")}>
        <Title level={4} className={cx("title")}>
          Tin nhắn
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/chat/create")}
          className={cx("add-button")}
        >
          Tạo phòng
        </Button>
      </div>

      <Input.Search placeholder="Tìm kiếm" className={cx("search")} />

      <List
        itemLayout="horizontal"
        dataSource={rooms}
        renderItem={(room) => {
          const isActive = location.pathname === `/chat/${room._id}`;
          const isMine = room.lastMessage?.user_id?._id === userData.id;
          const lastMessageText = room.lastMessage
            ? `${isMine ? "Bạn" : room.lastMessage.user_id?.fullName || "Người lạ"}: ${room.lastMessage.content}`
            : "Chưa có tin nhắn";

          return (
            <List.Item className={cx("chat-item", { active: isActive })} onClick={() => navigate(`/chat/${room._id}`)}>
              <List.Item.Meta
                avatar={<Avatar src={room?.avatar || "/images/avatar-default.png"} size="large" />}
                title={<span>{room.title}</span>}
                description={<span className={cx("last-message")}>{lastMessageText}</span>}
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
}
