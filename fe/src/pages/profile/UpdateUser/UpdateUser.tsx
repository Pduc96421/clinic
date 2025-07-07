import { Form, Input, Button, Select, DatePicker, message, Typography, Card } from "antd";
import { useEffect, useState } from "react";
import { getMyProfile, updateUser } from "../../../services/auth.service";
import dayjs from "dayjs";
import classNames from "classnames/bind";
import styles from "./UpdateUser.module.scss";

const { Title } = Typography;
const { Option } = Select;
const cx = classNames.bind(styles);

export default function UpdateUser() {
  const [form] = Form.useForm();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getMyProfile();
      const data = res.data.result;
      setUserData(data);
      form.setFieldsValue({
        fullName: data.fullName,
        sex: data.sex,
        dob: dayjs(data.dob),
        avatar: data.avatar,
      });
    } catch (error: any) {
      message.error("Không thể lấy dữ liệu người dùng.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values: any) => {
    const hide = message.loading("Đang cập nhật...", 0);
    try {
      setLoading(true);
      const payload = {
        ...values,
        dob: values.dob?.format("YYYY-MM-DD"),
      };
      await updateUser(userData._id, payload);
      hide();
      message.success("Cập nhật thành công!");
    } catch (error: any) {
      hide();
      console.log("Update Avatar error: ", error.message);
      message.error("Cập nhật thất bại!");
    } finally {
      hide();
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cx("container")}>
      <Card className={cx("card")}>
        <Title level={3}>Chỉnh sửa thông tin cá nhân</Title>

        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
            <Input placeholder="Họ và tên" />
          </Form.Item>

          <Form.Item label="Giới tính" name="sex" rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}>
            <Select placeholder="Chọn giới tính">
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Ngày sinh" name="dob" rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
