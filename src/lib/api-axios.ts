// src/lib/api-axios.ts
import axios from "axios";

// axios instance với proxy
const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*"
  }
});

// ✅ Gắn token tự động vào header nếu có
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interface theo backend trả về
interface Role {
  roleId: string | null;
  roleName: string;
}

interface User {
  userId: string;
  fullName: string;
  email: string;
  phone: string | null;
  username: string;
  roleId: string;
  address: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  role: Role;
  doctor: any | null;
  patients: any[];
}

interface LoginResponse {
  user: User;
  token: string;
}

// ✅ Hàm login
export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>("/Auth/login", {
      username,
      password
    });
    return response.data;
  }
};
