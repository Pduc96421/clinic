import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Avatar, Typography, message } from "antd";
import { getUserInfo } from "../../../services/auth.service";
import styles from "./UserProfile.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
const { Title, Text } = Typography;

export default function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const hide = message.loading("Đang tải thông tin người dùng...", 0);
      try {
        const res = await getUserInfo(userId as string);
        setUser(res.data.result);
        hide();
      } catch (error: any) {
        console.error("Fetch user failed:", error.response || error);
        message.error("Không tìm thấy người dùng!");
        hide();
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (!user) return <div className={cx("not-found")}>Người dùng không tồn tại</div>;

  return (
    <div className={cx("profile-container")}>
      <Card className={cx("card")}>
        <div className={cx("header")}>
          <Avatar src={user.avatar || "/images/avatar-default.png"} size={100} />
          <div className={cx("info")}>
            <Title level={3}>{user.fullName}</Title>
            <Text type="secondary">@{user.username}</Text>
          </div>
        </div>

        <div className={cx("details")}>
          <Text>
            <b>Email:</b> {user.email}
          </Text>
          <br />
          <Text>
            <b>Giới tính:</b> {user.sex === "male" ? "Nam" : "Nữ"}
          </Text>
          <br />
          <Text>
            <b>Ngày sinh:</b> {new Date(user.dob).toLocaleDateString("vi-VN")}
          </Text>
          <br />
          <Text>
            <b>Trạng thái:</b> {user.status === "active" ? "Hoạt động" : "Bị khóa"}
          </Text>
          <br />
          <Text>
            <b>Vai trò:</b> {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
          </Text>
          <br />
          <Text>
            <b>Tài khoản:</b> {user.isConfirmed ? "✔️ Đã xác thực" : "❌ Chưa xác thực"}
          </Text>
          <br />
          <Text>
            <b>Tham gia:</b> {new Date(user.createdAt).toLocaleString("vi-VN")}
          </Text>
        </div>
      </Card>
    </div>
  );
}
