import axios from 'axios';
import { getCookie } from '../helpers/cookie';

// Tạo một instance axios với cấu hình mặc định
const request = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

request.interceptors.request.use(
  (config) => {
    const token = getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);


const get = async (path: string, params = {}) => {
  try {
    const response = await request.get(path, { params });
    return response;
  } catch (error) {
    throw error;
  }
};

const post = async (path: string, data = {}, config = {}) => {
  try {
    return await request.post(path, data, config);
  } catch (error) {
    throw error;
  }
};

const put = async (path: string, data = {}, config = {}) => {
  try {
    return await request.put(path, data, config);
  } catch (error) {
    throw error;
  }
};

const patch = async (path: string, data = {}, config = {}) => {
  try {
    return await request.patch(path, data, config);
  } catch (error) {
    throw error;
  }
};

const del = async (path: string, config = {}) => {
  try {
    return await request.delete(path, config);
  } catch (error) {
    throw error;
  }
};

export const api = {
  get,
  post,
  put,
  patch,
  delete: del,
};

