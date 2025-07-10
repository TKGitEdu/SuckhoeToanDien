import axios from "axios";

// Định nghĩa interface cho response của examination info
export interface ExaminationInfo {
  examinationId: string;
  serviceId: string;
  patientId: string;
  patientDetailId: string;
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
 * Lấy thông tin các trường id cần để tạo treatment plan
 * @param examinationId ID của examination cần lấy thông tin
 * @returns Thông tin examination bao gồm examinationId, serviceId, patientId, patientDetailId
 */
export const getExaminationInfo = async (examinationId: string): Promise<ExaminationInfo> => {
  try {
    const response = await dashboardAxios.get(`/api/DoctorCreateTreatmentPlan/examination-info/${examinationId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin examination với ID ${examinationId}:`, error);
    throw error;
  }
};

