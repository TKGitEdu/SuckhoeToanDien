import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Clock,
  UserRound,
  ArrowRight
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { getDoctorBookingsbyUserId, getDoctorByUserId } from "../../api/doctorApi/dashboardAPI.ts";
import type { DashboardDoctor } from "../../api/doctorApi/dashboardAPI";

const DoctorDashboard = () => {
  // State để quản lý trạng thái loading, thông tin bác sĩ và danh sách booking
  const [loading, setLoading] = useState(true); // Trạng thái loading khi lấy dữ liệu
  const [doctor, setDoctor] = useState<DashboardDoctor | null>(null); // Lưu thông tin bác sĩ (DashboardDoctor | null)

  const [pastBookings, setPastBookings] = useState<Array<{
  id: string;
  patientName: string;
  patientId: string;
  service: string;
  time: string;
  status: string;
  date: string;
}>>([]);
  const [todayBookings, setTodayBookings] = useState<Array<{
  id: string;
  patientName: string;
  patientId: string;
  service: string;
  time: string;
  status: string;
  date: string;
}>>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Array<{
  id: string;
  patientName: string;
  patientId: string;
  service: string;
  time: string;
  status: string;
  date: string;
}>>([]);
  const [activeTab, setActiveTab] = useState('today'); // Tab hiện tại (past, today, upcoming)

  // useEffect để lấy thông tin bác sĩ
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        // Lấy userId từ localStorage
        const userInfo = localStorage.getItem("userInfo");
        const userId = userInfo ? JSON.parse(userInfo).userId : null;

        if (!userId) {
          console.error("Không tìm thấy userId trong localStorage");
          setLoading(false);
          return;
        }

        // Gọi API lấy thông tin bác sĩ
        const doctorData = await getDoctorByUserId(userId);
        if (doctorData) {
          setDoctor(doctorData); // Lưu thông tin bác sĩ
        } else {
          console.error("Không tìm thấy bác sĩ với userId:", userId);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bác sĩ:", error);
      } finally {
        setLoading(false); // Tắt loading sau khi hoàn tất
      }
    };

    fetchDoctor();
  }, []); // Chỉ chạy 1 lần khi component mount

  // useEffect để lấy và phân loại bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Lấy userId từ localStorage
        const userInfo = localStorage.getItem("userInfo");
        const userId = userInfo ? JSON.parse(userInfo).userId : null;

        if (!userId) {
          console.error("Không tìm thấy userId trong localStorage");
          return;
        }

        // Gọi API lấy danh sách booking
        const bookings = await getDoctorBookingsbyUserId(userId);
        const today = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại (YYYY-MM-DD)

        // Phân loại booking quá khứ
        const pastBookings = bookings
          .filter(booking => booking.dateBooking.split('T')[0] < today)
          .map(booking => ({
            id: booking.bookingId,
            patientName: booking.patient?.name || "Không xác định",
            patientId: booking.patientId || "Không xác định",
            service: booking.service?.name || "Không xác định",
            time: booking.slot?.startTime || "Không xác định",
            status: booking.status || "Không xác định",
            date: booking.dateBooking.split('T')[0]
          }))
          .sort((a, b) => b.date.localeCompare(a.date)); // Sắp xếp quá khứ từ mới đến cũ

        // Phân loại booking hôm nay
        const todayBookings = bookings
          .filter(booking => booking.dateBooking.split('T')[0] === today)
          .map(booking => ({
            id: booking.bookingId,
            patientName: booking.patient?.name || "Không xác định",
            patientId: booking.patientId || "Không xác định",
            service: booking.service?.name || "Không xác định",
            time: booking.slot?.startTime || "Không xác định",
            status: booking.status || "Không xác định",
            date: booking.dateBooking.split('T')[0]
          }));

        // Phân loại booking sắp tới
        const upcomingBookings = bookings
          .filter(booking => booking.dateBooking.split('T')[0] > today)
          .map(booking => ({
            id: booking.bookingId,
            patientName: booking.patient?.name || "Không xác định",
            patientId: booking.patientId || "Không xác định",
            service: booking.service?.name || "Không xác định",
            time: booking.slot?.startTime || "Không xác định",
            status: booking.status || "Không xác định",
            date: booking.dateBooking.split('T')[0]
          }))
          .sort((a, b) => a.date.localeCompare(a.date)); // Sắp xếp sắp tới từ gần đến xa

        // Cập nhật state cho các danh sách booking
        setPastBookings(pastBookings);
        setTodayBookings(todayBookings);
        setUpcomingBookings(upcomingBookings);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách booking:", error);
      }
    };

    fetchBookings();
  }, []); // Chạy 1 lần khi component mount

  // Hiển thị loading khi đang lấy dữ liệu bác sĩ
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
        {/* Phần chào mừng */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Xin chào, {doctor?.doctorName || "Bác sĩ"}!</h1>
          <p className="mt-1 text-gray-600">
            Chào mừng đến với bảng điều khiển bác sĩ. Quản lý lịch hẹn, bệnh nhân và cập nhật điều trị.
          </p>
        </div>

        {/* Phần hiển thị danh sách booking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Lịch hẹn</h2>
              <Link to="/doctor/bookings" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            {/* Tabs để chọn Quá khứ, Hôm nay, Sắp tới */}
            <div className="mt-4 flex space-x-4 border-b">
              <button
                onClick={() => setActiveTab('past')}
                className={`pb-2 text-sm font-medium ${
                  activeTab === 'past'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Quá khứ
              </button>
              <button
                onClick={() => setActiveTab('today')}
                className={`pb-2 text-sm font-medium ${
                  activeTab === 'today'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Hôm nay
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`pb-2 text-sm font-medium ${
                  activeTab === 'upcoming'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sắp tới
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {/* Hiển thị danh sách booking theo tab được chọn */}
            {(() => {
              const bookings = activeTab === 'past' ? pastBookings : activeTab === 'today' ? todayBookings : upcomingBookings;
              return bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking.id} className="p-6">
                    <div className="flex items-start">
                      {/* Icon hiển thị theo trạng thái booking */}
                      <div className="mr-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100' 
                            : booking.status === 'waiting'
                            ? 'bg-yellow-100'
                            : 'bg-gray-100'
                        }`}>
                          {booking.status === 'confirmed' ? (
                            <CalendarCheck className="h-6 w-6 text-green-600" />
                          ) : booking.status === 'waiting' ? (
                            <Clock className="h-6 w-6 text-yellow-600" />
                          ) : (
                            <UserRound className="h-6 w-6 text-gray-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            {/* Hiển thị thông tin booking */}
                            <h3 className="text-lg font-semibold text-gray-900">{booking.patientName}</h3>
                            <div className="flex items-center text-gray-600">
                              <span className="text-sm mr-2">ID: {booking.patientId}</span>
                              <span className="text-sm">{booking.service}</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Ngày: {booking.date}</div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-900 font-medium">{booking.time}</p>
                            {/* Hiển thị trạng thái booking */}
                            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : booking.status === 'waiting'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status === 'confirmed' 
                                ? 'Đã xác nhận' 
                                : booking.status === 'waiting'
                                ? 'Đang chờ'
                                : 'Chưa xác nhận'}
                            </span>
                          </div>
                        </div>
                        {/* Các nút hành động */}
                        <div className="mt-3 flex justify-end space-x-2">
                          <Button variant="outline" size="sm" className="text-sm border-gray-300 text-gray-700">
                            Xem hồ sơ
                          </Button>
                          <Button size="sm" className="text-sm bg-blue-600 hover:bg-blue-700">
                            Bắt đầu khám
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">
                    {activeTab === 'past' 
                      ? 'Không có lịch hẹn trong quá khứ' 
                      : activeTab === 'today' 
                      ? 'Không có lịch hẹn hôm nay' 
                      : 'Không có lịch hẹn sắp tới'}
                  </p>
                </div>
              );
            })()}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorDashboard;