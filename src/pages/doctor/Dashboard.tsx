import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  getDoctorBookingsbyUserId,
  getDoctorNotifications,
  markNotificationAsRead,
  readAllNotifications,
  getDoctorExaminations,
  getDoctorTreatmentPlans,
} from "../../api/doctorApi/dashboardAPI";
import type { DoctorNotification, DoctorExamination, TreatmentPlan } from "../../api/doctorApi/dashboardAPI";
import { Button } from "../../components/ui/button";
import { Bell, CheckCircle, Calendar, Users, Microscope } from "lucide-react";

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
  role: { roleId: string | null; roleName: string };
  doctor: { doctorId: string; userId: string; doctorName: string | null; specialization: string | null; phone: string | null; email: string | null } | null;
  patients: any[];
}

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  service: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<DoctorNotification[]>([]);
  const [activePatientsCount, setActivePatientsCount] = useState<number>(0);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [examinationShow, setExaminationShow] = useState<DoctorExamination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllNotifications, setShowAllNotifications] = useState<boolean>(false);
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userInfoString = localStorage.getItem("userInfo");
        if (!userInfoString) {
          setError("Thông tin người dùng không tìm thấy. Vui lòng đăng nhập lại.");
          setLoading(false);
          return;
        }
        const parsedUserInfo: UserInfo = JSON.parse(userInfoString);
        setUserInfo(parsedUserInfo);

        if (parsedUserInfo.userId && parsedUserInfo.doctor) {
          const bookingsResponse = await getDoctorBookingsbyUserId(parsedUserInfo.userId);
          const bookings = bookingsResponse.map((booking) => ({
            id: booking.bookingId,
            patientName: booking.patient?.name || "Unknown Patient",
            patientId: booking.patient?.patientId || "N/A",
            service: booking.service?.name || "Unknown Service",
            status: booking.status,
          }));
          setAppointments(bookings);
          const uniquePatientIds = new Set(bookingsResponse.map((booking) => booking.patientId));
          setActivePatientsCount(uniquePatientIds.size);

          const notificationsResponse = await getDoctorNotifications(parsedUserInfo.userId);
          setNotifications(notificationsResponse);

          if (parsedUserInfo.doctor.doctorId) {
            const examinationsResponse = await getDoctorExaminations(parsedUserInfo.doctor.doctorId);
            const pendingExaminations = examinationsResponse.filter((exam) =>
              ["in-progress", "completed", "pending", "cancelled"].includes(exam.status)
            );
            setExaminationShow(pendingExaminations);
            const treatmentPlansResponse = await getDoctorTreatmentPlans(parsedUserInfo.doctor.doctorId);
            setTreatmentPlans(treatmentPlansResponse);
          }
        } else {
          setError("Không tìm thấy thông tin bác sĩ.");
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewProfile = (patientId: string) => navigate(`/doctor/patients?patientId=${patientId}`);
  const handleStartAppointment = async (bookingId: string) => {
    try {
      const appointment = appointments.find((appt) => appt.id === bookingId);
      if (!appointment) {
        setError("Không tìm thấy thông tin lịch hẹn.");
        return;
      }
      navigate(`/doctor/interactive-patient/${bookingId}`);
    } catch (err) {
      console.error("Lỗi khi bắt đầu phiên khám:", err);
      setError("Không thể bắt đầu phiên khám.");
    }
  };
  const handleUpdateTreatmentPlan = (treatmentPlanId: string) => navigate(`/doctor/treatment-records?treatmentPlanId=${treatmentPlanId}`);
  const handleNavigateToAppointments = () => navigate("/doctor/appointments");
  const handleMarkNotificationAsRead = async (notificationId: string) => {
    try {
      const success = await markNotificationAsRead(notificationId);
      if (success && userInfo?.userId) {
        const updatedNotifications = await getDoctorNotifications(userInfo.userId);
        setNotifications(updatedNotifications);
      }
    } catch (err) {
      setError("Không thể cập nhật thông báo.");
    }
  };
  const toggleNotificationExpansion = (notificationId: string) => {
    setExpandedNotifications((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) newSet.delete(notificationId);
      else newSet.add(notificationId);
      return newSet;
    });
  };
  const toggleShowAllNotifications = () => setShowAllNotifications((prev) => !prev);
  const handleReadAllNotifications = async () => {
    try {
      const success = await readAllNotifications();
      if (success && userInfo?.userId) {
        const updatedNotifications = await getDoctorNotifications(userInfo.userId);
        setNotifications(updatedNotifications);
      }
    } catch (err) {
      setError("Không thể đánh dấu tất cả thông báo đã đọc.");
    }
  };

  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen overflow-x-hidden">
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Chào mừng trở lại, Dr. {userInfo?.doctor?.doctorName || userInfo?.fullName || "Bác sĩ"}</h1>
          <p className="text-sm sm:text-base text-gray-600">Quản lý lịch hẹn và bệnh nhân của bác sĩ.</p>
        </div>
      </motion.div>

      {/* Thống kê nhanh */}
