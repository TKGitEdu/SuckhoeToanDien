import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  FileText, 
  Users, 
  Bell, 
  ArrowRight,
  CalendarCheck,
  PieChart,
  Bookmark
} from "lucide-react";
import { Button } from "../../components/ui/button";

// Giả lập dữ liệu
const upcomingAppointments = [
  {
    id: 1,
    service: "Thụ tinh trong tử cung (IUI)",
    doctor: "TS. BS. Nguyễn Văn A",
    date: "20/06/2025",
    time: "09:30",
    status: "confirmed"
  },
  {
    id: 2,
    service: "Khám theo dõi",
    doctor: "BS. CKI. Phạm Thị D",
    date: "05/07/2025",
    time: "14:00",
    status: "pending"
  }
];

const treatmentProgress = [
  {
    id: 1,
    type: "IUI",
    startDate: "15/05/2025",
    currentStage: "Tiêm kích thích buồng trứng",
    nextStage: "Theo dõi sự phát triển của nang trứng",
    nextDate: "22/06/2025",
    progress: 30,
    doctor: "TS. BS. Nguyễn Văn A",
    notes: "Đang phản ứng tốt với thuốc kích thích buồng trứng"
  }
];

const recentActivities = [
  {
    id: 1,
    type: "appointment",
    title: "Đặt lịch tư vấn",
    date: "10/06/2025",
    description: "Bạn đã đặt lịch tư vấn với TS. BS. Nguyễn Văn A"
  },
  {
    id: 2,
    type: "treatment",
    title: "Bắt đầu quy trình IUI",
    date: "15/05/2025",
    description: "Bạn đã bắt đầu quy trình điều trị IUI"
  },
  {
    id: 3,
    type: "result",
    title: "Kết quả xét nghiệm",
    date: "05/06/2025",
    description: "Bác sĩ đã cập nhật kết quả xét nghiệm nội tiết của bạn"
  }
];

const PatientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    // Giả lập API call
    setTimeout(() => {
      setPatientName("Nguyễn Thị A");
      setLoading(false);
    }, 500);
  }, []);

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
              <div>
                <p className="text-sm text-gray-500">Điều trị đang thực hiện</p>
                <p className="text-2xl font-bold text-gray-900">{treatmentProgress.length}</p>
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
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Lịch hẹn sắp tới</h2>
                <Link to="/patient/appointments" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-6">
                    <div className="flex items-start">
                      <div className="mr-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100' 
                            : 'bg-yellow-100'
                        }`}>
                          {appointment.status === 'confirmed' ? (
                            <CalendarCheck className={`h-6 w-6 ${
                              appointment.status === 'confirmed' 
                                ? 'text-green-600' 
                                : 'text-yellow-600'
                            }`} />
                          ) : (
                            <Clock className="h-6 w-6 text-yellow-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{appointment.service}</h3>
                            <p className="text-gray-600">{appointment.doctor}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-900 font-medium">{appointment.date}</p>
                            <p className="text-gray-600">{appointment.time}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                          </span>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="text-sm border-gray-300 text-gray-700">
                              Đổi lịch
                            </Button>
                            <Button size="sm" className="text-sm bg-blue-600 hover:bg-blue-700">
                              Chi tiết
                            </Button>
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
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Hoạt động gần đây</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-4">
                  <div className="flex">
                    <div className="mr-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'appointment' 
                          ? 'bg-blue-100' 
                          : activity.type === 'treatment' 
                            ? 'bg-green-100' 
                            : 'bg-purple-100'
                      }`}>
                        {activity.type === 'appointment' ? (
                          <Calendar className="h-5 w-5 text-blue-600" />
                        ) : activity.type === 'treatment' ? (
                          <FileText className="h-5 w-5 text-green-600" />
                        ) : (
                          <PieChart className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                      <p className="text-xs text-gray-500 mb-1">{activity.date}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Treatment Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Theo dõi điều trị</h2>
              <Link to="/patient/treatments" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          {treatmentProgress.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {treatmentProgress.map((treatment) => (
                <div key={treatment.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <div className="flex items-center">
                        <Bookmark className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Điều trị {treatment.type}</h3>
                      </div>
                      <p className="text-gray-600 mt-1">Bác sĩ: {treatment.doctor}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <p className="text-sm text-gray-500">Ngày bắt đầu: {treatment.startDate}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Tiến độ điều trị</span>
                      <span className="text-sm font-medium text-gray-700">{treatment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${treatment.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Giai đoạn hiện tại</p>
                      <p className="font-medium text-gray-900">{treatment.currentStage}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Giai đoạn tiếp theo</p>
                      <p className="font-medium text-gray-900">{treatment.nextStage}</p>
                      <p className="text-sm text-blue-600 mt-1">Ngày: {treatment.nextDate}</p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-700 font-medium mb-1">Ghi chú từ bác sĩ:</p>
                    <p className="text-gray-600">{treatment.notes}</p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Link to={`/patient/treatments/${treatment.id}`}>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Xem chi tiết điều trị
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">Bạn chưa có quá trình điều trị nào</p>
              <Link to="/services" className="mt-2 inline-block">
                <Button className="bg-blue-600 hover:bg-blue-700 mt-2">
                  Tìm hiểu dịch vụ
                </Button>
              </Link>
            </div>
          )}
        </motion.div>

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
