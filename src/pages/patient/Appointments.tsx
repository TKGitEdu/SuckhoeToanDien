import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  User,
  CalendarX,
  FileText
} from "lucide-react";
import { Button } from "../../components/ui/button";

// Giả lập dữ liệu lịch hẹn
const appointmentsData = [
  {
    id: "AP001",
    service: "Thụ tinh trong tử cung (IUI)",
    doctor: "TS. BS. Nguyễn Văn A",
    date: "20/06/2025",
    time: "09:30",
    status: "upcoming", // upcoming, completed, cancelled
    location: "Phòng khám 03, Tầng 2",
    notes: "Mang theo kết quả xét nghiệm hormone gần nhất.",
    canCancel: true
  },
  {
    id: "AP002",
    service: "Khám theo dõi",
    doctor: "BS. CKI. Phạm Thị D",
    date: "05/07/2025",
    time: "14:00",
    status: "upcoming",
    location: "Phòng khám 05, Tầng 2",
    notes: "Khám theo dõi sau 2 tuần sử dụng thuốc.",
    canCancel: true
  },
  {
    id: "AP003",
    service: "Tư vấn IVF",
    doctor: "PGS. TS. Trần Thị B",
    date: "01/05/2025",
    time: "10:30",
    status: "completed",
    location: "Phòng tư vấn 02, Tầng 1",
    notes: "Đã tư vấn về quy trình IVF và chi phí điều trị.",
    feedback: {
      rating: 5,
      comment: "Bác sĩ tư vấn rất tận tình và chi tiết."
    }
  },
  {
    id: "AP004",
    service: "Xét nghiệm hormone",
    doctor: "TS. BS. Lê Văn C",
    date: "15/05/2025",
    time: "08:00",
    status: "completed",
    location: "Phòng xét nghiệm, Tầng 1",
    notes: "Đã thực hiện xét nghiệm hormone theo chỉ định.",
    feedback: {
      rating: 4,
      comment: "Quy trình nhanh gọn, nhân viên thân thiện."
    }
  },
  {
    id: "AP005",
    service: "Siêu âm theo dõi",
    doctor: "BS. CKI. Phạm Thị D",
    date: "10/04/2025",
    time: "15:30",
    status: "cancelled",
    location: "Phòng siêu âm 03, Tầng 2",
    cancellationReason: "Bệnh nhân không thể đến theo lịch hẹn vì lý do cá nhân."
  }
];

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  useEffect(() => {
    // Giả lập API call
    setTimeout(() => {
      setAppointments(appointmentsData);
      setLoading(false);
    }, 500);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filtering is done in filteredAppointments
  };
  
  const handleCancel = (id: string) => {
    const confirmCancel = window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?");
    
    if (confirmCancel) {
      // Giả lập API call
      setTimeout(() => {
        const updatedAppointments = appointments.map(appointment => 
          appointment.id === id 
            ? { ...appointment, status: "cancelled", cancellationReason: "Hủy bởi bệnh nhân.", canCancel: false } 
            : appointment
        );
        setAppointments(updatedAppointments);
        alert("Lịch hẹn đã được hủy thành công!");
      }, 500);
    }
  };
  
  const handleReschedule = (id: string) => {
    alert(`Chức năng đổi lịch sẽ được phát triển trong phiên bản tiếp theo! (ID: ${id})`);
  };
  
  const handleFeedback = (id: string) => {
    alert(`Chức năng đánh giá sẽ được phát triển trong phiên bản tiếp theo! (ID: ${id})`);
  };
  
  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      activeFilter === "all" || 
      (activeFilter === "upcoming" && appointment.status === "upcoming") ||
      (activeFilter === "completed" && appointment.status === "completed") ||
      (activeFilter === "cancelled" && appointment.status === "cancelled");
    
    return matchesSearch && matchesFilter;
  });
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý lịch hẹn</h1>
          <Link to="/booking">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Đặt lịch mới
            </Button>
          </Link>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveFilter("upcoming")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "upcoming"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Sắp tới
              </button>
              <button
                onClick={() => setActiveFilter("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "completed"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Đã hoàn thành
              </button>
              <button
                onClick={() => setActiveFilter("cancelled")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "cancelled"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Đã hủy
              </button>
            </div>
            
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm theo dịch vụ, bác sĩ, mã lịch hẹn..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Tìm kiếm
              </Button>
            </form>
          </div>
        </div>
        
        {/* Appointments List */}
        {currentItems.length > 0 ? (
          <div className="space-y-4 mb-8">
            {currentItems.map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start mb-4 md:mb-0">
                      <div className="mr-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          appointment.status === 'upcoming' 
                            ? 'bg-blue-100' 
                            : appointment.status === 'completed'
                              ? 'bg-green-100'
                              : 'bg-red-100'
                        }`}>
                          {appointment.status === 'upcoming' ? (
                            <Clock className={`h-6 w-6 text-blue-600`} />
                          ) : appointment.status === 'completed' ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-600" />
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold text-gray-900">{appointment.service}</h3>
                          <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'upcoming' 
                              ? 'bg-blue-100 text-blue-800' 
                              : appointment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {appointment.status === 'upcoming' 
                              ? 'Sắp tới' 
                              : appointment.status === 'completed'
                                ? 'Đã hoàn thành'
                                : 'Đã hủy'}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">Bác sĩ: {appointment.doctor}</p>
                        <div className="flex items-center mt-2 text-gray-500 text-sm">
                          <span className="flex items-center mr-4">
                            <Calendar className="h-4 w-4 mr-1" /> {appointment.date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" /> {appointment.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end">
                      <p className="text-sm text-gray-500 mb-2">Mã lịch hẹn: {appointment.id}</p>
                      <p className="text-sm text-gray-500 mb-3">{appointment.location}</p>
                      
                      {appointment.status === 'upcoming' && (
                        <div className="flex space-x-2">
                          {appointment.canCancel && (
                            <Button 
                              onClick={() => handleCancel(appointment.id)}
                              variant="outline" 
                              size="sm" 
                              className="border-red-600 text-red-600 hover:bg-red-50"
                            >
                              Hủy lịch
                            </Button>
                          )}
                          <Button 
                            onClick={() => handleReschedule(appointment.id)}
                            variant="outline" 
                            size="sm" 
                            className="border-blue-600 text-blue-600"
                          >
                            Đổi lịch
                          </Button>
                        </div>
                      )}
                      
                      {appointment.status === 'completed' && !appointment.feedback && (
                        <Button 
                          onClick={() => handleFeedback(appointment.id)}
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Đánh giá
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className={`mt-4 p-3 rounded-lg ${
                    appointment.status === 'upcoming' 
                      ? 'bg-blue-50 border border-blue-100' 
                      : appointment.status === 'completed'
                        ? 'bg-green-50 border border-green-100'
                        : 'bg-red-50 border border-red-100'
                  }`}>
                    <div className="flex items-start">
                      <div className="mr-3">
                        {appointment.status === 'upcoming' ? (
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                        ) : appointment.status === 'completed' ? (
                          <FileText className="h-5 w-5 text-green-600" />
                        ) : (
                          <CalendarX className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${
                          appointment.status === 'upcoming' 
                            ? 'text-blue-800' 
                            : appointment.status === 'completed'
                              ? 'text-green-800'
                              : 'text-red-800'
                        }`}>
                          {appointment.status === 'upcoming' 
                            ? 'Thông tin lịch hẹn' 
                            : appointment.status === 'completed'
                              ? 'Ghi chú từ bác sĩ'
                              : 'Lý do hủy'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {appointment.status === 'upcoming' 
                            ? appointment.notes 
                            : appointment.status === 'completed'
                              ? appointment.notes
                              : appointment.cancellationReason}
                        </p>
                        
                        {appointment.status === 'completed' && appointment.feedback && (
                          <div className="mt-2 pt-2 border-t border-green-200">
                            <p className="text-sm font-medium text-green-800">Đánh giá của bạn:</p>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`text-${i < appointment.feedback.rating ? 'yellow' : 'gray'}-500`}>★</span>
                                ))}
                              </div>
                              <p className="ml-2 text-sm text-gray-600">{appointment.feedback.comment}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy lịch hẹn</h3>
            <p className="text-gray-500 mb-6">
              {activeFilter === "all" 
                ? "Bạn chưa có lịch hẹn nào. Hãy đặt lịch ngay để được tư vấn và điều trị." 
                : `Không tìm thấy lịch hẹn nào ở trạng thái "${
                    activeFilter === "upcoming" 
                      ? "sắp tới" 
                      : activeFilter === "completed" 
                        ? "đã hoàn thành" 
                        : "đã hủy"
                  }".`}
            </p>
            <Link to="/booking">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Đặt lịch ngay
              </Button>
            </Link>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        
        {/* Instructions */}
        <div className="mt-10 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hướng dẫn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Lịch hẹn sắp tới</p>
                <p className="text-sm text-gray-600">Vui lòng đến trước 15 phút để hoàn tất thủ tục đăng ký.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Hủy lịch hẹn</p>
                <p className="text-sm text-gray-600">Vui lòng hủy lịch hẹn ít nhất 24 giờ trước giờ hẹn.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Đánh giá</p>
                <p className="text-sm text-gray-600">Hãy đánh giá trải nghiệm của bạn sau mỗi lần khám để chúng tôi cải thiện dịch vụ.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Đổi lịch hẹn</p>
                <p className="text-sm text-gray-600">Bạn có thể đổi lịch hẹn tối đa 2 lần cho mỗi lịch đã đặt.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;
