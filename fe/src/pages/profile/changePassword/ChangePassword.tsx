import { Form, Input, Button, Card, Typography, message } from "antd";
import { resetPassword } from "../../../services/auth.service";
import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ChangePassword.module.scss";

const cx = classNames.bind(styles);
const { Title } = Typography;

export default function ChangePassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    const { oldPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      return message.error("Mật khẩu xác nhận không khớp!");
    }

    setLoading(true);
    const hide = message.loading("Đang cập nhật mật khẩu...", 0);

    try {
      await resetPassword(oldPassword, newPassword);
      message.success("Đổi mật khẩu thành công!");
      form.resetFields();
    } catch (error: any) {
      console.error("Get profile error:", error.response || error);
      message.error(error.response?.data?.message || "Đổi mật khẩu thất bại!");
    } finally {
      hide();
      setLoading(false);
    }
  };

  return (
    <div className={cx("container")}>
      <Card className={cx("card")}>
        <Title level={3}>Đổi mật khẩu</Title>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu cũ" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu mới" }]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
