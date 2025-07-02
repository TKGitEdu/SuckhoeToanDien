import axios from 'axios';
import { tr } from 'date-fns/locale';

// Định nghĩa interfaces cho dữ liệu
export interface Booking {
  bookingId: string;
  patientId: string;
  doctorId: string;
  serviceId: string;
  slotId: string;
  dateBooking: string;
  description: string;
  note: string;
  status: string;
  createAt: string;
}

export interface Patient {
  patientId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  bloodType: string;
  emergencyPhoneNumber: string;
}

export interface ExaminationRequest {
  bookingId: string;
  examinationDate: string;
  examinationDescription: string;
  result: string;
  status: string;
  note: string;
}

export interface Examination {
  examinationId: string;
  bookingId: string;
  patientId: string;
  doctorId: string;
  examinationDate: string;
  examinationDescription: string;
  result: string;
  status: string;
  note: string;
  createAt: string;
}

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

/**
 * Lấy thông tin booking theo bookingId
 * @param bookingId ID của booking cần lấy thông tin
 * @returns Thông tin chi tiết của booking
 */
export const getBookingById = async (bookingId: string): Promise<Booking> => {
  try {
    const response = await dashboardAxios.get(`/api/InteractivePatient/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin booking với ID ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Lấy thông tin bệnh nhân theo patientId
 * @param patientId ID của bệnh nhân cần lấy thông tin
 * @returns Thông tin chi tiết của bệnh nhân
 */
export const getPatientById = async (patientId: string): Promise<Patient> => {
  try {
    const response = await dashboardAxios.get(`/api/InteractivePatient/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin bệnh nhân với ID ${patientId}:`, error);
    throw error;
  }
};

/**
 * Tạo một examination mới
 * @param examinationData Dữ liệu của examination cần tạo
 * @returns Kết quả của quá trình tạo examination
 */
export const createExamination = async (examinationData: ExaminationRequest): Promise<any> => {
  try {
    const response = await dashboardAxios.post('/api/InteractivePatient/examination', examinationData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo examination:', error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái của examination thành completed
 * @param examinationId ID của examination cần cập nhật trạng thái
 * @returns Kết quả của quá trình cập nhật trạng thái
 */
export const completeExamination = async (examinationId: string): Promise<any> => {
  try {
    const response = await dashboardAxios.put(`/api/InteractivePatient/examination/${examinationId}/complete`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật trạng thái examination ${examinationId}:`, error);
    throw error;
  }
};