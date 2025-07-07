import { useEffect, useState } from "react";
import { Button, message } from "antd";
import { getAcceptList, acceptFriend, refuseFriend } from "../../../services/users.service";
import UserCardList from "../components/UserCardList/UserCardList";

export default function Requests() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const hide = message.loading("Đang tải thông tin người dùng...", 0);
    try {
      const res = await getAcceptList();
      setUsers(res.data.result);
      hide();
    } catch (error: any) {
      console.error("Fetch user failed:", error.response || error);
      message.error("Không tìm thấy người dùng!");
      hide();
    }
  };

  const onAccept = async (id: string) => {
    const hide = message.loading("Đang tải thông tin người dùng...", 0);
    try {
      await acceptFriend(id);
      fetch();
      hide();
    } catch (error: any) {
      console.error("Fetch user failed:", error.response || error);
      message.error("Không tìm thấy người dùng!");
      hide();
    }
  };

  const onRefuse = async (id: string) => {
    const hide = message.loading("Đang tải thông tin người dùng...", 0);
    try {
      await refuseFriend(id);
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
        <Button key="accept" type="primary" onClick={() => onAccept(user._id)}>
          Xác nhận
        </Button>,
        <Button key="refuse" danger onClick={() => onRefuse(user._id)}>
          Từ chối
        </Button>,
      ]}
    />
  );
}
