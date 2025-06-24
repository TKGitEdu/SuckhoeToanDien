//src/api/treatmentPlanAPI.ts
import axios from 'axios';

// Tạo instance axios với cấu hình xác thực
const treatmentAxios = axios.create({
  baseURL: 'https://localhost:7147',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor để thêm token vào mỗi request
treatmentAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interfaces for TreatmentPlan
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

export interface PatientDetail {
  patientDetailId: string;
  patientId: string;
  treatmentStatus: string;
  patient: Patient;
}

export interface TreatmentProcess {
  treatmentProcessId: string;
  method: string;
  scheduledDate: string;
  actualDate: string;
  status: string;
  result: string;
}

export interface TreatmentPlan {
  treatmentPlanId: string;
  doctorId: string;
  method: string;
  patientDetailId: string;
  startDate: string;
  endDate: string;
  status: string;
  doctor: Doctor;
  patientDetail: PatientDetail;
  treatmentDescription: string;
  treatmentProcesses: TreatmentProcess[];
}

// TreatmentPlan API
const treatmentPlanAPI = {
  // Get treatment plan by ID
  getTreatmentPlanById: async (id: string): Promise<TreatmentPlan> => {
    try {
      const response = await treatmentAxios.get(`/api/TreatmentPlan/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching treatment plan with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Get patient detail by patient ID
  getPatientDetailByPatientId: async (patientId: string): Promise<PatientDetail> => {
    try {
      console.log(`Fetching patient detail for patientId: ${patientId}`);
      const response = await treatmentAxios.get(`/api/PatientDetail/Patient/${patientId}`);
      console.log("Patient detail response:", response.data);
      
      // API returns an array of patient details, take the first one
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0];
      }
      
      // If response is not an array but a single object
      if (response.data && response.data.patientDetailId) {
        return response.data;
      }
      
      throw new Error("No patient detail found for this patient ID");
    } catch (error) {
      console.error(`Error fetching patient detail for patient ${patientId}:`, error);
      throw error;
    }
  },
    // Get all treatment plans for a patient across all patient details
  getAllTreatmentPlansByPatient: async (patientId: string): Promise<TreatmentPlan[]> => {
    try {
      console.log(`Fetching all treatment plans for patientId: ${patientId}`);
      // Sử dụng đúng endpoint như trong backend: api/PatientDetail/Patient/{patientId}/TreatmentPlans
      const response = await treatmentAxios.get(`/api/PatientDetail/Patient/${patientId}/TreatmentPlans`);
      console.log("All treatment plans response:", response.data);
      
      // Xử lý kết quả trả về
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data) {
        return [response.data];
      }
      
      return [];
    } catch (error) {
      console.error(`Error fetching all treatment plans for patient ${patientId}:`, error);
      // Trả về một mảng rỗng thay vì throw error để tránh crash UI
      return [];
    }
  },
  
  // Get patientId from userId
  getPatientIdFromUserId: async (userId: string): Promise<string> => {
    try {
      console.log(`Fetching patientId for userId: ${userId}`);
      const response = await treatmentAxios.get(`/api/PatientDetail/User/${userId}/PatientId`);
      console.log("Patient ID response:", response.data);
      
      // API trả về string là patientId
      if (response.data) {
        return response.data;
      }
      
      throw new Error(`No patient ID found for user ${userId}`);
    } catch (error) {
      console.error(`Error fetching patientId for user ${userId}:`, error);
      throw error;
    }
  }
};

export default treatmentPlanAPI;