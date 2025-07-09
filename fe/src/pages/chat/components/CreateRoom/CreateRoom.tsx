import { useEffect, useState } from "react";
import { Button, Input, Select, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./CreateRoom.module.scss";
import classNames from "classnames/bind";
import { createRoomChat } from "../../../../services/room-chat.service";
import { getFriends } from "../../../../services/users.service";

const cx = classNames.bind(styles);
const { Title } = Typography;
const { Option } = Select;

export default function CreateRoomPage() {
  const [title, setTitle] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getFriends();
      setUsers(res.data.result);
    } catch (err) {
      message.error("Không thể lấy danh sách người dùng");
    }
  };

  const handleCreate = async () => {
    if (!title.trim() || selectedUserIds.length === 0) {
      message.warning("Vui lòng nhập tiêu đề và chọn người tham gia");
      return;
    }

    setLoading(true);
    try {
      const res = await createRoomChat({ title: title.trim(), usersId: selectedUserIds });
      message.success("Tạo phòng thành công!");
      navigate(`/chat/${res.data.result._id}`);
    } catch (err) {
      message.error("Tạo phòng thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("wrapper")}>
      <Title level={3}>Tạo phòng chat mới</Title>

      <div className={cx("form-group")}>
        <label>Tiêu đề</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề phòng..."
        />
      </div>

      <div className={cx("form-group")}>
        <label>Chọn người tham gia</label>
        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="Chọn người..."
          optionLabelProp="label"
          onChange={(value) => setSelectedUserIds(value)}
        >
          {users.map((user) => (
            <Option
              key={user._id}
              value={user._id}
              label={`${user.fullName} (${user.username})`}
            >
              {user.fullName} ({user.username})
            </Option>
          ))}
        </Select>
      </div>

      <Button
        type="primary"
        onClick={handleCreate}
        loading={loading}
        className={cx("create-button")}
      >
        Tạo phòng
      </Button>
    </div>
  );
}
