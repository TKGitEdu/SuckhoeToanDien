import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, 
  FileText, 
  Users, 
  Bell, 
  CalendarCheck,
} from "lucide-react";
import { Button } from "../../components/ui/button";

import { useState, useEffect } from "react";
import { bookingApi } from "../../api/bookingAPI";
import type { Booking } from "../../api/bookingAPI";
import ComponentTrackingTRM from "./componentTrackingTRM";

const PatientDashboard = () => {  
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  
  // Custom hook để lấy danh sách booking
  const useMyBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
      const fetchBookings = async () => {        try {
          setLoading(true);
          // Gọi API từ bookingApi
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
    // Lấy thông tin người dùng từ localStorage
    const userInfo = localStorage.getItem("userInfo");
    
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setPatientName(user.fullName || user.username || "Bệnh nhân");
        setPatientId(user.patientId || "");
        setLoading(false);
      } catch (e) {
        console.error("Error parsing userInfo:", e);
        setPatientName("Bệnh nhân");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);
    // Sử dụng hook để lấy dữ liệu booking
  const { bookings: upcomingAppointments } = useMyBookings();

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
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
              <div>                <p className="text-sm text-gray-500">Điều trị đang thực hiện</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
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
                <p className="text-2xl font-bold text-gray-900">2</p>
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
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                <Bell className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Thông báo mới</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >            <div className="p-6 border-b border-gray-100">
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
                            <p className="text-gray-900 font-medium">{new Date(booking.dateBooking).toLocaleDateString('vi-VN')}</p>
                            <p className="text-gray-600">{booking.slot?.startTime} - {booking.slot?.endTime}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {booking.note ? booking.note : "Đã đặt lịch"}
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

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Hoạt động gần đây</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {upcomingAppointments.length > 0 ? (
                // Sắp xếp theo thời gian tạo mới nhất và lấy 3 booking gần nhất
                [...upcomingAppointments]
                  .sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime())
                  .slice(0, 3)
                  .map((booking) => (
                    <div key={booking.bookingId} className="p-4">
                      <div className="flex">
                        <div className="mr-4">
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
                            {booking.description || `Lịch hẹn với bác sĩ ${booking.doctor?.doctorName || "không xác định"}`}
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
          </motion.div>        </div>        {/* Treatment Progress */}
        <ComponentTrackingTRM patientId={patientId} />

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
