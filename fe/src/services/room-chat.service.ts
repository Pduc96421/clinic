import { api } from "../utils/request.util";

// Tạo phòng chat
export const createRoomChat = (data: { title: string; usersId: string[] }) => {
  return api.post("/api/v1/room-chat/create", data);
};

// Lấy danh sách phòng chat mà người dùng đang tham gia
export const listRoomChat = () => {
  return api.get("/api/v1/room-chat/list-room");
};

// Lấy thông tin phòng chat theo ID
export const getRoomChatByRoomId = (roomId: string) => {
  return api.get(`/api/v1/room-chat/info/${roomId}`);
};

// Cập nhật thông tin phòng chat (title, v.v.)
export const updateRoomChat = (roomId: string, data: any) => {
  return api.patch(`/api/v1/room-chat/update/${roomId}`, data);
};

// Thêm người dùng vào phòng chat
export const addUserInRoomChat = (roomId: string, usersId: string[]) => {
  return api.post(`/api/v1/room-chat/add-user/${roomId}`, { usersId });
};

// Xóa người dùng khỏi phòng chat
export const removeUserInRoomChat = (roomId: string, userId: string) => {
  return api.delete(`/api/v1/room-chat/${roomId}/users/${userId}`);
};

// Rời khỏi phòng chat
export const leaveRoomChat = (roomId: string) => {
  return api.delete(`/api/v1/room-chat/${roomId}/leave`);
};

// Chuyển quyền superAdmin cho user khác
export const changeSuperAdmin = (roomId: string, userId: string) => {
  return api.patch(`/api/v1/room-chat/${roomId}/change-super-admin/${userId}`);
};

// Thay đổi vai trò của thành viên trong phòng
export const changeRoleRoom = (roomId: string, target_user_id: string, new_role: "admin" | "user") => {
  return api.patch(`/api/v1/room-chat/${roomId}/change-role-room`, {
    target_user_id,
    new_role,
  });
};
