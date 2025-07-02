// src/pages/doctor/Dashboard.tsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Add useNavigate for navigation
import { getDoctorByUserId, getDoctorBookingsbyUserId } from "../../api/doctorApi/dashboardAPI";
import { Button } from "../../components/ui/button"; // Import Button component

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

interface NotificationDTO {
  id: string;
  message: string;
  type: string;
}

interface TreatmentUpdateDTO {
  id: string;
  patientName: string;
  treatmentType: string;
  currentStage: string;
}

interface TestResultDTO {
  id: string;
  patientName: string;
  testType: string;
  status: string;
}

interface PatientProfileDTO {
  patientId: string;
  name: string;
}

interface ExaminationCreateDTO {
  bookingId: string;
  patientId: string;
  doctorId: string;
  description: string;
  result: string;
  status: string;
}

interface TreatmentPlanCreateDTO {
  patientId: string;
  doctorId: string;
  method: string;
  status: string;
  description: string;
}

interface TreatmentProcessCreateDTO {
  treatmentPlanId: string;
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
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [activePatientsCount, setActivePatientsCount] = useState<number>(0);
  const [recentTreatmentUpdates, setRecentTreatmentUpdates] = useState<TreatmentUpdateDTO[]>([]);
  const [waitingTestResults, setWaitingTestResults] = useState<TestResultDTO[]>([]);
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
            setDoctor(doctorResponse || { doctorId: "DOC001", doctorName: parsedUserInfo.fullName || "Unknown Doctor" });

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

            // Hard-coded dữ liệu cho notifications
            setNotifications([
              { id: "1", message: "Lịch hẹn mới với bệnh nhân Nguyễn Văn B", type: "appointment" },
              { id: "2", message: "Kết quả xét nghiệm của bệnh nhân Trần Thị C đã có", type: "test-result" },
            ]);

            // Hard-coded số bệnh nhân đang điều trị
            setActivePatientsCount(5);

            // Hard-coded cập nhật điều trị
            setRecentTreatmentUpdates([
              { id: "1", patientName: "Nguyễn Văn B", treatmentType: "Nha khoa", currentStage: "Đang điều trị" },
              { id: "2", patientName: "Trần Thị C", treatmentType: "Chỉnh nha", currentStage: "Hoàn thành" },
            ]);

            // Hard-coded kết quả xét nghiệm đang chờ
            setWaitingTestResults([
              { id: "1", patientName: "Nguyễn Văn B", testType: "Xét nghiệm máu", status: "pending" },
              { id: "2", patientName: "Trần Thị C", testType: "X-quang", status: "pending" },
            ]);
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

  const handleViewProfile = async (patientId: string) => {
    try {
      // Hard-coded hồ sơ bệnh nhân
      const patientProfile: PatientProfileDTO = {
        patientId,
        name: `Bệnh nhân ${patientId}`,
      };
      console.log("Patient Profile:", patientProfile);
      // TODO: Điều hướng đến trang hồ sơ bệnh nhân hoặc hiển thị modal
    } catch (err) {
      setError("Không thể tải hồ sơ bệnh nhân.");
    }
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

  const handleCreateTreatmentPlan = async (patientId: string) => {
    try {
      // Giả lập API createTreatmentPlan
      const treatmentPlanData: TreatmentPlanCreateDTO = {
        patientId,
        doctorId: doctor?.doctorId || "",
        method: "Điều trị nha khoa",
        status: "active",
        description: "Kế hoạch điều trị nha khoa cho bệnh nhân",
      };
      console.log("Treatment Plan created:", treatmentPlanData);
      // Cập nhật lại danh sách cập nhật điều trị (hard-coded)
      setRecentTreatmentUpdates([
        ...recentTreatmentUpdates,
        { id: `new-${Date.now()}`, patientName: `Bệnh nhân ${patientId}`, treatmentType: "Nha khoa", currentStage: "Đang điều trị" },
      ]);
    } catch (err) {
      setError("Không thể tạo kế hoạch điều trị.");
    }
  };

  const handleCreateTreatmentProcess = async (treatmentPlanId: string) => {
    try {
      // Giả lập API createTreatmentProcess
      const processData: TreatmentProcessCreateDTO = {
        treatmentPlanId,
        result: "",
        status: "scheduled",
      };
      console.log("Treatment Process created:", processData);
      // Cập nhật lại danh sách cập nhật điều trị (hard-coded)
      setRecentTreatmentUpdates([
        ...recentTreatmentUpdates,
        { id: `new-${Date.now()}`, patientName: "Bệnh nhân mới", treatmentType: "Nha khoa", currentStage: "Lên lịch" },
      ]);
    } catch (err) {
      setError("Không thể tạo quá trình điều trị.");
    }
  };

  // Function to navigate to the appointments page
  const handleNavigateToAppointments = () => {
    navigate("/doctor/appointments");
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
          <h3 className="text-sm font-medium text-gray-500">Kết quả xét nghiệm đang chờ</h3>
          <p className="text-2xl font-bold">{waitingTestResults.length}</p>
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
        <h2 className="text-lg font-medium mb-4">Thông báo</h2>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id} className="flex items-center justify-between py-2">
              <p className="text-sm font-medium">{notification.message}</p>
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  notification.type === "appointment" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {notification.type}
              </span>
            </div>
          ))
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
        <h2 className="text-lg font-medium mb-4">Cập nhật điều trị gần đây</h2>
        {recentTreatmentUpdates.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th>Bệnh nhân</th>
                <th>Loại điều trị</th>
                <th>Giai đoạn</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {recentTreatmentUpdates.map((update) => (
                <tr key={update.id} className="border-t">
                  <td className="py-2">{update.patientName}</td>
                  <td>{update.treatmentType}</td>
                  <td>{update.currentStage}</td>
                  <td>
                    <button
                      className="px-2 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
                      onClick={() => handleCreateTreatmentProcess(update.id)}
                    >
                      Thêm quá trình
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">Không có cập nhật điều trị gần đây</p>
        )}
      </motion.div>

      {/* Kết quả xét nghiệm đang chờ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6"
      >
        <h2 className="text-lg font-medium mb-4">Kết quả xét nghiệm đang chờ</h2>
        {waitingTestResults.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th>Bệnh nhân</th>
                <th>Loại xét nghiệm</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {waitingTestResults.map((result) => (
                <tr key={result.id} className="border-t">
                  <td className="py-2">{result.patientName}</td>
                  <td>{result.testType}</td>
                  <td>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        result.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {result.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">Không có kết quả xét nghiệm đang chờ</p>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;