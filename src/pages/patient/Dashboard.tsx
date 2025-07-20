import { Link, useNavigate ,useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, 
  FileText, 
  Users, 
  Bell, 
  CalendarCheck,
  XCircle,
  Check,
  Stethoscope
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useState, useEffect } from "react";
import { bookingApi } from "../../api/patientApi/bookingAPI";
import type { Booking } from "../../api/patientApi/bookingAPI";
import { getPatientNotifications, markNotificationAsRead, markAllNotificationsAsRead, getPatientExaminations } from "../../api/patientApi/dashboardAPI";
import type { Notification, Examination } from "../../api/patientApi/dashboardAPI";
import ComponentTrackingTRM from "./componentTrackingTRM";

const PatientDashboard = () => {  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState("");
  const [userId, setUserId] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [examinationsLoading, setExaminationsLoading] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [showAllNotifications, setShowAllNotifications] = useState<boolean>(false);
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());
  
  // Custom hook để lấy danh sách booking
  const useMyBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
      const fetchBookings = async () => {        
        try {
          setLoading(true);
          const data = await bookingApi.getMyBookings();
          setBookings(data);
          setLoading(false);
        } catch (err) {
          console.error("Lỗi khi lấy danh sách đặt lịch:", err);
          setError("Không thể lấy danh sách đặt lịch. Vui lòng thử lại sau.");
          setLoading(false);
        }
      };

      fetchBookings();
    }, []);
    
    return { bookings, loading, error };
  };

  // Lấy thông tin người dùng và lịch hẹn
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setPatientName(user.fullName);
        setUserId(user.userId);
        setLoading(false);

        // Nếu có userId, lấy thông báo của người dùng
        if (user.userId) {
          fetchNotifications(user.userId);
        }
      } catch (e) {
        console.error("Error parsing userInfo:", e);
        setPatientName("Bệnh nhân");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Hàm lấy thông báo
  const fetchNotifications = async (userId: string) => {
    try {
      const data = await getPatientNotifications(userId, 20, false);
      setNotifications(data);
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
    }
  };

  // Hàm đánh dấu một thông báo đã đọc
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      // Cập nhật lại danh sách thông báo
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.notificationId === notificationId 
            ? { ...notification, patientIsRead: true } 
            : notification
        )
      );
    } catch (error) {
      console.error("Lỗi khi đánh dấu thông báo đã đọc:", error);
    }
  };

  // Hàm đánh dấu tất cả thông báo đã đọc
  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    
    try {
      await markAllNotificationsAsRead(userId);
      // Cập nhật lại danh sách thông báo
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, patientIsRead: true }))
      );
    } catch (error) {
      console.error("Lỗi khi đánh dấu tất cả thông báo đã đọc:", error);
    }
  };

  // Function to toggle expanded state of a notification
  const toggleNotificationExpansion = (notificationId: string) => {
    setExpandedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  // Function to toggle showing all notifications
  const toggleShowAllNotifications = () => {
    setShowAllNotifications(prev => !prev);
  };

  // Hàm lấy danh sách các buổi khám
  const fetchExaminations = async (bookingId: string) => {
    if (!userId || !bookingId) return;
    
    try {
      setExaminationsLoading(true);
      setSelectedBookingId(bookingId);
      const data = await getPatientExaminations(bookingId, userId);
      setExaminations(data);
      setExaminationsLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách buổi khám:", error);
      setExaminationsLoading(false);
    }
  };

  function countUniqueDoctors(bookings: Booking[]): number {
    const uniqueDoctorIds = Array.from(
      new Set(bookings.map(b => b.doctorId).filter(Boolean))
    );
    return uniqueDoctorIds.length;
  }
  
  const { bookings, loading: bookingsLoading, error } = useMyBookings();
  
  // Lọc lịch hẹn sắp tới (chưa hủy) và đã hủy
  const upcomingAppointments = bookings.filter(
    booking => booking.status !== "Đã hủy" && booking.status !== "cancelled"
  );
  const cancelledAppointments = bookings.filter(
    booking => booking.status === "Đã hủy" || booking.status === "cancelled"
  );

  if (loading || bookingsLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Xin chào, {patientName}!</h1>
          <p className="mt-1 text-gray-600">
            Chào mừng bạn đến với bảng điều khiển của bạn. Tại đây, bạn có thể theo dõi quá trình điều trị, lịch hẹn và các thông tin quan trọng.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Lịch hẹn sắp tới</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>                
                <p className="text-sm text-gray-500">Điều trị đang thực hiện</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bác sĩ của bạn</p>
                <p className="text-2xl font-bold text-gray-900">{countUniqueDoctors(upcomingAppointments)}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Lịch hẹn đã hủy</p>
                <p className="text-2xl font-bold text-gray-900">{cancelledAppointments.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Notifications Section */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Thông báo mới</h2>
              <div className="flex items-center space-x-2">
                {notifications.filter(n => !n.patientIsRead).length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm text-blue-600 hover:bg-blue-50"
                    onClick={handleMarkAllAsRead}
                  >
                    Đọc tất cả
                  </Button>
                )}
                <div className="relative">
                  <Bell className="h-6 w-6 text-gray-500" />
                  {notifications.filter(n => !n.patientIsRead).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter(n => !n.patientIsRead).length}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {(showAllNotifications ? notifications : notifications.slice(0, 4)).map((notification) => (
                <div 
                  key={notification.notificationId} 
                  className={`p-4 rounded-lg border ${!notification.patientIsRead ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'} cursor-pointer hover:bg-gray-100 transition-colors`}
                  onClick={() => !notification.patientIsRead && handleMarkAsRead(notification.notificationId)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 mr-3">
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            notification.type === "appointment" ? "bg-blue-100 text-blue-800" : 
                            notification.type === "test-result" ? "bg-yellow-100 text-yellow-800" : 
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {notification.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.time).toLocaleString('vi-VN',{ timeZone: 'UTC' })}
                        </span>
                      </div>
                      <div 
                        className={`text-sm text-gray-900 ${
                          expandedNotifications.has(notification.notificationId) ? '' : 'overflow-hidden'
                        }`}
                        style={{
                          display: expandedNotifications.has(notification.notificationId) ? 'block' : '-webkit-box',
                          WebkitLineClamp: expandedNotifications.has(notification.notificationId) ? 'unset' : 3,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: '1.4em',
                          maxHeight: expandedNotifications.has(notification.notificationId) ? 'none' : '4.2em'
                        }}
                      >
                        {notification.message}
                      </div>
                      {notification.message.length > 100 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleNotificationExpansion(notification.notificationId);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-1 focus:outline-none"
                        >
                          {expandedNotifications.has(notification.notificationId) ? 'Thu gọn' : 'Xem thêm'}
                        </button>
                      )}
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          {notification.doctorName ? `Từ bác sĩ ${notification.doctorName}` : notification.type}
                        </p>
                      </div>
                      {notification.patientIsRead && (
                        <span className="text-xs text-green-600 flex items-center mt-2">
                          <Check className="h-3 w-3 mr-1" />
                          Đã đọc
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {notifications.length > 4 && (
              <div className="pt-4 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:bg-blue-50"
                  onClick={toggleShowAllNotifications}
                >
                  {showAllNotifications 
                    ? 'Thu gọn' 
                    : `Xem thêm ${notifications.length - 4} thông báo`
                  }
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* 3 dịch vụ nằm cùng một hàng */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-8">
          {/* Hoạt động gần đây */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Hoạt động gần đây</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {bookings.length > 0 ? (
                [...bookings]
                  .sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime())
                  .slice(0, 3)
                  .map((booking) => (
                    <div key={booking.bookingId} className="p-4">
                      <div className="flex">
                        <div className="mr

-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {booking.service?.name ? `Đặt lịch ${booking.service.name}` : "Đặt lịch dịch vụ"}
                          </h3>
                          <p className="text-xs text-gray-500 mb-1">
                            {new Date(booking.createAt).toLocaleDateString('vi-VN')}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.description || `Lịch hẹn với bác sĩ ${booking.doctor?.doctorName || "không xác định"} `}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-gray-500">Không có hoạt động gần đây</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Hồ sơ khám bệnh */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                  <Stethoscope className="h-5 w-5 text-teal-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Hồ sơ khám bệnh</h2>
              </div>
            </div>
            <div className="p-6">
              {upcomingAppointments.length > 0 ? (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chọn lịch hẹn</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      onChange={(e) => {
                        const bookingId = e.target.value;
                        if (bookingId) fetchExaminations(bookingId);
                      }}
                      value={selectedBookingId}
                    >
                      <option value="">-- Chọn lịch hẹn --</option>
                      {upcomingAppointments.map((booking, index) => (
                        <option key={booking.bookingId} value={booking.bookingId}>
                          {booking.service?.name || `Lịch hẹn ${index + 1}`} - {new Date(booking.dateBooking).toLocaleDateString('vi-VN', { timeZone: 'UTC' })}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {examinations.length > 0 ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chọn buổi khám</label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded text-sm mb-4"
                        id="examination-select"
                      >
                        <option value="">-- Chọn buổi khám --</option>
                        {examinations.map((exam, index) => (
                          <option key={exam.examinationId} value={exam.examinationId}>
                            Buổi khám số {index + 1} - {new Date(exam.createAt).toLocaleDateString('vi-VN', { timeZone: 'UTC' })}
                          </option>
                        ))}
                      </select>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          const select = document.getElementById('examination-select') as HTMLSelectElement;
                          const examinationId = select.value;
                          if (!examinationId) return;
                          
                          const selectedExamination = examinations.find(e => e.examinationId === examinationId);
                          if (selectedExamination) {
                            navigate(`/patient/examinations?bookingId=${selectedExamination.bookingId}&examinationId=${examinationId}`, {
                              state: { examination: selectedExamination }
                            });
                          }
                        }}
                      >
                        Xem chi tiết buổi khám
                      </Button>
                    </div>
                  ) : examinationsLoading ? (
                    <div className="py-8 text-center">
                      <div className="animate-spin inline-block h-6 w-6 border-t-2 border-b-2 border-teal-600 rounded-full mb-2"></div>
                      <p className="text-gray-500">Đang tải thông tin buổi khám...</p>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-gray-500 mb-2">Chưa có thông tin buổi khám</p>
                      <p className="text-sm text-gray-400">Hãy chọn một lịch hẹn để xem thông tin các buổi khám</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500 mb-2">Bạn chưa có lịch hẹn</p>
                  <Link to="/booking">
                    <Button className="mt-2">Đặt lịch khám</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Lịch hẹn đã hủy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Lịch hẹn đã hủy</h2>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {cancelledAppointments.length > 0 ? (
                cancelledAppointments.map((booking) => (
                  <div key={booking.bookingId} className="p-6">
                    <div className="flex items-start">
                      <div className="mr-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100">
                          <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{booking.service?.name || "Dịch vụ không xác định"}</h3>
                            <p className="text-gray-600">{booking.doctor?.doctorName || "Bác sĩ không xác định"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-900 font-medium">{new Date(booking.dateBooking).toLocaleDateString('vi-VN')}</p>
                            <p className="text-gray-600">{booking.slot?.startTime || 'N/A'} - {booking.slot?.endTime || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Đã hủy
                          </span>
                          <div className="flex space-x-2">
                            <Link to={`/patient/appointments/${booking.bookingId}`}>
                              <Button size="sm" className="text-sm bg-blue-600 hover:bg-blue-700">
                                Chi tiết
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Bạn không có lịch hẹn nào đã hủy</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* 2 khối nằm dưới, chiếm toàn bộ chiều rộng */}
        <div className="grid grid-cols-1 gap-8">
          {/* Lịch hẹn sắp tới */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Lịch hẹn sắp tới</h2>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((booking) => (
                  <div key={booking.bookingId} className="p-6">
                    <div className="flex items-start">
                      <div className="mr-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
                          <CalendarCheck className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{booking.service?.name || "Dịch vụ không xác định"}</h3>
                            <p className="text-gray-600">{booking.doctor?.doctorName || "Bác sĩ không xác định"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-900 font-medium">{new Date(booking.dateBooking).toLocaleDateString('vi-VN', {timeZone: 'UTC'})}</p>
                            <p className="text-gray-600">{booking.slot?.startTime || 'N/A'} - {booking.slot?.endTime || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {booking.status || "Đã đặt lịch"}
                          </span>
                          <div className="flex space-x-2">
                            <Link to={`/patient/appointments/${booking.bookingId}`}>
                              <Button size="sm" className="text-sm bg-blue-600 hover:bg-blue-700">
                                Chi tiết
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Bạn không có lịch hẹn nào sắp tới</p>
                  <Link to="/booking" className="mt-2 inline-block">
                    <Button className="bg-blue-600 hover:bg-blue-700 mt-2">
                      Đặt lịch ngay
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Theo dõi điều trị */}
          <ComponentTrackingTRM/>
        </div>

        {/* Recommended Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-8 bg-blue-50 rounded-xl shadow-sm border border-blue-100 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Dịch vụ đề xuất cho bạn</h2>
            <p className="text-gray-600 mb-4">
              Dựa trên thông tin của bạn, chúng tôi đề xuất các dịch vụ sau để hỗ trợ quá trình điều trị của bạn
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-1">Tư vấn dinh dưỡng</h3>
                <p className="text-sm text-gray-600 mb-2">Chế độ dinh dưỡng cho người đang điều trị hiếm muộn</p>
                <Link to="/services/nutrition" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  Tìm hiểu thêm
                </Link>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-1">Yoga cho thai kỳ</h3>
                <p className="text-sm text-gray-600 mb-2">Tập luyện yoga nhẹ nhàng, hỗ trợ tăng khả năng thụ thai</p>
                <Link to="/services/yoga" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  Tìm hiểu thêm
                </Link>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-1">Tư vấn tâm lý</h3>
                <p className="text-sm text-gray-600 mb-2">Hỗ trợ tâm lý trong quá trình điều trị hiếm muộn</p>
                <Link to="/services/counseling" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;