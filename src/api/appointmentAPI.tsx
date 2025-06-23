//src/api/appointmentAPI.tsx
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

// Hàm helper để xác định trạng thái booking
export function getBookingStatus(booking: Booking): string {
  if (booking.examination?.status === "Completed") {
    return "Đã khám";
  } else if (booking.payment?.status === "Paid") {
    return "Đã thanh toán";
  } else if (booking.payment?.status === "Pending") {
    return "Chờ thanh toán";
  } else if (booking.dateBooking && new Date(booking.dateBooking) < new Date()) {
    return "Đã quá hạn";
  } else {
    return "Đã đặt lịch";
  }
}

// Interface mở rộng với trạng thái tính toán
export interface BookingWithStatus extends Booking {
  status: string; // Trạng thái tính toán
}

// Hàm chuyển đổi từ Booking sang BookingWithStatus
export function addStatusToBooking(booking: Booking): BookingWithStatus {
  return {
    ...booking,
    status: getBookingStatus(booking)
  };
}

// API để lấy chi tiết booking theo ID
export const appointmentApi = {
  getBookingById: async (bookingId: string): Promise<Booking> => {
    try {
      const response = await bookingAxios.get(`api/Booking/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết booking:", error);
      throw error;
    }
  }
};
