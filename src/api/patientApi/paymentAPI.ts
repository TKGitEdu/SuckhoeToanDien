import axios  from "axios";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const paymentAxios = axios.create({
    baseURL: VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Thêm interceptor để gắn token vào request
paymentAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export interface payload {
  amount: number; // Số tiền thanh toán
  description?: string; // Mô tả đơn hàng
//   callback_url?: string; // URL callback sau khi thanh toán
  appUser: string; // userId hoặc email hoặc username
  embedData?: string; // luôn hardcode embed_data
}
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
export interface Slot {
    slotId: string;
    slotName: string;
    startTime: string; // "15:00"
    endTime: string; // "16:00"
}
export interface Service {
    serviceId: string;
    name: string;
    description: string;
    price: number;
    status: string;
    category: string; 
}
export interface Payment {
    payment: string;
    paymentId: string;
    totalAmount: number;
    status: string;
    method: string;
}
export interface Booking {
    bookingId: string;
    patientId: string;
    serviceId: string;
    doctorId: string;
    description: string;
    doctor: Doctor;
    patient: Patient;
    service: Service;
    payment: Payment;
    slot: Slot;
}

// Tạo đơn hàng ZaloPay
export const bookingService = {
    createZaloPayOrder: async (payload: payload) => {
        // Hardcode embed_data
        const fullPayload = {
          ...payload,
          embedData: '{"redirecturl":"http://localhost:5173/patient/payment-callback"}'
        };
        const res = await paymentAxios.post('/api/ZaloPay/create-order', fullPayload);
        return res.data;
    },
    getBookingDetails: async (bookingid: string): Promise<Booking> => {
        const res = await paymentAxios.get(`/api/Booking/details/${bookingid}`);
        return res.data;
    },

    // Tạo payment trong database
    CreatePayment: async (paymentData: {
      bookingId: string;
      totalAmount: number;
      status: string;
      method: string;
      confirmed: boolean;
    }) => {
      const res = await paymentAxios.post('/api/Payment', paymentData);
      return res.data;
    },

    // Cập nhật payment trong database
    updatePayment: async (paymentId: string, paymentData: {
      paymentId: string;
      bookingId: string;
      totalAmount: number;
      status: string;
      method: string;
      confirmed: boolean;
    }) => {
      const res = await paymentAxios.put(`/api/Payment/${paymentId}`, paymentData);
      return res.data;
    },
}

