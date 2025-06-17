import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  ClipboardCheck,
  Clock,
  ArrowRight,
  CalendarCheck,
  UserRound,
  LineChart,
  FileText
} from "lucide-react";
import { Button } from "../../components/ui/button";

// Mock data for today's appointments
const todaysAppointments = [
  {
    id: 1,
    patientName: "Nguyễn Thị A",
    patientId: "PT10234",
    service: "Khám theo dõi",
    time: "09:30",
    status: "confirmed"
  },
  {
    id: 2,
    patientName: "Trần Văn B",
    patientId: "PT10245",
    service: "Thụ tinh trong ống nghiệm (IVF)",
    time: "11:00",
    status: "confirmed"
  },
  {
    id: 3,
    patientName: "Lê Thị C",
    patientId: "PT10267",
    service: "Tư vấn ban đầu",
    time: "14:30",
    status: "waiting"
  },
  {
    id: 4,
    patientName: "Phạm Văn D",
    patientId: "PT10289",
    service: "Thụ tinh trong tử cung (IUI)",
    time: "16:00",
    status: "confirmed"
  }
];

// Mock data for recent treatment updates
const recentTreatmentUpdates = [
  {
    id: 1,
    patientName: "Nguyễn Thị A",
    patientId: "PT10234",
    treatmentType: "IUI",
    currentStage: "Tiêm kích thích buồng trứng",
    lastUpdate: "10/06/2025",
    nextAppointment: "20/06/2025"
  },
  {
    id: 2,
    patientName: "Trần Văn B",
    patientId: "PT10245",
    treatmentType: "IVF",
    currentStage: "Thu thập trứng",
    lastUpdate: "12/06/2025",
    nextAppointment: "18/06/2025"
  }
];

// Mock data for waiting test results
const waitingTestResults = [
  {
    id: 1,
    patientName: "Lê Thị C",
    patientId: "PT10267",
    testType: "Xét nghiệm nội tiết",
    requestDate: "12/06/2025",
    status: "pending"
  },
  {
    id: 2,
    patientName: "Phạm Văn D",
    patientId: "PT10289",
    testType: "Siêu âm buồng trứng",
    requestDate: "14/06/2025",
    status: "pending"
  }
];

// Mock data for notifications
const notifications = [
  {
    id: 1,
    type: "appointment",
    message: "Bệnh nhân Nguyễn Thị A đã xác nhận lịch hẹn ngày 20/06/2025",
    time: "1 giờ trước"
  },
  {
    id: 2,
    type: "test",
    message: "Kết quả xét nghiệm của bệnh nhân Trần Văn B đã có",
    time: "3 giờ trước"
  },
  {
    id: 3,
    type: "treatment",
    message: "Đã cập nhật quy trình điều trị cho bệnh nhân Lê Thị C",
    time: "5 giờ trước"
  }
];

const DoctorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState("");
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming'>('today');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDoctorName("TS. BS. Nguyễn Văn A");
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
          <h1 className="text-3xl font-bold text-gray-900">Xin chào, {doctorName}!</h1>
          <p className="mt-1 text-gray-600">
            Chào mừng đến với bảng điều khiển bác sĩ. Quản lý lịch hẹn, bệnh nhân và cập nhật điều trị.
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
                <p className="text-sm text-gray-500">Lịch hẹn hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">{todaysAppointments.length}</p>
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
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bệnh nhân đang điều trị</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
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
                <ClipboardCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Chờ kết quả xét nghiệm</p>
                <p className="text-2xl font-bold text-gray-900">{waitingTestResults.length}</p>
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
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Thời gian trung bình/cuộc hẹn</p>
                <p className="text-2xl font-bold text-gray-900">30 phút</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Lịch hẹn</h2>
                <Link to="/doctor/appointments" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="mt-4 flex space-x-4 border-b">
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
              {todaysAppointments.length > 0 ? (
                todaysAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-6">
                    <div className="flex items-start">
                      <div className="mr-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100' 
                            : appointment.status === 'waiting'
                            ? 'bg-yellow-100'
                            : 'bg-gray-100'
                        }`}>
                          {appointment.status === 'confirmed' ? (
                            <CalendarCheck className="h-6 w-6 text-green-600" />
                          ) : appointment.status === 'waiting' ? (
                            <Clock className="h-6 w-6 text-yellow-600" />
                          ) : (
                            <UserRound className="h-6 w-6 text-gray-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{appointment.patientName}</h3>
                            <div className="flex items-center text-gray-600">
                              <span className="text-sm mr-2">ID: {appointment.patientId}</span>
                              <span className="text-sm">{appointment.service}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-900 font-medium">{appointment.time}</p>
                            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              appointment.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : appointment.status === 'waiting'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {appointment.status === 'confirmed' 
                                ? 'Đã xác nhận' 
                                : appointment.status === 'waiting'
                                ? 'Đang chờ'
                                : 'Chưa xác nhận'}
                            </span>
                          </div>
                        </div>
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
                  <p className="text-gray-500">Không có lịch hẹn nào cho hôm nay</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Thông báo</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-4 hover:bg-gray-50">
                  <div className="flex">
                    <div className="mr-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        notification.type === 'appointment' 
                          ? 'bg-blue-100' 
                          : notification.type === 'test' 
                            ? 'bg-purple-100' 
                            : 'bg-green-100'
                      }`}>
                        {notification.type === 'appointment' ? (
                          <Calendar className="h-5 w-5 text-blue-600" />
                        ) : notification.type === 'test' ? (
                          <ClipboardCheck className="h-5 w-5 text-purple-600" />
                        ) : (
                          <FileText className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-4 text-center">
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  Xem tất cả thông báo
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Treatment Updates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Cập nhật điều trị gần đây</h2>
              <Link to="/doctor/treatment-records" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bệnh nhân
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phương pháp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giai đoạn hiện tại
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cập nhật cuối
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lịch hẹn tiếp theo
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTreatmentUpdates.map((update) => (
                  <tr key={update.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{update.patientName}</div>
                          <div className="text-sm text-gray-500">ID: {update.patientId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{update.treatmentType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{update.currentStage}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {update.lastUpdate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {update.nextAppointment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/doctor/treatment-records/${update.id}`} className="text-blue-600 hover:text-blue-900">
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Waiting Test Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Kết quả xét nghiệm đang chờ</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bệnh nhân
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại xét nghiệm
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày yêu cầu
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {waitingTestResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{result.patientName}</div>
                          <div className="text-sm text-gray-500">ID: {result.patientId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.testType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.requestDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Đang chờ
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        Nhập kết quả
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-8 bg-blue-50 rounded-xl shadow-sm border border-blue-100 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <LineChart className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Hiệu suất tháng này</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Tổng bệnh nhân</p>
                <p className="text-2xl font-bold text-gray-900">28</p>
                <p className="text-xs text-green-600 mt-1">+12% so với tháng trước</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Tỷ lệ thành công</p>
                <p className="text-2xl font-bold text-gray-900">67%</p>
                <p className="text-xs text-green-600 mt-1">+5% so với tháng trước</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Đánh giá từ bệnh nhân</p>
                <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                <p className="text-xs text-green-600 mt-1">+0.2 so với tháng trước</p>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Link to="/doctor/performance" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                Xem báo cáo chi tiết
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
