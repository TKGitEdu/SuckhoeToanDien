// src/api/bookingAPI.tsx
import axios from 'axios';

// Tạo instance axios với cấu hình xác thực
const bookingAxios = axios.create({
  baseURL: 'https://localhost:7147',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Thêm interceptor để gắn token vào request
bookingAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Định nghĩa kiểu dữ liệu cho Booking
export interface Doctor {
  doctorId: string;
  userId: string;
  doctorName: string;
  specialization: string;
  phone: string;
  email: string;
}

export interface Patient {
  patientId: string;
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
}

export interface Payment {
  paymentId: string;
  totalAmount: number;
  status: string;
  method: string;
}

export interface Service {
  serviceId: string;
  name: string;
  description: string;
  price: number;
  status: string;
  category: string;
}

export interface Slot {
  slotId: string;
  slotName: string;
  startTime: string;
  endTime: string;
}

export interface Examination {
  examinationId: string;
  examinationDate: string;
  examinationDescription: string;
  result: string;
  status: string;
}

export interface Booking {
  bookingId: string;
  patientId: string;
  serviceId: string;
  paymentId: string;
  doctorId: string;
  slotId: string;  dateBooking: string;
  description: string;
  note: string;
  createAt: string;
  doctor?: Doctor;
  patient?: Patient;
  payment?: Payment;
  service?: Service;
  slot?: Slot;
  examination?: Examination;
}

// trong file này chỉ cần gọi get myBookings để lấy danh sách booking của người dùng hiện tại
// Định nghĩa kiểu dữ liệu cho phản hồi khi tạo booking
// Export bookingApi object với các phương thức
export const bookingApi = {  // GET: api/Booking/mybookings
  getMyBookings: async (): Promise<Booking[]> => {
    try {
      const response = await bookingAxios.get("api/Booking/mybookings");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách booking:", error);
      throw error;
    }
  }
};
