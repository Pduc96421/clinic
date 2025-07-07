import { useEffect, useState } from "react";
import { Button, message } from "antd";
import { getNotFriend, addFriend } from "../../../services/users.service";
import UserCardList from "../components/UserCardList/UserCardList";

export default function Suggestions() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const hide = message.loading("Đang tải thông tin người dùng...", 0);
    try {
      const res = await getNotFriend();
      setUsers(res.data.result);
      hide();
    } catch (error: any) {
      console.error("Fetch user failed:", error.response || error);
      message.error("Không tìm thấy người dùng!");
      hide();
    }
  };

  const onAdd = async (id: string) => {
    const hide = message.loading("Đang tải thông tin người dùng...", 0);
    try {
      await addFriend(id);
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
        <Button key="add" type="primary" onClick={() => onAdd(user._id)}>
          Thêm bạn bè
        </Button>,
      ]}
    />
  );
}
