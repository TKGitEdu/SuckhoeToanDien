import axios from "axios";

// Create axios instance for treatment record API
const treatmentRecordAxios = axios.create({
  baseURL: "https://localhost:7147",
  headers: {
    "Content-Type": "application/json",
  },
});

treatmentRecordAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Định nghĩa kiểu dữ liệu cho TreatmentStep
export interface TreatmentStep {
  treatmentStepId: string;
  treatmentPlanId: string;
  stepOrder: number;
  stepName: string;
}

export interface TreatmentStepsResponse {
  treatmentPlanId: string;
  steps: TreatmentStep[];
}

export interface CreateStepRequest {
  stepOrder: number;
  stepName: string;
}

// Lấy danh sách các bước điều trị của một treatment plan
export const getTreatmentSteps = async (treatmentPlanId: string): Promise<TreatmentStepsResponse> => {
  try {
    console.log("Getting treatment steps for plan:", treatmentPlanId);
    const response = await treatmentRecordAxios.get(`/api/DoctorDashBoard/treatmentplan/${treatmentPlanId}/steps`);
    console.log("Treatment steps response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách bước điều trị cho treatmentPlanId ${treatmentPlanId}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Status code:', error.response?.status);
      
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy kế hoạch điều trị');
      } else if (error.response?.status === 401) {
        throw new Error('Bạn không có quyền truy cập thông tin này');
      } else {
        throw new Error(`Lỗi server: ${error.response?.status}`);
      }
    }
    throw error;
  }
};

// Tạo hoặc cập nhật các bước điều trị
export const createOrUpdateTreatmentSteps = async (
  treatmentPlanId: string, 
  steps: CreateStepRequest[]
): Promise<boolean> => {
  try {
    console.log("Creating/updating treatment steps for plan:", treatmentPlanId, "with data:", steps);
    const response = await treatmentRecordAxios.post(`/api/DoctorDashBoard/treatmentplan/${treatmentPlanId}/steps`, steps);
    console.log("Create/update treatment steps response:", response.data);
    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error(`Lỗi khi tạo/cập nhật bước điều trị cho treatmentPlanId ${treatmentPlanId}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Status code:', error.response?.status);
      
      if (error.response?.status === 400) {
        throw new Error(`Dữ liệu không hợp lệ: ${error.response?.data?.message || 'Vui lòng kiểm tra lại thông tin'}`);
      } else if (error.response?.status === 404) {
        throw new Error('Không tìm thấy kế hoạch điều trị');
      } else if (error.response?.status === 401) {
        throw new Error('Bạn không có quyền thực hiện thao tác này');
      } else {
        throw new Error(`Lỗi server: ${error.response?.status}`);
      }
    }
    throw error;
  }
};