<div className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-3 mb-4 sm:mb-6 sm:grid sm:grid-cols-3 sm:overflow-x-visible">
  {[
    { icon: Calendar, title: "Số lịch hẹn", value: appointments.length, bg: "bg-blue-100", color: "text-blue-600" },
    { icon: Users, title: "Bệnh nhân đang điều trị", value: activePatientsCount, bg: "bg-green-100", color: "text-green-600" },
    { icon: Microscope, title: "Danh sách buổi khám", value: examinationShow.length, bg: "bg-purple-100", color: "text-purple-600" },
  ].map((item, index) => (
    <motion.div
      key={item.title}
      initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
      animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-4 min-w-[200px] sm:min-w-0 snap-start"
    >
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${item.bg} flex items-center justify-center`}>
        <item.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${item.color}`} />
      </div>
      <div>
        <h3 className="text-sm sm:text-base font-medium text-gray-500 whitespace-nowrap">{item.title}</h3>
        <p className="text-lg sm:text-2xl font-bold">{item.value}</p>
      </div>
    </motion.div>
  ))}
</div>

      {/* Danh sách lịch hẹn và Thông báo */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Danh sách lịch hẹn */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-medium">Danh sách lịch hẹn</h2>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]" onClick={handleNavigateToAppointments}>
              Xem quản lý lịch hẹn
            </Button>
          </div>
          <div className="divide-y divide-gray-100">
            {appointments.length > 0 ? (
  appointments.map((appointment) => (
    <div key={appointment.id} className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1">
          <p className="font-medium text-base sm:text-lg">{appointment.patientName}</p>
          <p className="text-sm text-gray-500">ID: {appointment.patientId}</p>
          <p className="text-sm text-gray-500">{appointment.service}</p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
          {/* <span
            className={`inline-block px-2 py-1 text-xs sm:text-sm font-medium rounded-full ${
              appointment.status === "confirmed" ? "bg-green-100 text-green-800" :
              appointment.status === "pending" ? "bg-yellow-100 text-yellow-800" :
              appointment.status === "cancelled" ? "bg-red-100 text-red-800" :
              appointment.status === "completed" ? "bg-green-100 text-green-800" :
              "bg-gray-100 text-gray-800"
            }`}
          >
            {appointment.status === "confirmed" ? "Đã xác nhận" :
             appointment.status === "pending" ? "Đang chờ" :
             appointment.status === "cancelled" ? "Đã hủy" :
             appointment.status === "completed" ? "Đã hoàn thành" :
             appointment.status}
          </span> */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="text-sm font-medium text-blue-600 min-w-[100px]"
              onClick={() => handleViewProfile(appointment.patientId)}
            >
              Xem hồ sơ
            </Button>
            {appointment.status === "confirmed" ? (
              <Button
                className="text-sm font-medium min-w-[100px] bg-green-600 text-white hover:bg-green-700"
                onClick={() => handleStartAppointment(appointment.id)}
              >
                Bắt đầu khám
              </Button>
            ) : appointment.status === "pending" ? (
              <Button
                className="text-sm font-medium min-w-[100px] bg-yellow-200 text-yellow-700 cursor-not-allowed"
                disabled
              >
                Chờ xác nhận
              </Button>
            ) : appointment.status === "cancelled" ? (
              <Button
                className="text-sm font-medium min-w-[100px] bg-red-200 text-red-700 cursor-not-allowed"
                disabled
              >
                Đã hủy
              </Button>
            ) : appointment.status === "completed" ? (
              <Button
                className="text-sm font-medium min-w-[100px] bg-green-200 text-green-700 cursor-not-allowed"
                disabled
              >
                Đã hoàn thành
              </Button>
            ) : (
              <Button
                className="text-sm font-medium min-w-[100px] bg-gray-300 text-gray-500 cursor-not-allowed"
                disabled
              >
                Không khả dụng
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  ))
) : (
  <div className="p-4 sm:p-6 text-center">
    <p className="text-sm sm:text-base text-gray-500">Không có lịch hẹn nào</p>
  </div>
)}
          </div>
        </motion.div>

        {/* Thông báo */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-medium">Thông báo</h2>
            <div className="flex items-center gap-2 sm:gap-3">
              {notifications.filter((n) => !n.doctorIsRead).length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs sm:text-sm text-blue-600 hover:bg-blue-50"
                  onClick={handleReadAllNotifications}
                >
                  Đọc tất cả
                </Button>
              )}
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-500" />
                {notifications.filter((n) => !n.doctorIsRead).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.filter((n) => !n.doctorIsRead).length}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="max-h-80 sm:max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {(showAllNotifications ? notifications : notifications.slice(0, 3)).map((notification) => (
                  <div
                    key={notification.notificationId}
                    className={`flex items-start justify-between py-3 px-2 rounded-lg ${!notification.doctorIsRead ? "bg-blue-50" : ""} cursor-pointer hover:bg-gray-50`}
                    onClick={() => !notification.doctorIsRead && handleMarkNotificationAsRead(notification.notificationId)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-2">
                          <div
                            className={`text-sm ${expandedNotifications.has(notification.notificationId) ? "" : "overflow-hidden"}`}
                            style={{
                              display: expandedNotifications.has(notification.notificationId) ? "block" : "-webkit-box",
                              WebkitLineClamp: expandedNotifications.has(notification.notificationId) ? "unset" : 2,
                              WebkitBoxOrient: "vertical",
                              lineHeight: "1.4em",
                              maxHeight: expandedNotifications.has(notification.notificationId) ? "none" : "2.8em",
                            }}
                          >
                            {notification.messageForDoctor}
                          </div>
                          {notification.messageForDoctor.length > 80 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleNotificationExpansion(notification.notificationId);
                              }}
                              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 mt-1 focus:outline-none"
                            >
                              {expandedNotifications.has(notification.notificationId) ? "Thu gọn" : "Xem thêm"}
                            </button>
                          )}
                        </div>
                        <div className="flex flex-col items-end ml-2">
                          <span
                            className={`inline-block px-2 py-1 text-xs sm:text-sm font-medium rounded-full mb-1 ${
                              notification.type === "appointment" ? "bg-blue-100 text-blue-800" :
                              notification.type === "test-result" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {notification.type}
                          </span>
                          {!notification.doctorIsRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkNotificationAsRead(notification.notificationId);
                              }}
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className="text-xs sm:text-sm text-gray-500">{new Date(notification.time).toLocaleString("vi-VN")}</p>
                        <p className="text-xs sm:text-sm text-gray-500">BN: {notification.patientName}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm sm:text-base text-gray-500 text-center">Không có thông báo mới</p>
            )}
            {notifications.length > 3 && (
              <div className="pt-3 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:bg-blue-50 text-sm"
                  onClick={toggleShowAllNotifications}
                >
                  {showAllNotifications ? "Thu gọn" : `Xem thêm ${notifications.length - 3} thông báo`}
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Kế hoạch điều trị */}
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6"
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-medium">Kế hoạch điều trị</h2>
          <Button variant="outline" className="text-blue-600 hover:bg-blue-50 min-w-[100px]" onClick={() => navigate("/doctor/treatment-records")}>
            Xem tất cả
          </Button>
        </div>
        {treatmentPlans.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            <div className="hidden sm:block">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-2">Bệnh nhân</th>
                    <th className="pb-2">Phương pháp</th>
                    <th className="pb-2">Ngày bắt đầu</th>
                    <th className="pb-2">Ngày kết thúc</th>
                    <th className="pb-2">Trạng thái</th>
                    <th className="pb-2">Hành động</th>
                  </tr>
                </thead>
                <tbody>
  {treatmentPlans.slice(0, 5).map((plan) => (
    <tr key={plan.treatmentPlanId} className="border-t">
      <td className="py-3 font-medium">{plan.patientDetailName}</td>
      <td className="py-3">{plan.method}</td>
      <td className="py-3 text-sm text-gray-600">{new Date(plan.startDate).toLocaleDateString("vi-VN")}</td>
      <td className="py-3 text-sm text-gray-600">{new Date(plan.endDate).toLocaleDateString("vi-VN")}</td>
      <td className="py-3">
        <span
          className={`inline-block px-2 py-1 text-xs sm:text-sm font-medium rounded-full ${
            plan.giaidoan === "completed" ? "bg-green-100 text-green-800" :
            plan.giaidoan === "in-progress"? "bg-blue-100 text-blue-800" :
            plan.giaidoan === "pending"? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {plan.giaidoan === "completed" || plan.giaidoan === "Hoàn thành"
            ? "Đã hoàn thành"
            : plan.giaidoan}
        </span>
      </td>
      <td className="py-3">
        {(plan.giaidoan === "completed") ? (
          <span className="inline-block px-2 py-1 text-xs sm:text-sm font-medium rounded-full bg-green-50 text-green-700 border border-green-200">
            Đã hoàn thành
          </span>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="text-blue-600 hover:bg-blue-50 min-w-[100px]"
            onClick={() => handleUpdateTreatmentPlan(plan.treatmentPlanId)}
          >
            Cập nhật
          </Button>
        )}
      </td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
            <div className="sm:hidden space-y-3">
              {treatmentPlans.slice(0, 5).map((plan) => (
  <div key={plan.treatmentPlanId} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
    <p className="font-medium text-base">{plan.patientDetailName}</p>
    <p className="text-sm text-gray-500">Phương pháp: {plan.method}</p>
    <p className="text-sm text-gray-500">Bắt đầu: {new Date(plan.startDate).toLocaleDateString("vi-VN")}</p>
    <p className="text-sm text-gray-500">Kết thúc: {new Date(plan.endDate).toLocaleDateString("vi-VN")}</p>
    <div className="flex items-center justify-between mt-2">
      <span
        className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${
          plan.giaidoan === "completed"? "bg-green-100 text-green-800" :
          plan.giaidoan === "in-progress" ? "bg-blue-100 text-blue-800" :
          plan.giaidoan === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
        }`}
      >
        {plan.giaidoan === "completed"? "Đã hoàn thành": plan.giaidoan}
      </span>
      {(plan.giaidoan === "completed") ? (
        <span className="inline-block px-2 py-1 text-sm font-medium rounded-full bg-green-50 text-green-700 border border-green-200">
          Đã hoàn thành
        </span>
      ) : (
        <Button
          size="default"
          variant="outline"
          className="text-blue-600 hover:bg-blue-50 min-w-[100px]"
          onClick={() => handleUpdateTreatmentPlan(plan.treatmentPlanId)}
        >
          Cập nhật
        </Button>
      )}
    </div>
  </div>
))}
            </div>
            {treatmentPlans.length > 5 && (
              <div className="pt-3 sm:pt-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full text-blue-600 hover:bg-blue-50 text-sm"
                  onClick={() => navigate("/doctor/treatment-records")}
                >
                  Xem thêm {treatmentPlans.length - 5} kế hoạch điều trị khác
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <p className="text-sm sm:text-base text-gray-500 mb-4">Không có kế hoạch điều trị nào</p>
            <Button
              variant="outline"
              className="text-blue-600 hover:bg-blue-50 min-w-[120px]"
              onClick={() => navigate("/doctor/treatment-records")}
            >
              Tạo kế hoạch điều trị mới
            </Button>
          </div>
        )}
      </motion.div>

      {/* Danh sách buổi khám */}
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mt-4 sm:mt-6"
      >
        <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Danh sách buổi khám</h2>
        {examinationShow.length > 0 ? (
          <div className="space-y-3 sm:space-y-0">
            <div className="hidden sm:block">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-2">Bệnh nhân</th>
                    <th className="pb-2">Mô tả buổi khám</th>
                    <th className="pb-2">Ngày khám</th>
                    <th className="pb-2">Trạng thái</th>
                    <th className="pb-2">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {examinationShow.map((examination) => (
                    <tr
                      key={examination.examinationId}
                      className={`border-t transition-colors ${
                        examination.status === "pending" ? "bg-yellow-50" :
                        examination.status === "in-progress" ? "bg-blue-50" :
                        examination.status === "completed" ? "bg-green-50" : "bg-gray-50"
                      }`}
                    >
                      <td className="py-2 font-medium flex items-center gap-2">
                        {examination.status === "pending" && (
                          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path stroke="currentColor" strokeWidth="2" d="M12 6v6l4 2" />
                          </svg>
                        )}
                        {examination.status === "in-progress" && (
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path stroke="currentColor" strokeWidth="2" d="M12 8v4l3 3" />
                          </svg>
                        )}
                        {examination.status === "completed" && (
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path stroke="currentColor" strokeWidth="2" d="M9 12l2 2 4-4" />
                          </svg>
                        )}
                        {examination.patientName || "Bệnh nhân"}
                      </td>
                      <td className="py-2">{examination.examinationDescription}</td>
                      <td className="py-2 text-sm text-gray-600">{new Date(examination.examinationDate).toLocaleDateString("vi-VN")}</td>
                      <td className="py-2">
                        <span
                          className={`inline-block px-2 py-1 text-xs sm:text-sm font-medium rounded-full ${
                            examination.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            examination.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                            examination.status === "completed" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {examination.status === "pending" ? "Đang chờ" :
                           examination.status === "in-progress" ? "Đang xử lý" :
                           examination.status === "completed" ? "Hoàn thành" : examination.status}
                        </span>
                      </td>
                      <td className="py-2">
                        <Button
                          size="default"
                          variant="outline"
                          className="text-sm font-medium text-blue-600 min-w-[100px]"
                          onClick={() => navigate(`/doctor/create-treatment-plan/${examination.examinationId}`)}
                        >
                          Tạo kế hoạch điều trị
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="sm:hidden space-y-3">
              {examinationShow.map((examination) => (
                <div
                  key={examination.examinationId}
                  className={`p-3 rounded-lg border border-gray-100 ${
                    examination.status === "pending" ? "bg-yellow-50" :
                    examination.status === "in-progress" ? "bg-blue-50" :
                    examination.status === "completed" ? "bg-green-50" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {examination.status === "pending" && (
                      <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path stroke="currentColor" strokeWidth="2" d="M12 6v6l4 2" />
                      </svg>
                    )}
                    {examination.status === "in-progress" && (
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path stroke="currentColor" strokeWidth="2" d="M12 8v4l3 3" />
                      </svg>
                    )}
                    {examination.status === "completed" && (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path stroke="currentColor" strokeWidth="2" d="M9 12l2 2 4-4" />
                      </svg>
                    )}
                    <p className="font-medium text-base">{examination.patientName || "Bệnh nhân"}</p>
                  </div>
                  <p className="text-sm text-gray-500">Mô tả: {examination.examinationDescription}</p>
                  <p className="text-sm text-gray-500">Ngày khám: {new Date(examination.examinationDate).toLocaleDateString("vi-VN")}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${
                        examination.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        examination.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                        examination.status === "completed" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {examination.status === "pending" ? "Đang chờ" :
                       examination.status === "in-progress" ? "Đang xử lý" :
                       examination.status === "completed" ? "Hoàn thành" : examination.status}
                    </span>
                    <Button
                      size="default"
                      variant="outline"
                      className="text-sm font-medium text-blue-600 min-w-[100px]"
                      onClick={() => navigate(`/doctor/create-treatment-plan/${examination.examinationId}`)}
                    >
                      Tạo kế hoạch điều trị
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <p className="text-sm sm:text-base text-gray-500">Không có buổi khám nào</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;