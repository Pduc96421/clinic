// src/components/AvatarUpload/AvatarUpload.tsx
import { Avatar, Upload, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { RcFile } from "antd/es/upload";
import classNames from "classnames/bind";
import styles from "./Avatar.module.scss";
import { getMyProfile, updateUser } from "../../../services/auth.service";

const cx = classNames.bind(styles);

interface AvatarUploadProps {
  userData: any;
  onUploadSuccess?: (newAvatar: string) => void;
}

export default function AvatarUpload({ userData, onUploadSuccess }: AvatarUploadProps) {
  const handleUpload = async (file: RcFile) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const hide = message.loading("Đang cập nhật...", 0);
    try {
      const res = await updateUser(userData._id, { formData });
      hide();

      const updatedRes = await getMyProfile();
      const updatedUser = updatedRes.data.result;
      localStorage.setItem("userData", JSON.stringify(updatedUser));

      message.success("Cập nhật ảnh thành công");
      onUploadSuccess?.(res.data.result.avatar);
    } catch (error: any) {
      hide();
      console.log("Update Avatar error: ", error.message);
      message.error("Cập nhật ảnh thất bại");
    } finally {
      hide();
    }
  };

  return (
    <Upload
      showUploadList={false}
      beforeUpload={(file) => {
        handleUpload(file);
        return false;
      }}
    >
      <Avatar
        size={100}
        icon={<UserOutlined />}
        src={userData.avatar || "/images/avatar-default.png"}
        className={cx("avatar")}
      />
    </Upload>
  );
}
