import { Modal, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { getRoomChatByRoomId, updateRoomChat } from "../../../../services/room-chat.service";

interface Props {
  roomId: string;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export default function UpdateRoomTitle({ roomId, open, onClose, onUpdated }: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchRoom = async () => {
      try {
        const res = await getRoomChatByRoomId(roomId);
        form.setFieldsValue({ title: res.data.result.title });
      } catch {
        message.error("Không thể lấy thông tin phòng");
      }
    };
    fetchRoom();
  }, [open, roomId]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await updateRoomChat(roomId, { title: values.title });
      message.success("Đã cập nhật tên phòng");
      onClose();
      onUpdated?.();
    } catch {
      message.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Cập nhật tên phòng"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={loading}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Tên phòng"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tên phòng" }]}
        >
          <Input placeholder="Nhập tên phòng mới" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
