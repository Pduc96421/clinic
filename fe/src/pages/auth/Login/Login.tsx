import { useState } from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../../services/auth.service";
import { setCookie } from "../../../helpers/cookie";

import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { decodeToken } from "../../../utils/auth.util";
import { checkLogin } from "../../../store/actions/login";
import { useDispatch } from "react-redux";

const { Title } = Typography;
const cx = classNames.bind(styles);

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    const hide = message.loading("Đang đăng nhập...", 0);
    try {
      const res = await loginUser(values);
      const token = res.data.result;
      setCookie("token", token);

      const userData = decodeToken(token);
      dispatch(checkLogin(true, userData));

      hide();
      message.success("Đăng nhập thành công!");
      navigate("/");
    } catch (err: any) {
      hide();
      console.error("Login error:", err.response || err);
      message.error(err.response?.data?.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("login-container")}>
      <Form layout="vertical" onFinish={onFinish}>
        <Title level={3} className={cx("title")}>
          Đăng nhập
        </Title>

        <Form.Item
          label="Tên đăng nhập hoặc Email"
          name="username"
          rules={[
            { required: true, message: "Hãy nhập tên đăng nhập" },
            { min: 4, message: "Tên đăng nhập phải có ít nhất 4 kí tự" },
          ]}
        >
          <Input placeholder="Tên đăng nhập hoặc Email..." />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Hãy nhập mật khẩu" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 kí tự" },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số",
            },
          ]}
        >
          <Input.Password placeholder="Mật khẩu..." />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đăng nhập
          </Button>
        </Form.Item>

        <Form.Item>
          <Link to="/auth/forgot-password" className={cx("link-forgot")}>
            Quên mật khẩu?
          </Link>
        </Form.Item>

        <Form.Item>
          <Button type="default" block onClick={() => navigate("/auth/register")}>
            Tạo tài khoản mới
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
