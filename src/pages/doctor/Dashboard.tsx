// src/pages/doctor/Dashboard.tsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Add useNavigate for navigation
import { getDoctorByUserId, getDoctorBookingsbyUserId, getDoctorNotifications, markNotificationAsRead, getDoctorExaminations, getDoctorTreatmentPlans } from "../../api/doctorApi/dashboardAPI";
import type { DoctorNotification, DoctorExamination, TreatmentPlan } from "../../api/doctorApi/dashboardAPI"; // Import as a type
import { Button } from "../../components/ui/button"; // Import Button component
import { Bell, CheckCircle } from "lucide-react"; // Import Bell and CheckCircle icons

// Define interface for user info from localStorage
interface UserInfo {
  userId: string;
  fullName: string;
  email: string;
  phone: string | null;
  username: string;
  roleId: string;
  address: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  role: {
    roleId: string | null;
    roleName: string;
  };
  doctor: any | null;
  patients: any[];
}

// Định nghĩa các interface giả lập cho các dữ liệu hard-coded
interface DoctorBasicDTO {
  doctorId: string;
  doctorName: string;
}

interface ExaminationCreateDTO {
  bookingId: string;
  patientId: string;
  doctorId: string;
  description: string;
  result: string;
  status: string;
}

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  service: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [doctor, setDoctor] = useState<DoctorBasicDTO | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<DoctorNotification[]>([]);
  const [activePatientsCount, setActivePatientsCount] = useState<number>(0);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [examinationShow, setExaminationShow] = useState<DoctorExamination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get user info from localStorage
        const userInfoString = localStorage.getItem('userInfo');
        if (!userInfoString) {
          setError("User information not found. Please log in again.");
          setLoading(false);
          return;
        }
        
        try {
          const parsedUserInfo: UserInfo = JSON.parse(userInfoString);
          setUserInfo(parsedUserInfo);
          
          if (parsedUserInfo.userId) {
            // Lấy thông tin bác sĩ từ API
            const doctorResponse = await getDoctorByUserId(parsedUserInfo.userId);
            setDoctor(doctorResponse || { doctorId: "DOC_1", doctorName: parsedUserInfo.fullName || "Unknown Doctor" });

            // Lấy danh sách booking từ API
            const bookingsResponse = await getDoctorBookingsbyUserId(parsedUserInfo.userId);
            const bookings = bookingsResponse.map((booking) => ({
              id: booking.bookingId,
              patientName: booking.patient?.name || "Unknown Patient",
              patientId: booking.patientId || "N/A",
              service: booking.service?.name || "Unknown Service",
              status: booking.status,
            }));
            setAppointments(bookings);

            // Tính số bệnh nhân đang điều trị (số bệnh nhân unique đã đặt lịch)
            const uniquePatientIds = new Set(bookingsResponse.map(booking => booking.patientId));
            setActivePatientsCount(uniquePatientIds.size);

            // Lấy thông báo từ API
            const notificationsResponse = await getDoctorNotifications(parsedUserInfo.userId);
            setNotifications(notificationsResponse);

            // Lấy danh sách buổi khám/xét nghiệm của bác sĩ
            if (doctorResponse && doctorResponse.doctorId) {
              const examinationsResponse = await getDoctorExaminations(doctorResponse.doctorId);
              // Lọc các buổi khám có trạng thái đang chờ kết quả
              const pendingExaminations = examinationsResponse.filter(exam => 
                exam.status === "in-progress" || exam.status === "Đang chờ" || exam.status === "completed" || exam.status === "Hoàn thành"
              );
              setExaminationShow(pendingExaminations);
              
              // Lấy danh sách kế hoạch điều trị
              const treatmentPlansResponse = await getDoctorTreatmentPlans(doctorResponse.doctorId);
              setTreatmentPlans(treatmentPlansResponse);
            }

          } else {
            setError("User ID not found in stored user information.");
          }
        } catch (parseError) {
          console.error("Error parsing user info from localStorage:", parseError);
          setError("Invalid user information format. Please log in again.");
        }
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewProfile = (patientId: string) => {
    // Navigate to the patient's profile page
    navigate(`/doctor/patient-profile/${patientId}`);
  };

  const handleStartAppointment = async (bookingId: string) => {
    try {
      // Find the appointment in the list
      const appointment = appointments.find((appt) => appt.id === bookingId);
      
      if (!appointment) {
        setError("Không tìm thấy thông tin lịch hẹn.");
        return;
      }
      
      // Giả lập API startAppointment
      const response = { success: true };
      if (response.success) {
        const examinationData: ExaminationCreateDTO = {
          bookingId,
          patientId: appointment.patientId,
          doctorId: doctor?.doctorId || "",
          description: "Phiên khám được tạo từ lịch hẹn",
          result: "",
          status: "in-progress",
        };
        // Giả lập API createExamination
        console.log("Examination created:", examinationData);
        // Cập nhật lại danh sách booking từ API
        if (userInfo?.userId) {
          const updatedBookings = await getDoctorBookingsbyUserId(userInfo.userId);
          const bookings = updatedBookings.map((booking) => ({
            id: booking.bookingId,
            patientName: booking.patient?.name || "Unknown Patient",
            patientId: booking.patientId || "N/A",
            service: booking.service?.name || "Unknown Service",
            status: booking.status,
          }));
          setAppointments(bookings);
        }
        
        // Navigate to the InteractivePatient page with the appointment ID
        navigate(`/doctor/interactive-patient/${bookingId}`);
      }
    } catch (err) {
      setError("Không thể bắt đầu phiên khám.");
    }
  };

  // Function to navigate to treatment plan update page
  const handleUpdateTreatmentPlan = (treatmentPlanId: string) => {
    navigate(`/doctor/treatment-plan/${treatmentPlanId}`);
  };

  // Function to navigate to the appointments page
  const handleNavigateToAppointments = () => {
    navigate("/doctor/appointments");
  };

  // Function to mark a notification as read
  const handleMarkNotificationAsRead = async (notificationId: string) => {
    try {
      const success = await markNotificationAsRead(notificationId);
      if (success && userInfo?.userId) {
        // Refresh notifications after marking as read
        const updatedNotifications = await getDoctorNotifications(userInfo.userId);
        setNotifications(updatedNotifications);
      }
    } catch (err) {
      setError("Không thể cập nhật thông báo.");
    }
  };

  if (loading) {
    return <div className="text-center">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold">Chào mừng trở lại, Dr. {doctor?.doctorName || userInfo?.fullName || "Bác sĩ"}</h1>
          <p className="text-gray-600">Quản lý lịch hẹn và bệnh nhân của bạn một cách dễ dàng.</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleNavigateToAppointments}
        >
          Xem quản lý lịch hẹn
        </Button>
      </motion.div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-sm font-medium text-gray-500">Số lịch hẹn</h3>
          <p className="text-2xl font-bold">{appointments.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-sm font-medium text-gray-500">Bệnh nhân đang điều trị</h3>
          <p className="text-2xl font-bold">{activePatientsCount}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-sm font-medium text-gray-500">Danh sách buổi khám</h3>
          <p className="text-2xl font-bold">{examinationShow.length}</p>
        </motion.div>
      </div>

      {/* Danh sách lịch hẹn */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <h2 className="text-lg font-medium p-6">Danh sách lịch hẹn</h2>
        <div className="divide-y divide-gray-100">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment.id} className="p-6">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-gray-500">ID: {appointment.patientId}</p>
                        <p className="text-sm text-gray-500">{appointment.service}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            appointment.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button
                        variant="outline"
                        className="text-sm font-medium text-blue-600"
                        onClick={() => handleViewProfile(appointment.patientId)}
                      >
                        Xem hồ sơ
                      </Button>
                      <Button
                        className={`text-sm font-medium ${
                          appointment.status === "confirmed"
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={() => handleStartAppointment(appointment.id)}
                        disabled={appointment.status !== "confirmed"}
                      >
                        Bắt đầu khám
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">Không có lịch hẹn nào</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Thông báo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Thông báo</h2>
          <div className="relative">
            <Bell className="h-5 w-5 text-gray-500" />
            {notifications.filter(n => !n.doctorIsRead).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notifications.filter(n => !n.doctorIsRead).length}
              </span>
            )}
          </div>
        </div>
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div 
                key={notification.notificationId} 
                className={`flex items-start justify-between py-3 ${!notification.doctorIsRead ? 'bg-blue-50' : ''} cursor-pointer hover:bg-gray-50`}
                onClick={() => !notification.doctorIsRead && handleMarkNotificationAsRead(notification.notificationId)}
              >
                <div className="flex-1">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.message}</p>
                      <div className="flex items-center mt-1">
                        <p className="text-xs text-gray-500 mr-2">
                          {new Date(notification.time).toLocaleString('vi-VN')}
                        </p>
                        <p className="text-xs text-gray-500">
                          Bệnh nhân: {notification.patientName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center ml-4">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      notification.type === "appointment" ? "bg-blue-100 text-blue-800" : 
                      notification.type === "test-result" ? "bg-yellow-100 text-yellow-800" : 
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {notification.type}
                  </span>
                  {!notification.doctorIsRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn sự kiện click lan truyền lên parent
                        handleMarkNotificationAsRead(notification.notificationId);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Không có thông báo mới</p>
        )}
      </motion.div>

      {/* Cập nhật điều trị gần đây */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6"
      >
        <h2 className="text-lg font-medium mb-4">Kế hoạch điều trị</h2>
        {treatmentPlans.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th>Bệnh nhân</th>
                <th>Phương pháp</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {treatmentPlans.map((plan) => (
                <tr key={plan.treatmentPlanId} className="border-t">
                  <td className="py-2">{plan.patientDetailName}</td>
                  <td>{plan.method}</td>
                  <td>{plan.status}</td>
                  <td>
                    <button
                      className="px-2 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
                      onClick={() => handleUpdateTreatmentPlan(plan.treatmentPlanId)}
                    >
                      Cập nhật
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">Không có kế hoạch điều trị nào</p>
        )}
      </motion.div>

      {/* Kết quả xét nghiệm đang chờ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6"
      >
        <h2 className="text-lg font-medium mb-4">Danh sách buổi khám</h2>
        {examinationShow.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th>Bệnh nhân</th>
                <th>Mô tả buổi khám</th>
                <th>Ngày khám</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {examinationShow.map((examination) => (
                <tr key={examination.examinationId} className="border-t">
                  <td className="py-2">{examination.patientName || 'Bệnh nhân'}</td>
                  <td>{examination.examinationDescription}</td>
                  <td>{new Date(examination.examinationDate).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        examination.status === "pending" || examination.status === "Đang chờ" || examination.status === "Chờ kết quả"
                        ? "bg-yellow-100 text-yellow-800"
                        : examination.status === "in-progress" || examination.status === "Đang xử lý"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                      }`}
                    >
                      {examination.status}
                    </span>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs font-medium text-blue-600"
                      onClick={() => navigate(`/doctor/examination/${examination.examinationId}`)}
                    >
                      Xem chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">Không có buổi khám nào</p>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;