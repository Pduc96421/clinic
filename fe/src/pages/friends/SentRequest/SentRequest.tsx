import { useEffect, useState } from "react";
import { Button, message } from "antd";
import { getRequestList, cancelFriend } from "../../../services/users.service";
import UserCardList from "../components/UserCardList/UserCardList";

export default function SentRequests() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const hide = message.loading("Đang tải thông tin người dùng...", 0);
    try {
      const res = await getRequestList();
      setUsers(res.data.result);
      hide();
    } catch (error: any) {
      console.error("Fetch user failed:", error.response || error);
      message.error("Không tìm thấy người dùng!");
      hide();
    }
  };

  const onCancel = async (id: string) => {
    const hide = message.loading("Đang tải thông tin người dùng...", 0);
    try {
      await cancelFriend(id);
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
        <Button key="cancel" danger onClick={() => onCancel(user._id)}>
          Hủy lời mời
        </Button>,
      ]}
    />
  );
}
