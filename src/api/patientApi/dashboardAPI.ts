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

// Interface cho thông báo
export interface Notification {
  notificationId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  bookingId: string;
  treatmentProcessId: string;
  type: string;
  message: string;
  time: string;
  patientIsRead: boolean;
  doctorIsRead?: boolean;
  bookingDate: string;
  bookingStatus: string;
  treatmentStatus: string;
}

/**
 * Lấy danh sách thông báo của bệnh nhân theo userId
 * @param userId ID của người dùng
 * @param limit Số lượng thông báo muốn lấy (mặc định là 20)
 * @param onlyUnread Chỉ lấy thông báo chưa đọc (mặc định là false)
 * @returns Danh sách thông báo
 */
export const getPatientNotifications = async (
  userId: string,
  limit: number = 20,
  onlyUnread: boolean = false
): Promise<Notification[]> => {
  try {
    const response = await bookingAxios.get(
      `/api/PatientDashBoard/notifications?userId=${userId}&limit=${limit}&onlyUnread=${onlyUnread}`
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông báo:', error);
    throw error;
  }
};

/**
 * Đánh dấu một thông báo là đã đọc
 * @param notificationId ID của thông báo
 * @returns Kết quả của quá trình cập nhật
 */
export const markNotificationAsRead = async (notificationId: string): Promise<any> => {
  try {
    const response = await bookingAxios.put(
      `/api/PatientDashBoard/notifications/${notificationId}/read`
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đánh dấu thông báo đã đọc:', error);
    throw error;
  }
};

/**
 * Đánh dấu tất cả thông báo của bệnh nhân là đã đọc
 * @param userId ID của người dùng
 * @returns Kết quả của quá trình cập nhật
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<any> => {
  try {
    const response = await bookingAxios.put(
      `/api/PatientDashBoard/notifications/read-all?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đánh dấu tất cả thông báo đã đọc:', error);
    throw error;
  }
};

/**
 * Lấy ra các kiểm tra sức khỏe của bệnh nhân theo bookingId và userId
 * @param bookingId ID của booking
 * @param userId ID của người dùng
 * @returns Danh sách các kiểm tra sức khỏe
 */
export interface Examination {
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
  createAt: string;
  serviceName: string;
}

export const getPatientExaminations = async (bookingId: string, userId: string): Promise<Examination[]> => {
  try {
    const response = await bookingAxios.get(
      `/api/PatientDashBoard/examinations?bookingId=${bookingId}&userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy kiểm tra sức khỏe:', error);
    throw error;
  }
};
