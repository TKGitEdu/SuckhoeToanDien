import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";

// Axios instance for doctor patients API
const patientsAxios: AxiosInstance = axios.create({
  baseURL: "https://localhost:7147",
  headers: {
    "Content-Type": "application/json",
    "Accept": "text/plain",
  },
});

// Add token to requests
patientsAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("No access token found. Please log in.");
    }
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Centralized error handler
const handleApiError = (error: AxiosError, message: string) => {
  console.error(message, error.response?.data || error.message);
  return error;
};

// Interfaces for patient data
export interface Patient {
  patientId: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  bloodType: string;
  emergencyPhoneNumber: string;
  patientDetails?: PatientDetail[];
  treatmentType?: string;
  treatmentStage?: string;
  lastVisit?: string;
  nextVisit?: string;
  progressPercentage?: number;
  treatmentCount?: number;
  medicalHistory?: string;
  note?: string;
}

interface PatientDetail {
  patientDetailId: string;
  patientId: string;
  treatmentStatus: string;
}

export interface TreatmentHistory {
  treatmentPlans: TreatmentPlan[];
  treatmentProcesses: TreatmentProcess[];
}

export interface TreatmentPlan {
  treatmentPlanId: string;
  doctorId: string;
  doctorName: string;
  patientDetailId: string;
  startDate: string;
  endDate: string;
  status: string;
  treatmentDescription: string;
  method: string;
}

export interface TreatmentProcess {
  treatmentProcessId: string;
  treatmentPlanId: string;
  doctorId: string;
  doctorName: string;
  processDate: string;
  result: string;
  status: string;
  treatmentPlanDescription: string;
}

export interface TestResult {
  examinationId: string;
  bookingId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  examinationDate: string;
  examinationDescription: string;
  result: string;
  status: string;
  note: string;
  serviceName: string;
}

export interface Booking {
  bookingId: string;
  patientId: string;
  serviceId: string;
  paymentId?: string;
  doctorId: string;
  slotId: string;
  dateBooking: string;
  description: string;
  note?: string;
  createAt: string;
  status: string;
  doctor?: {
    doctorId: string;
    userId: string;
    doctorName: string;
    specialization: string;
    phone: string;
    email: string;
  };
  patient?: {
    name: string;
  };
  service?: {
    serviceId: string;
    name: string;
    description: string;
    price: number;
    status: string;
    category: string;
  };
  slot?: {
    slotId: string;
    slotName: string;
    startTime: string;
    endTime: string;
  };
}

export interface NewTreatmentRecord {
  doctorId: string;
  patientId: string;
  treatmentPlanId: string;
  processDate: string;
  result: string;
  status: string;
}

export interface NewAppointment {
  patientId: string;
  userId: string;
  serviceId: string;
  slotId: string;
  dateBooking: string;
  description: string;
  note?: string;
}

/**
 * Get all patients associated with a doctor
 * @param doctorId The ID of the doctor
 * @returns Promise with an array of patient objects
 */

export const getPatientsByDoctorId = async (userId: string): Promise<Patient[]> => {
  if (!userId) throw new Error("User ID is required");
  try {
    const response = await patientsAxios.get(`/api/DoctorPatients/patients?userId=${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError, `Lỗi khi lấy danh sách bệnh nhân cho bác sĩ ${userId}`);
    return []; // Return empty array on error
  }
};

/**
 * Get detailed information about a specific patient
 * @param patientId The ID of the patient
 * @returns Promise with patient details
 */
export const getPatientDetails = async (patientId: string): Promise<Patient> => {
  if (!patientId) throw new Error("Patient ID is required");
  try {
    const response = await patientsAxios.get(`/api/DoctorPatients/patient/${patientId}`);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError, `Lỗi khi lấy thông tin chi tiết của bệnh nhân ${patientId}`);
    return {} as Patient; // Return empty patient object on error
  }
};

/**
 * Get treatment history for a specific patient
 * @param patientId The ID of the patient
 * @returns Promise with the treatment history
 */
export const getPatientTreatmentHistory = async (patientId: string): Promise<TreatmentHistory> => {
  if (!patientId) throw new Error("Patient ID is required");
  try {
    const response = await patientsAxios.get(`/api/DoctorPatients/patient/${patientId}/treatment-history`);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError, `Lỗi khi lấy lịch sử điều trị của bệnh nhân ${patientId}`);
    return { treatmentPlans: [], treatmentProcesses: [] }; // Return empty history on error
  }
};

/**
 * Get test results for a specific patient
 * @param patientId The ID of the patient
 * @returns Promise with an array of test results
 */
export const getPatientTestResults = async (patientId: string): Promise<TestResult[]> => {
  if (!patientId) throw new Error("Patient ID is required");
  try {
    const response = await patientsAxios.get(`/api/DoctorPatients/patient/${patientId}/test-results`);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError, `Lỗi khi lấy kết quả xét nghiệm của bệnh nhân ${patientId}`);
    return []; // Return empty array on error
  }
};

/**
 * Update the note for a specific patient
 * @param patientId The ID of the patient
 * @param doctorId The ID of the doctor making the update
 * @param note The new note text
 * @param bookingId The booking ID that this note is associated with
 * @returns Promise with the update result
 */
export const updatePatientNote = async (
  patientId: string,
  userId: string,
  note: string,
  bookingId: string
): Promise<any> => {
  if (!patientId || !userId || !note || !bookingId) throw new Error("Patient ID, User ID, Booking ID, and note are required");
  try {
    const data = { userId, note, bookingId };
    const response = await patientsAxios.put(`/api/DoctorPatients/patient/${patientId}/note`, data);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError, `Lỗi khi cập nhật ghi chú cho bệnh nhân ${patientId}`);
    return {}; // Return empty object on error
  }
};

/**
 * Add a new treatment record for a patient
 * @param record The treatment record data to add
 * @returns Promise with the created treatment record
 */
export const addNewTreatmentRecord = async (record: NewTreatmentRecord): Promise<TreatmentProcess> => {
  if (!record.patientId || !record.doctorId || !record.treatmentPlanId) {
    throw new Error("Patient ID, Doctor ID, and Treatment Plan ID are required");
  }
  try {
    const response = await patientsAxios.post(`/api/DoctorPatients/treatment-record`, record);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError, `Lỗi khi thêm bản ghi điều trị cho bệnh nhân ${record.patientId}`);
    return {} as TreatmentProcess; // Return empty treatment process on error
  }
};

/**
 * Get all appointments for a specific patient
 * @param patientId The ID of the patient
 * @returns Promise with an array of booking objects
 */
export const getAppointmentsByPatientId = async (patientId: string): Promise<Booking[]> => {
  if (!patientId) throw new Error("Patient ID is required");
  try {
    const response = await patientsAxios.get(`/api/DoctorPatients/patient/${patientId}/appointments`);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError, `Lỗi khi lấy lịch hẹn của bệnh nhân ${patientId}`);
    return []; // Return empty array on error
  }
};

/**
 * Create a new appointment for a patient
 * @param appointment The appointment data to create
 * @returns Promise with the created booking
 */
export const createAppointmentForPatient = async (appointment: NewAppointment): Promise<Booking> => {
  if (!appointment.patientId || !appointment.userId || !appointment.serviceId || !appointment.slotId) {
    throw new Error("Patient ID, User ID, Service ID, and Slot ID are required");
  }
  try {
    const response = await patientsAxios.post(`/api/DoctorPatients/booking`, appointment);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError, `Lỗi khi tạo lịch hẹn cho bệnh nhân ${appointment.patientId}`);
    return {} as Booking; // Return empty booking on error
  }
};

