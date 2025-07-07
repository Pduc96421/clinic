import { api } from "../utils/request.util";

// Gửi tin nhắn văn bản
export const sendMessage = (data: { room_chat_id: string; content: string; reply_chat_id?: string }) => {
  return api.post("/api/v1/chats/send", data);
};

// Gửi tin nhắn có file đính kèm
export const sendFileMessage = (data: { room_chat_id: string; file_url: string; reply_chat_id?: string }) => {
  return api.post("/api/v1/chats/send-file", data);
};

// Lấy danh sách tin nhắn trong phòng
export const getMessages = (roomId: string) => {
  return api.get(`/api/v1/chats/${roomId}`);
};

// Cập nhật nội dung tin nhắn
export const updateMessage = (chatId: string, content: string) => {
  return api.patch(`/api/v1/chats/update/${chatId}`, { content });
};

// Thêm hoặc cập nhật reaction cho tin nhắn
export const reactMessage = (chatId: string, icon: string) => {
  return api.patch(`/api/v1/chats/${chatId}/react`, { icon });
};

// Lấy thống kê các reaction cho tin nhắn
export const getReactions = (chatId: string) => {
  return api.get(`/api/v1/chats/${chatId}/reactions`);
};

// Xoá 1 tin nhắn
export const deleteMessage = (chatId: string) => {
  return api.delete(`/api/v1/chats/${chatId}`);
};

// Xoá nhiều tin nhắn
export const deleteMultipleMessages = (chatIds: string[]) => {
  return api.delete(`/api/v1/chats/delete-multiple`, { data: { chatIds } });
};
