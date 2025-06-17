import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  CalendarClock,
  Calendar as CalendarIcon,
  Check,
  X,
  ClipboardList
} from "lucide-react";
import { Button } from "../../components/ui/button";

// Mock data for appointments
const allAppointments = [
  {
    id: 1,
    patientName: "Nguyễn Thị A",
    patientId: "PT10234",
    service: "Khám theo dõi",
    date: "16/06/2025",
    time: "09:30",
    status: "confirmed",
    type: "regular",
    history: true,
    notes: "Theo dõi kích thích buồng trứng"
  },
  {
    id: 2,
    patientName: "Trần Văn B",
    patientId: "PT10245",
    service: "Thụ tinh trong ống nghiệm (IVF)",
    date: "16/06/2025",
    time: "11:00",
    status: "confirmed",
    type: "treatment",
    history: true,
    notes: "Giai đoạn thu thập trứng"
  },
  {
    id: 3,
    patientName: "Lê Thị C",
    patientId: "PT10267",
    service: "Tư vấn ban đầu",
    date: "16/06/2025",
    time: "14:30",
    status: "waiting",
    type: "consultation",
    history: false,
    notes: "Lần đầu tư vấn về hiếm muộn"
  },
  {
    id: 4,
    patientName: "Phạm Văn D",
    patientId: "PT10289",
    service: "Thụ tinh trong tử cung (IUI)",
    date: "16/06/2025",
    time: "16:00",
    status: "confirmed",
    type: "treatment",
    history: true,
    notes: "Chuẩn bị cho quy trình IUI"
  },
  {
    id: 5,
    patientName: "Hoàng Thị E",
    patientId: "PT10302",
    service: "Khám theo dõi",
    date: "17/06/2025",
    time: "10:00",
    status: "confirmed",
    type: "regular",
    history: true,
    notes: "Theo dõi sau thụ tinh"
  },
  {
    id: 6,
    patientName: "Vũ Văn F",
    patientId: "PT10315",
    service: "Xét nghiệm nội tiết",
    date: "17/06/2025",
    time: "11:30",
    status: "confirmed",
    type: "test",
    history: false,
    notes: "Kiểm tra nội tiết tố"
  },
  {
    id: 7,
    patientName: "Đặng Thị G",
    patientId: "PT10330",
    service: "Siêu âm buồng trứng",
    date: "17/06/2025",
    time: "14:00",
    status: "waiting",
    type: "test",
    history: true,
    notes: "Theo dõi nang trứng"
  },
  {
    id: 8,
    patientName: "Ngô Văn H",
    patientId: "PT10342",
    service: "Tư vấn kết quả",
    date: "17/06/2025",
    time: "15:30",
    status: "confirmed",
    type: "consultation",
    history: true,
    notes: "Tư vấn kết quả xét nghiệm gần đây"
  },
  {
    id: 9,
    patientName: "Dương Thị I",
    patientId: "PT10355",
    service: "Thụ tinh trong ống nghiệm (IVF)",
    date: "18/06/2025",
    time: "09:00",
    status: "confirmed",
    type: "treatment",
    history: true,
    notes: "Chuẩn bị cho thu trứng"
  },
  {
    id: 10,
    patientName: "Bùi Văn K",
    patientId: "PT10367",
    service: "Tư vấn điều trị",
    date: "18/06/2025",
    time: "10:30",
    status: "waiting",
    type: "consultation",
    history: false,
    notes: "Tư vấn phương pháp điều trị phù hợp"
  }
];

const DoctorAppointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
  
  const appointmentsPerPage = 5;

  // Filter appointments
  const filteredAppointments = allAppointments.filter((appointment) => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = selectedDate ? appointment.date === selectedDate : true;
    const matchesStatus = selectedStatus ? appointment.status === selectedStatus : true;
    const matchesType = selectedType ? appointment.type === selectedType : true;
    
    return matchesSearch && matchesDate && matchesStatus && matchesType;
  });

  // Get current appointments for pagination
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const pageCount = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDate(null);
    setSelectedStatus(null);
    setSelectedType(null);
    setCurrentPage(1);
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý lịch hẹn</h1>
            <p className="mt-1 text-gray-600">
              Xem và quản lý tất cả các lịch hẹn với bệnh nhân
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <CalendarClock className="mr-2 h-4 w-4" />
              Tạo lịch hẹn mới
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Tìm kiếm bệnh nhân theo tên, ID hoặc dịch vụ..."
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedDate || ""}
                onChange={(e) => setSelectedDate(e.target.value || null)}
                className="block border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả ngày</option>
                <option value="16/06/2025">16/06/2025</option>
                <option value="17/06/2025">17/06/2025</option>
                <option value="18/06/2025">18/06/2025</option>
              </select>
              
              <select
                value={selectedStatus || ""}
                onChange={(e) => setSelectedStatus(e.target.value || null)}
                className="block border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="waiting">Đang chờ</option>
              </select>
              
              <select
                value={selectedType || ""}
                onChange={(e) => setSelectedType(e.target.value || null)}
                className="block border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả loại</option>
                <option value="regular">Khám thường</option>
                <option value="treatment">Điều trị</option>
                <option value="consultation">Tư vấn</option>
                <option value="test">Xét nghiệm</option>
              </select>
              
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="border-gray-300 text-gray-700"
              >
                <Filter className="mr-2 h-4 w-4" />
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Lịch hẹn theo ngày</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-gray-300">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-gray-700">Tháng 6, 2025</span>
              <Button variant="outline" size="sm" className="border-gray-300">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
              <div key={index} className="text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 0 + 1; // Assuming June 1, 2025 starts on a Sunday
              const formattedDay = day <= 30 && day > 0 ? `${day < 10 ? '0' : ''}${day}/06/2025` : '';
              
              const isToday = day === 16; // Today is June 16
              const hasAppointment = day <= 30 && day > 0 && allAppointments.some(a => a.date === formattedDay);
              
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(formattedDay || null)}
                  disabled={day <= 0 || day > 30}
                  className={`
                    h-12 rounded-md flex flex-col items-center justify-center 
                    ${day <= 0 || day > 30 ? 'text-gray-300' : 'text-gray-800'} 
                    ${isToday ? 'border-2 border-blue-500' : 'border border-gray-200'} 
                    ${hasAppointment ? 'bg-blue-50' : ''}
                    ${selectedDate === formattedDay ? 'bg-blue-100' : ''}
                    hover:bg-gray-50 focus:outline-none
                  `}
                >
                  <span>{day > 0 && day <= 30 ? day : ''}</span>
                  {hasAppointment && (
                    <span className="w-1.5 h-1.5 mt-0.5 rounded-full bg-blue-600"></span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Appointments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Danh sách lịch hẹn {selectedDate ? `(${selectedDate})` : ''}
              </h2>
              <span className="text-sm text-gray-500">
                Hiển thị {currentAppointments.length} trong số {filteredAppointments.length} lịch hẹn
              </span>
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
                    Dịch vụ
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày & Giờ
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ghi chú
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentAppointments.map((appointment) => (
                  <tr 
                    key={appointment.id} 
                    onClick={() => setSelectedAppointment(appointment.id === selectedAppointment ? null : appointment.id)}
                    className={`hover:bg-gray-50 cursor-pointer ${appointment.id === selectedAppointment ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                          <div className="text-sm text-gray-500">ID: {appointment.patientId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{appointment.service}</div>
                      <div className="text-xs text-gray-500">
                        {appointment.type === 'regular' && 'Khám thường'}
                        {appointment.type === 'treatment' && 'Điều trị'}
                        {appointment.type === 'consultation' && 'Tư vấn'}
                        {appointment.type === 'test' && 'Xét nghiệm'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{appointment.date}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{appointment.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status === 'confirmed' ? 'Đã xác nhận' : 'Đang chờ'}
                      </span>
                      {appointment.history && (
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <ClipboardList className="h-3 w-3 mr-1" />
                          <span>Có lịch sử</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{appointment.notes}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" className="text-sm border-gray-300 text-gray-700">
                          Xem hồ sơ
                        </Button>
                        <Button size="sm" className="text-sm bg-blue-600 hover:bg-blue-700">
                          {appointment.status === 'waiting' ? 'Xác nhận' : 'Bắt đầu khám'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentAppointments.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-gray-500">Không tìm thấy lịch hẹn nào phù hợp với bộ lọc</p>
              <Button onClick={resetFilters} className="mt-2 bg-blue-600 hover:bg-blue-700">
                Xóa bộ lọc
              </Button>
            </div>
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="text-sm border-gray-300 text-gray-700"
                >
                  Trước
                </Button>
                <Button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === pageCount}
                  variant="outline"
                  className="ml-3 text-sm border-gray-300 text-gray-700"
                >
                  Sau
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{indexOfFirstAppointment + 1}</span> đến{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastAppointment, filteredAppointments.length)}
                    </span>{' '}
                    trong số <span className="font-medium">{filteredAppointments.length}</span> lịch hẹn
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {Array.from({ length: pageCount }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === i + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        } text-sm font-medium`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === pageCount}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Appointment Actions */}
        {selectedAppointment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Hành động nhanh cho lịch hẹn #{selectedAppointment}
              </h3>
              <button onClick={() => setSelectedAppointment(null)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                <Clock className="mr-2 h-4 w-4" />
                Đổi lịch hẹn
              </Button>
              <Button variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                <X className="mr-2 h-4 w-4" />
                Hủy lịch hẹn
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Check className="mr-2 h-4 w-4" />
                Xác nhận lịch hẹn
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
