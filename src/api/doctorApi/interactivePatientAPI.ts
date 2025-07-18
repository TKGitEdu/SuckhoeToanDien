import axios from 'axios';

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

export interface MedicalRecord {
  patientDetailId: string;
  patientId: string;
  patientName: string;
  treatmentStatus: string;
  medicalHistory: string;
  name: string;
}

export interface PatientMedicalHistory {
  patientId: string;
  patientName: string;
  medicalRecords: MedicalRecord[];
}

const dashboardAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
 * Lấy tiền sử bệnh của bệnh nhân theo patientId
 * @param patientId ID của bệnh nhân cần lấy tiền sử bệnh
 * @returns Thông tin tiền sử bệnh của bệnh nhân
 */
export const getPatientMedicalHistory = async (patientId: string): Promise<PatientMedicalHistory> => {
  try {
    const response = await dashboardAxios.get(`/api/DoctorPatients/patient/${patientId}/tienSuBenh`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy tiền sử bệnh của bệnh nhân với ID ${patientId}:`, error);
    throw error;
  }
};

/**
 * Lấy tất cả examinations theo patientId
 * @param patientId ID của bệnh nhân cần lấy examinations
 * @returns Danh sách examinations của bệnh nhân
 */
export const getExaminationsByPatientId = async (patientId: string): Promise<Examination[]> => {
  try {
    const response = await dashboardAxios.get(`/api/InteractivePatient/examinations/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách examinations của bệnh nhân với ID ${patientId}:`, error);
    throw error;
  }
};

/**
 * Kiểm tra xem booking đã có examination chưa
 * @param bookingId ID của booking cần kiểm tra
 * @returns True nếu đã có examination, false nếu chưa
 */
export const checkExaminationExists = async (bookingId: string): Promise<boolean> => {
  try {
    const response = await dashboardAxios.get(`/api/InteractivePatient/examination/booking/${bookingId}`);
    return response.data && response.data.length > 0;
  } catch (error: any) {
    // Nếu lỗi 404 có nghĩa là chưa có examination
    if (error.response?.status === 404) {
      return false;
    }
    console.error(`Lỗi khi kiểm tra examination cho booking ${bookingId}:`, error);
    throw error;
  }
};