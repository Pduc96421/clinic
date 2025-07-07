import { Card, Descriptions, Typography, Button, message } from "antd";
import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import { useEffect, useState } from "react";
import { getMyProfile } from "../../../services/auth.service";
import LoadingUi from "../../../components/LoadingUi/LoadingUi";
import { useNavigate } from "react-router-dom";
import AvatarUpload from "../Avatar/Avatar";

const cx = classNames.bind(styles);
const { Title } = Typography;

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getMyProfile();
      const data = res.data.result;
      setUserData(data);
    } catch (error: any) {
      console.error("Get profile error:", error.response || error);
      message.error(error.response?.data?.message || "Không thể lấy thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <LoadingUi />;
  }

  if (!userData) {
    return <p>Không có dữ liệu người dùng.</p>;
  }

  return (
    <div className={cx("profile-container")}>
      <Card className={cx("profile-card")}>
        <div className={cx("header")}>
          <AvatarUpload
            userData={userData}
            onUploadSuccess={(newAvatar) => {
              setUserData({ ...userData, avatar: newAvatar });
            }}
          />
          <Title level={3} className={cx("username")}>
            {userData.fullName || userData.username}
          </Title>
          <span className={cx("role")}>{userData.role === "doctor" ? "Bác sĩ" : "admin"}</span>
        </div>

        <Descriptions title="Thông tin chi tiết" bordered column={1} size="middle" className={cx("info")}>
          <Descriptions.Item label="Tên đăng nhập">{userData.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
          <Descriptions.Item label="Họ và tên">{userData.fullName}</Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {userData.sex === "male" ? "Nam" : userData.sex === "female" ? "Nữ" : "Khác"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {userData.dob ? new Date(userData.dob).toLocaleDateString("vi-VN") : ""}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">{userData.role === "doctor" ? "Bác sĩ" : "admin"}</Descriptions.Item>
        </Descriptions>

        <div className={cx("actions")}>
          <Button type="primary" onClick={() => navigate("/profile/edit")}>
            Chỉnh sửa
          </Button>
        </div>
      </Card>
    </div>
  );
}
