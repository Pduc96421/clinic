import { useState } from "react";
import { Form, Input, Button, Radio, DatePicker, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import dayjs from "dayjs";
import styles from "./Register.module.scss";
import { registerUser, sendConfirmAccount } from "../../../services/auth.service";

const cx = classNames.bind(styles);
const { Title } = Typography;

export default function Register() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    const { confirmPassword, dob, ...rest } = values;

    if (values.password !== confirmPassword) {
      return message.error("Mật khẩu xác nhận không khớp");
    }

    const payload = {
      ...rest,
      dob: dayjs(dob).format("YYYY-MM-DD"),
    };

    try {
      setLoading(true);
      await registerUser(payload);
      await sendConfirmAccount(payload.email);
      message.success("Đăng ký thành công, vui lòng xác thực email!");
      navigate(`/auth/verify-account?email=${payload.email}`);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("register-container")}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{
          sex: "Male",
          role: "user",
        }}
      >
        <Title level={3} className={cx("title")}>
          Tạo tài khoản
        </Title>

        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[
            { required: true, message: "Hãy nhập tên đăng nhập" },
            { min: 4, message: "Phải có ít nhất 4 kí tự" },
          ]}
        >
          <Input placeholder="Tên đăng nhập" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Hãy nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: "Hãy nhập họ và tên" }]}>
          <Input placeholder="Họ và tên" />
        </Form.Item>

        <Form.Item label="Giới tính" name="sex" rules={[{ required: true, message: "Hãy chọn giới tính" }]}>
          <Radio.Group>
            <Radio value="male">Nam</Radio>
            <Radio value="female">Nữ</Radio>
            <Radio value="other">Khác</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Ngày sinh" name="dob" rules={[{ required: true, message: "Hãy chọn ngày sinh" }]}>
          <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
        </Form.Item>

        <Form.Item label="Vai trò" name="role" rules={[{ required: true, message: "Hãy chọn vai trò" }]}>
          <Radio.Group>
            <Radio value="patient">Bệnh nhân</Radio>
            <Radio value="doctor">Bác sĩ</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Hãy nhập mật khẩu" },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: "Phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số",
            },
            { min: 6, message: "Phải có ít nhất 6 kí tự" },
          ]}
        >
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          rules={[{ required: true, message: "Hãy xác nhận mật khẩu" }]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đăng ký
          </Button>
        </Form.Item>

        <Form.Item>
          <Link to="/auth/login" className={cx("link-login")}>
            Đã có tài khoản?
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
}
