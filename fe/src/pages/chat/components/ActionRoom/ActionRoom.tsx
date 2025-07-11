import { Dropdown, Button, MenuProps, message, Modal } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { getRoomChatByRoomId, leaveRoomChat, updateRoomChat } from "../../../../services/room-chat.service";
import UpdateRoomTitle from "../UpdateTitle/UpdateTitle";

interface ActionRoomProps {
  roomId: string;
  reloadRooms?: () => void;
}

function ActionRoom({ roomId, reloadRooms }: ActionRoomProps) {
  const [roomDetail, setRoomDetail] = useState<any>(null);
  const [openTitle, setOpenTitle] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await getRoomChatByRoomId(roomId);
        setRoomDetail(res.data.result);
      } catch (error: any) {
        console.error(error);
        message.error(error.response?.data?.message || "Lỗi lấy thông tin phòng");
      }
    };
    fetchApi();
  }, [roomId]);

  const handleLeaveRoom = () => {
    Modal.confirm({
      title: "Xác nhận rời phòng?",
      content: "Bạn sẽ không thể nhận tin nhắn từ phòng này nữa.",
      okText: "Rời phòng",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await leaveRoomChat(roomId);
          message.success("Đã rời phòng");
          reloadRooms?.();
        } catch (err: any) {
          message.error("Rời phòng thất bại");
        }
      },
    });
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    console.log(formData);

    const hide = message.loading("Đang cập nhật ảnh phòng...", 0);
    try {
      await updateRoomChat(roomId, { formData });
      hide();
      message.success("Cập nhật ảnh phòng thành công");
      reloadRooms?.();
    } catch (error: any) {
      hide();
      console.error("Lỗi update avatar:", error);
      message.error("Cập nhật ảnh thất bại");
    }
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const items: MenuProps["items"] = [];

  if (roomDetail?.typeRoom === "group") {
    items.push(
      {
        key: "leave",
        label: "Rời phòng",
        onClick: handleLeaveRoom,
      },
      {
        key: "title",
        label: "Đổi tên phòng",
        onClick: () => setOpenTitle(true),
      },
      {
        key: "avatar",
        label: "Đổi ảnh",
        onClick: () => fileInputRef.current?.click(),
      },
    );
  }

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Button
          type="text"
          shape="circle"
          icon={<MoreOutlined style={{ fontSize: "1.2rem" }} />}
          onClick={(e) => e.stopPropagation()}
        />
      </Dropdown>

      <UpdateRoomTitle roomId={roomId} open={openTitle} onClose={() => setOpenTitle(false)} onUpdated={reloadRooms} />

      {/* Input file ẩn để upload ảnh */}
      <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={handleChangeFile} />
    </>
  );
}

export default ActionRoom;
