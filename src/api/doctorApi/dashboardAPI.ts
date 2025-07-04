import axios from "axios";
// Định nghĩa lại các interface cần thiết (nếu muốn mở rộng hoặc dùng riêng cho dashboard)
import type { Booking, Doctor,Patient, Payment, Service, Slot, Examination } from "../patientApi/bookingAPI"; // Giả sử bạn đã có bookingAPI.ts định nghĩa Booking
export interface BookingDashboard {
  bookingId: string;
  patientId: string;
  serviceId: string;
  paymentId: string;
  doctorId: string;
  slotId: string;  
  dateBooking: string;
  description: string;
  note: string;
  status: string;
  createAt: string;
  doctor?: Doctor;
  patient?: Patient;
  payment?: Payment;
  service?: Service;
  slot?: Slot;
  examination?: Examination;
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
export const getDoctorByUserId = async (userId: string): Promise<Doctor | null> => {
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

// Interface cho dữ liệu thông báo
export interface DoctorNotification {
  notificationId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  bookingId: string;
  treatmentProcessId: string;
  type: string;
  message: string;
  time: string;
  doctorIsRead: boolean;
  patientIsRead?: boolean;
  bookingDate: string;
  bookingStatus: string;
  treatmentStatus: string;
}

// Lấy danh sách thông báo của bác sĩ theo userId
export const getDoctorNotifications = async (
  userId: string, 
  limit: number = 20, 
  unreadOnly: boolean = false
): Promise<DoctorNotification[]> => {
  try {
    const response = await dashboardAxios.get(`/api/DoctorDashBoard/notifications`, {
      params: { 
        userId,
        limit,
        docvachuadoc: unreadOnly
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy thông báo cho userId ${userId}:`, error);
    return [];
  }
};

// Đánh dấu thông báo đã đọc
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const response = await dashboardAxios.put(`/api/DoctorDashBoard/notifications/read-all`, 
      [notificationId]
    );
    return response.status === 200;
  } catch (error) {
    console.error(`Lỗi khi đánh dấu đã đọc cho thông báo ${notificationId}:`, error);
    return false;
  }
};

// Interface cho dữ liệu buổi khám
export interface DoctorExamination {
  examinationId: string;
  doctorId: string;
  patientId: string;
  patientName?: string;
  bookingId: string;
  examinationDate: string;
  examinationDescription: string;
  status: string;
  result: string;
  createAt: string;
  note: string;
}

// Lấy danh sách các buổi khám của bác sĩ theo doctorId
export const getDoctorExaminations = async (doctorId: string): Promise<DoctorExamination[]> => {
  try {
    const response = await dashboardAxios.get(`/api/DoctorDashBoard/examinations?doctorId=${doctorId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách buổi khám cho doctorId ${doctorId}:`, error);
    return [];
  }
};

// Interface cho dữ liệu kế hoạch điều trị
export interface TreatmentPlan {
  treatmentPlanId: string;
  doctorId: string;
  serviceId: string;
  method: string;
  patientDetailId: string;
  patientName?: string;
  startDate: string;
  endDate: string;
  status: string;
  treatmentDescription: string;
}

// Lấy danh sách kế hoạch điều trị của bác sĩ
export const getDoctorTreatmentPlans = async (doctorId: string): Promise<TreatmentPlan[]> => {
  try {
    const response = await dashboardAxios.get(`/api/DoctorDashBoard/treatmentplans?doctorId=${doctorId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách kế hoạch điều trị cho doctorId ${doctorId}:`, error);
    return [];
  }
};

// Cập nhật kế hoạch điều trị
export const updateTreatmentPlan = async (treatmentPlanId: string, data: Partial<TreatmentPlan>): Promise<boolean> => {
  try {
    const response = await dashboardAxios.put(`/api/DoctorDashBoard/treatmentplans/${treatmentPlanId}`, data);
    return response.status === 200;
  } catch (error) {
    console.error(`Lỗi khi cập nhật kế hoạch điều trị ${treatmentPlanId}:`, error);
    return false;
  }
};

// /* Dữ liệu mẫu cho hàm GetTreatmentPlansByDoctor
// Request URL
// https://localhost:7147/api/DoctorDashBoard/treatmentplans?doctorId=DOC_2
// {
//     "treatmentPlanId": "TP_2",
//     "doctorId": "DOC_2",
//     "serviceId": "SRV_4",
//     "method": "IUI",
//     "patientDetailId": "PATD_2",
//     "startDate": "2025-07-12",
//     "endDate": "2025-07-26",
//     "status": "Kích thích nhẹ buồng trứng",
//     "treatmentDescription": "Khám tổng quát; Kích thích nhẹ buồng trứng; Theo dõi nang noãn; Lọc rửa tinh trùng; Bơm tinh trùng vào buồng tử cung",
//     "doctor": null,
//     "patientDetail": null,
//     "treatmentProcesses": []
//   },