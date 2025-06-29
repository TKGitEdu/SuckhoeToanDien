import axios from "axios";
import type { Booking, Doctor, Patient, Slot, Service, Examination, Payment } from "../bookingAPI";

// Định nghĩa lại các interface cần thiết (nếu muốn mở rộng hoặc dùng riêng cho dashboard)
export interface DashboardDoctor {
  doctorId: string;
  userId: string;
  doctorName: string;
  specialization: string;
  phone: string;
  email: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  user?: {
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    username: string;
    gender: string;
  };
  bookings?: DashboardBooking[];
}

export interface DashboardBooking {
  bookingId: string;
  dateBooking: string;
  description: string;
  note: string;
}

// Có thể import Booking từ bookingAPI nếu muốn dùng đầy đủ thông tin booking

const dashboardAxios = axios.create({
  baseURL: "https://localhost:7147",
  headers: {
    "Content-Type": "application/json",
  },
});

dashboardAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Lấy danh sách booking của bác sĩ theo userId
export const getDoctorBookingsbyUserId = async (userId: string): Promise<Booking[]> => {
  try {
    const response = await dashboardAxios.get(`/api/DoctorDashBoard/mybookings`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách booking cho userId ${userId}:`, error);
    throw error;
  }
};

// Lấy thông tin doctor theo userId (trả về mảng, lấy phần tử đầu tiên nếu có)
export const getDoctorByUserId = async (userId: string): Promise<DashboardDoctor | null> => {
  try {
    const response = await dashboardAxios.get(`/api/Doctor`, {
      params: { userId }
    });
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin doctor cho userId ${userId}:`, error);
    return null;
  }
};