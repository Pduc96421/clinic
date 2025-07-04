import { api } from '../utils/request.util';

export const loginUser = (data: { username: string; password: string }) => {
  return api.post('/api/v1/users/auth/login', data);
};

export const registerUser = (data: {
  username: string;
  fullName: string;
  email: string;
  dob: string;
  sex: string;
  password: string;
  role: string;
}) => {
  return api.post('/api/v1/users/auth/register', data);
};

// Gửi OTP xác thực tài khoản
export const sendConfirmAccount = (email: string) => {
  return api.post('/api/v1/users/sent-confirm-account', { email });
};

// Xác thực tài khoản với OTP
export const confirmAccount = (email: string, otpConfirm: string) => {
  return api.post('/api/v1/users/confirm-account', { email, otpConfirm });
};

// Lấy thông tin user theo ID (admin hoặc dùng trong trang khác)
export const getUserInfo = (userId: string) => {
  return api.get(`/api/v1/users/info/${userId}`);
};

// Lấy thông tin user hiện tại (profile)
export const getMyProfile = () => {
  return api.get('/api/v1/users/my-profile');
};

// Cập nhật user (admin hoặc chính chủ)
export const updateUser = (userId: string, data: any) => {
  return api.patch(`/api/v1/users/update/${userId}`, data);
};

// Gửi OTP để lấy lại mật khẩu
export const forgotPassword = (email: string) => {
  return api.post('/api/v1/users/password/forgot', { email });
};

// Xác thực OTP để reset password
export const verifyOtpForPassword = (email: string, otp: string) => {
  return api.post('/api/v1/users/password/otp', { email, otp });
};

// Đổi mật khẩu
export const resetPassword = (oldPassword: string, newPassword: string) => {
  return api.post('/api/v1/users/password/reset', { oldPassword, newPassword });
};
