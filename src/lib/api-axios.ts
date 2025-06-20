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
export interface Role {
  roleId: string | null;
  roleName: string;
}

export interface User {
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

export interface LoginResponse {
  user: User;
  token: string;
}

// Interface cho response đăng ký
export interface RegisterResponse {
  user: User;
  token: string;
}

// Interface cho dữ liệu đăng ký đơn giản - phù hợp với API mới
export interface SimpleRegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phone: string;
}

// Interface cho dữ liệu đăng ký đầy đủ (nếu cần)
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phone: string | null;
  address?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  roleId?: string;
  bloodType?: string | null;
  emergencyPhoneNumber?: string | null;
  specialization?: string | null;
}

export const authApi = {
  //gọi hàm login từ backend
    login: async (username: string, password: string): Promise<LoginResponse> => {
        const response = await axiosInstance.post<LoginResponse>("/Auth/login", {
        username,
        password
        });
        return response.data;
  },

  // ✅ Hàm logout
  logout: async () => {
    // Gọi API logout
    return await axiosInstance.post("/Auth/logout");
  },

  // ✅ Hàm kiểm tra token
  checkAuth: async (): Promise<boolean> => {
    try {
      const response = await axiosInstance.get("/Auth/validate");//xác thực token
      return response.status === 200;
    } catch {
      return false;
    }
  },
};

// goi hàm register từ backend
export const registerApi = {
  // Phương thức đăng ký đầy đủ
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
      console.log("API call to /Auth/register with data:", data);
      const response = await axiosInstance.post<RegisterResponse>("/Auth/register", data);
      console.log("API register response:", response);
      return response.data;
    } catch (error) {
      console.error("Register API error:", error);
      throw error;
    }
  },
  
  // Phương thức đăng ký đơn giản
  registerSimple: async (data: SimpleRegisterRequest): Promise<RegisterResponse> => {
    try {
      console.log("API call to /Auth/register-simple with data:", data);
      const response = await axiosInstance.post<RegisterResponse>("/Auth/register-simple", data);
      console.log("API registerSimple response:", response);
      return response.data;
    } catch (error) {
      console.error("RegisterSimple API error:", error);
      throw error;
    }
  }
};
