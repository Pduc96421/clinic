import { useEffect, useState } from "react";
import { Button, message } from "antd";
import { getFriends, deleteFriend } from "../../../services/users.service";
import UserCardList from "../components/UserCardList/UserCardList";

export default function FriendList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const hide = message.loading("Đang tải thông tin người dùng...", 0);
    try {
      const res = await getFriends();
      setUsers(res.data.result);
      hide();
    } catch (error: any) {
      console.error("Fetch user failed:", error.response || error);
      message.error("Không tìm thấy người dùng!");
      hide();
    }
  };

  const onDelete = async (id: string) => {
    const hide = message.loading("Đang tải thông tin người dùng...", 0);
    try {
      await deleteFriend(id);
      fetch();
      hide();
    } catch (error: any) {
      console.error("Fetch user failed:", error.response || error);
      message.error("Không tìm thấy người dùng!");
      hide();
    }
  };

  return (
    <UserCardList
      users={users}
      actions={(user) => [
        <Button key="delete" danger onClick={() => onDelete(user._id)}>
          Xóa bạn
        </Button>,
      ]}
    />
  );
}
