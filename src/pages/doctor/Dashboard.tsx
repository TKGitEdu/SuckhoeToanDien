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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Chào mừng trở lại, Dr. {userInfo?.doctor?.doctorName || userInfo?.fullName || "Bác sĩ"}
            </h1>
            <p className="text-base text-gray-600 mt-2">Quản lý lịch hẹn, thông báo và kế hoạch điều trị của bạn.</p>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
        >
          {[
            { icon: Calendar, title: "Số lịch hẹn", value: appointments.length, bg: "bg-blue-50", color: "text-blue-600" },
            { icon: Users, title: "Bệnh nhân đang điều trị", value: activePatientsCount, bg: "bg-green-50", color: "text-green-600" },
            { icon: Microscope, title: "Danh sách buổi khám", value: examinationShow.length, bg: "bg-purple-50", color: "text-purple-600" },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow duration-200"
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
            >
              <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">{item.title}</h3>
                <p className="text-2xl font-bold text-gray-800">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Appointments and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Appointments */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50">
              <h2 className="text-lg font-semibold text-gray-800">Danh sách lịch hẹn</h2>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2"
                onClick={handleNavigateToAppointments}
              >
                Xem quản lý lịch hẹn
              </Button>
            </div>
            <div className="divide-y divide-gray-200">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <motion.div
                    key={appointment.id}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                    animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-lg text-gray-800">{appointment.patientName}</p>
                        <p className="text-sm text-gray-500">ID: {appointment.patientId}</p>
                        <p className="text-sm text-gray-500">{appointment.service}</p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${
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
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            className="text-blue-600 hover:bg-blue-50 font-medium border-blue-200"
                            onClick={() => handleViewProfile(appointment.patientId)}
                          >
                            Xem hồ sơ
                          </Button>
                          {appointment.status === "confirmed" ? (
                            <Button
                              className="bg-green-600 hover:bg-green-700 text-white font-medium"
                              onClick={() => handleStartAppointment(appointment.id)}
                            >
                              Bắt đầu khám
                            </Button>
                          ) : appointment.status === "pending" ? (
                            <Button
                              className="bg-yellow-100 text-yellow-800 font-medium cursor-not-allowed"
                              disabled
                            >
                              Đang chờ
                            </Button>
                          ) : appointment.status === "cancelled" ? (
                            <Button
                              className="bg-red-100 text-red-800 font-medium cursor-not-allowed"
                              disabled
                            >
                              Đã hủy
                            </Button>
                          ) : appointment.status === "completed" ? (
                            <Button
                              className="bg-green-100 text-green-800 font-medium cursor-not-allowed"
                              disabled
                            >
                              Đã hoàn thành
                            </Button>
                          ) : (
                            <Button
                              className="bg-gray-100 text-gray-600 font-medium cursor-not-allowed"
                              disabled
                            >
                              Không khả dụng
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-base text-gray-500">Không có lịch hẹn nào</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Thông báo</h2>
              <div className="flex items-center gap-3">
                {notifications.filter((n) => !n.doctorIsRead).length > 0 && (
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:bg-blue-50 text-sm font-medium"
                    onClick={handleReadAllNotifications}
                  >
                    Đọc tất cả
                  </Button>
                )}
                <div className="relative">
                  <Bell className="h-6 w-6 text-gray-500" />
                  {notifications.filter((n) => !n.doctorIsRead).length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter((n) => !n.doctorIsRead).length}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {notifications.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {(showAllNotifications ? notifications : notifications.slice(0, 3)).map((notification) => (
                    <motion.div
                      key={notification.notificationId}
                      initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                      animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-start justify-between py-3 px-3 rounded-lg ${
                        !notification.doctorIsRead ? "bg-blue-50" : ""
                      } cursor-pointer hover:bg-gray-50 transition-colors duration-200`}
                      onClick={() => !notification.doctorIsRead && handleMarkNotificationAsRead(notification.notificationId)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 mr-3">
                            <div
                              className={`text-sm text-gray-700 ${
                                expandedNotifications.has(notification.notificationId) ? "" : "overflow-hidden"
                              }`}
                              style={{
                                display: expandedNotifications.has(notification.notificationId) ? "block" : "-webkit-box",
                                WebkitLineClamp: expandedNotifications.has(notification.notificationId) ? "unset" : 2,
                                WebkitBoxOrient: "vertical",
                                lineHeight: "1.5em",
                                maxHeight: expandedNotifications.has(notification.notificationId) ? "none" : "3em",
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
                                className="text-sm text-blue-600 hover:text-blue-800 mt-2 focus:outline-none"
                              >
                                {expandedNotifications.has(notification.notificationId) ? "Thu gọn" : "Xem thêm"}
                              </button>
                            )}
                          </div>
                          <div className="flex flex-col items-end ml-2">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full mb-2 ${
                                notification.type === "appointment" ? "bg-blue-100 text-blue-800" :
                                notification.type === "test-result" ? "bg-yellow-100 text-yellow-800" : 
                                "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {notification.type === "appointment" ? "Lịch hẹn" :
                               notification.type === "test-result" ? "Kết quả xét nghiệm" : notification.type}
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
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">{new Date(notification.time).toLocaleString("vi-VN")}</p>
                          <p className="text-xs text-gray-500">BN: {notification.patientName}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-base text-gray-500">Không có thông báo mới</p>
                </div>
              )}
              {notifications.length > 3 && (
                <div className="pt-4 text-center">
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:bg-blue-50 text-sm font-medium"
                    onClick={toggleShowAllNotifications}
                  >
                    {showAllNotifications ? "Thu gọn" : `Xem thêm ${notifications.length - 3} thông báo`}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Treatment Plans */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Kế hoạch điều trị</h2>
            <Button
              variant="outline"
              className="text-blue-600 hover:bg-blue-50 font-medium border-blue-200"
              onClick={() => navigate("/doctor/treatment-records")}
            >
              Xem tất cả
            </Button>
          </div>
          {treatmentPlans.length > 0 ? (
            <div className="space-y-4">
              <div className="hidden sm:block">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="text-left text-sm text-gray-600">
                      <th className="pb-3 font-medium">Bệnh nhân</th>
                      <th className="pb-3 font-medium">Phương pháp</th>
                      <th className="pb-3 font-medium">Ngày bắt đầu</th>
                      <th className="pb-3 font-medium">Ngày kết thúc</th>
                      <th className="pb-3 font-medium">Trạng thái</th>
                      <th className="pb-3 font-medium">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treatmentPlans.slice(0, 5).map((plan) => (
                      <motion.tr
                        key={plan.treatmentPlanId}
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="py-3 font-medium text-gray-800">{plan.patientDetailName}</td>
                        <td className="py-3 text-gray-700">{plan.method}</td>
                        <td className="py-3 text-sm text-gray-600">{new Date(plan.startDate).toLocaleDateString("vi-VN")}</td>
                        <td className="py-3 text-sm text-gray-600">{new Date(plan.endDate).toLocaleDateString("vi-VN")}</td>
                        <td className="py-3">
                          <span
                            className={`px-3 py-1 text-sm font-medium rounded-full ${
                              plan.giaidoan === "completed" ? "bg-green-100 text-green-800" :
                              plan.giaidoan === "in-progress" ? "bg-blue-100 text-blue-800" :
                              plan.giaidoan === "pending" ? "bg-yellow-100 text-yellow-800" :
                              plan.giaidoan === "cancelled" ? "bg-red-100 text-red-800" :
                              "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {plan.giaidoan === "completed" ? "Đã hoàn thành" :
                             plan.giaidoan === "in-progress" ? "Đang thực hiện" :
                             plan.giaidoan === "pending" ? "Chờ xác nhận" :
                             plan.giaidoan === "cancelled" ? "Đã hủy" : plan.giaidoan}
                          </span>
                        </td>
                        <td className="py-3">
                          {plan.giaidoan === "completed" ? (
                            <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-50 text-green-700 border border-green-200">
                              Đã hoàn thành
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-600 hover:bg-blue-50 font-medium border-blue-200"
                              onClick={() => handleUpdateTreatmentPlan(plan.treatmentPlanId)}
                            >
                              Cập nhật
                            </Button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="sm:hidden space-y-4">
                {treatmentPlans.slice(0, 5).map((plan) => (
                  <motion.div
                    key={plan.treatmentPlanId}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                    animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <p className="font-semibold text-base text-gray-800">{plan.patientDetailName}</p>
                    <p className="text-sm text-gray-600">Phương pháp: {plan.method}</p>
                    <p className="text-sm text-gray-600">Bắt đầu: {new Date(plan.startDate).toLocaleDateString("vi-VN")}</p>
                    <p className="text-sm text-gray-600">Kết thúc: {new Date(plan.endDate).toLocaleDateString("vi-VN")}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          plan.giaidoan === "completed" ? "bg-green-100 text-green-800" :
                          plan.giaidoan === "in-progress" ? "bg-blue-100 text-blue-800" :
                          plan.giaidoan === "pending" ? "bg-yellow-100 text-yellow-800" :
                          plan.giaidoan === "cancelled" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {plan.giaidoan === "completed" ? "Đã hoàn thành" :
                         plan.giaidoan === "in-progress" ? "Đang thực hiện" :
                         plan.giaidoan === "pending" ? "Chờ xác nhận" :
                         plan.giaidoan === "cancelled" ? "Đã hủy" : plan.giaidoan}
                      </span>
                      {plan.giaidoan === "completed" ? (
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-50 text-green-700 border border-green-200">
                          Đã hoàn thành
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 hover:bg-blue-50 font-medium border-blue-200"
                          onClick={() => handleUpdateTreatmentPlan(plan.treatmentPlanId)}
                        >
                          Cập nhật
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              {treatmentPlans.length > 5 && (
                <div className="pt-4 border-t border-gray-200 text-center">
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:bg-blue-50 text-sm font-medium"
                    onClick={() => navigate("/doctor/treatment-records")}
                  >
                    Xem thêm {treatmentPlans.length - 5} kế hoạch điều trị khác
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Microscope className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-base text-gray-500 mb-4">Không có kế hoạch điều trị nào</p>
              <Button
                variant="outline"
                className="text-blue-600 hover:bg-blue-50 font-medium border-blue-200"
                onClick={() => navigate("/doctor/treatment-records")}
              >
                Tạo kế hoạch điều trị mới
              </Button>
            </div>
          )}
        </motion.div>

        {/* Examinations */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Danh sách buổi khám</h2>
          {examinationShow.length > 0 ? (
            <div className="space-y-4">
              <div className="hidden sm:block">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="text-left text-sm text-gray-600">
                      <th className="pb-3 font-medium">Bệnh nhân</th>
                      <th className="pb-3 font-medium">Mô tả buổi khám</th>
                      <th className="pb-3 font-medium">Ngày khám</th>
                      <th className="pb-3 font-medium">Trạng thái</th>
                      <th className="pb-3 font-medium">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examinationShow.map((examination) => (
                      <motion.tr
                        key={examination.examinationId}
                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`border-t hover:bg-gray-50 transition-colors duration-200 ${
                          examination.status === "pending" ? "bg-yellow-50" :
                          examination.status === "in-progress" ? "bg-blue-50" :
                          examination.status === "completed" ? "bg-green-50" :
                          examination.status === "cancelled" ? "bg-red-50" : "bg-gray-50"
                        }`}
                      >
                        <td className="py-3 font-medium text-gray-800 flex items-center gap-2">
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
                          {examination.status === "cancelled" && (
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                              <path stroke="currentColor" strokeWidth="2" d="M15 9l-6 6m0-6l6 6" />
                            </svg>
                          )}
                          {examination.patientName || "Bệnh nhân"}
                        </td>
                        <td className="py-3 text-gray-700">{examination.examinationDescription}</td>
                        <td className="py-3 text-sm text-gray-600">{new Date(examination.examinationDate).toLocaleDateString("vi-VN")}</td>
                        <td className="py-3">
                          <span
                            className={`px-3 py-1 text-sm font-medium rounded-full ${
                              examination.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                              examination.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                              examination.status === "completed" ? "bg-green-100 text-green-800" :
                              examination.status === "cancelled" ? "bg-red-100 text-red-800" :
                              "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {examination.status === "pending" ? "Đang chờ" :
                             examination.status === "in-progress" ? "Đang xử lý" :
                             examination.status === "completed" ? "Hoàn thành" :
                             examination.status === "cancelled" ? "Đã hủy" : examination.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 hover:bg-blue-50 font-medium border-blue-200"
                            onClick={() => navigate(`/doctor/create-treatment-plan/${examination.examinationId}`)}
                          >
                            Tạo kế hoạch điều trị
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="sm:hidden space-y-4">
                {examinationShow.map((examination) => (
                  <motion.div
                    key={examination.examinationId}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                    animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`p-4 rounded-lg border border-gray-200 ${
                      examination.status === "pending" ? "bg-yellow-50" :
                      examination.status === "in-progress" ? "bg-blue-50" :
                      examination.status === "completed" ? "bg-green-50" :
                      examination.status === "cancelled" ? "bg-red-50" : "bg-gray-50"
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
                      {examination.status === "cancelled" && (
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                          <path stroke="currentColor" strokeWidth="2" d="M15 9l-6 6m0-6l6 6" />
                        </svg>
                      )}
                      <p className="font-semibold text-base text-gray-800">{examination.patientName || "Bệnh nhân"}</p>
                    </div>
                    <p className="text-sm text-gray-600">Mô tả: {examination.examinationDescription}</p>
                    <p className="text-sm text-gray-600">Ngày khám: {new Date(examination.examinationDate).toLocaleDateString("vi-VN")}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          examination.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          examination.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                          examination.status === "completed" ? "bg-green-100 text-green-800" :
                          examination.status === "cancelled" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {examination.status === "pending" ? "Đang chờ" :
                         examination.status === "in-progress" ? "Đang xử lý" :
                         examination.status === "completed" ? "Hoàn thành" :
                         examination.status === "cancelled" ? "Đã hủy" : examination.status}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600 hover:bg-blue-50 font-medium border-blue-200"
                        onClick={() => navigate(`/doctor/create-treatment-plan/${examination.examinationId}`)}
                      >
                        Tạo kế hoạch điều trị
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Microscope className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-base text-gray-500">Không có buổi khám nào</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;