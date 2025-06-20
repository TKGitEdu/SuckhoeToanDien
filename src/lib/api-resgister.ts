//src/lib/api-register.ts
//sử dụng mô hình axios để gọi API
import { axiosInstance } from "./api-axios"; // Import the configured axios instance

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string; // ISO string format
  bloodType?: string;
  emergencyPhoneNumber?: string;
}

export interface RegisterResponse {
  user: {
    userId: string;
    username: string;
    fullName: string;
    email: string;
    phone: string;
    roleId: string;
    address: string;
    gender: string;
    dateOfBirth: string | null;
    role: {
      roleId: string;
      roleName: string;
    };
  };
  token: string;
}

/**
 * Đăng ký tài khoản bệnh nhân mới
 * @param data Thông tin đăng ký
 * @returns Thông tin người dùng và token sau khi đăng ký thành công
 */
export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  try {
    // Log dữ liệu gửi đi để debug
    console.log("Sending registration data:", data);
    
    // Gọi API đăng ký
    const response = await axiosInstance.post<RegisterResponse>("/Auth/register", data);
    
    // Log phản hồi để debug
    console.log("Registration response:", response.data);
    
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};
