import { api } from "../utils/request.util";

// Lấy danh sách người dùng không phải bạn bè
export const getNotFriend = () => {
  return api.get("/api/v1/users/not-friend");
};

// Lấy danh sách người dùng đã gửi lời mời kết bạn cho mình
export const getAcceptList = () => {
  return api.get("/api/v1/users/accept");
};

// Lấy danh sách người dùng mà mình đã gửi lời mời kết bạn
export const getRequestList = () => {
  return api.get("/api/v1/users/request");
};

// Lấy danh sách bạn bè
export const getFriends = () => {
  return api.get("/api/v1/users/friends");
};

// Gửi lời mời kết bạn
export const addFriend = (userId: string) => {
  return api.post(`/api/v1/users/add-friend/${userId}`);
};

// Huỷ lời mời kết bạn đã gửi
export const cancelFriend = (userId: string) => {
  return api.post(`/api/v1/users/cancel-friend/${userId}`);
};

// Từ chối lời mời kết bạn đã nhận
export const refuseFriend = (userId: string) => {
  return api.post(`/api/v1/users/refuse-friend/${userId}`);
};

// Đồng ý lời mời kết bạn
export const acceptFriend = (userId: string) => {
  return api.post(`/api/v1/users/accept-friend/${userId}`);
};

// Xoá bạn
export const deleteFriend = (userId: string) => {
  return api.delete(`/api/v1/users/delete-friend/${userId}`);
};
