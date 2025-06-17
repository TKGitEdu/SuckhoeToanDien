import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Clock,
  FileText,
  ArrowRight,
  Phone,
  Mail,
  HeartPulse,
  ClipboardList,
  CalendarClock
} from "lucide-react";
import { Button } from "../../components/ui/button";

// Mock data for patients
const allPatients = [
  {
    id: "PT10234",
    name: "Nguyễn Thị A",
    age: 32,
    gender: "Nữ",
    phone: "0912345678",
    email: "nguyena@example.com",
    treatmentType: "IUI",
    treatmentStage: "Tiêm kích thích buồng trứng",
    lastVisit: "10/06/2025",
    nextVisit: "20/06/2025",
    progressPercentage: 30,
    treatmentCount: 1,
    medicalHistory: "Không có bệnh nền",
    note: "Đang phản ứng tốt với thuốc kích thích buồng trứng"
  },
  {
    id: "PT10245",
    name: "Trần Văn B",
    age: 35,
    gender: "Nam",
    phone: "0923456789",
    email: "tranb@example.com",
    treatmentType: "IVF",
    treatmentStage: "Thu thập trứng",
    lastVisit: "12/06/2025",
    nextVisit: "18/06/2025",
    progressPercentage: 45,
    treatmentCount: 2,
    medicalHistory: "Tiền sử phẫu thuật tinh hoàn",
    note: "Đã hoàn thành kích thích buồng trứng, chuẩn bị thu trứng"
  },
  {
    id: "PT10267",
    name: "Lê Thị C",
    age: 29,
    gender: "Nữ",
    phone: "0934567890",
    email: "lec@example.com",
    treatmentType: "Tư vấn ban đầu",
    treatmentStage: "Chưa bắt đầu điều trị",
    lastVisit: "15/06/2025",
    nextVisit: "25/06/2025",
    progressPercentage: 0,
    treatmentCount: 0,
    medicalHistory: "Không có",
    note: "Cần xét nghiệm nội tiết và siêu âm buồng trứng"
  },
  {
    id: "PT10289",
    name: "Phạm Văn D",
    age: 38,
    gender: "Nam",
    phone: "0945678901",
    email: "phamd@example.com",
    treatmentType: "IUI",
    treatmentStage: "Chuẩn bị cho quy trình IUI",
    lastVisit: "14/06/2025",
    nextVisit: "24/06/2025",
    progressPercentage: 20,
    treatmentCount: 1,
    medicalHistory: "Tiền sử hút thuốc",
    note: "Đã ngừng hút thuốc 3 tháng, kết quả tinh trùng cải thiện"
  },
  {
    id: "PT10302",
    name: "Hoàng Thị E",
    age: 34,
    gender: "Nữ",
    phone: "0956789012",
    email: "hoange@example.com",
    treatmentType: "IVF",
    treatmentStage: "Theo dõi sau chuyển phôi",
    lastVisit: "08/06/2025",
    nextVisit: "18/06/2025",
    progressPercentage: 70,
    treatmentCount: 1,
    medicalHistory: "Lạc nội mạc tử cung",
    note: "Đã chuyển phôi thành công, đang theo dõi"
  },
  {
    id: "PT10315",
    name: "Vũ Văn F",
    age: 36,
    gender: "Nam",
    phone: "0967890123",
    email: "vuf@example.com",
    treatmentType: "Xét nghiệm nội tiết",
    treatmentStage: "Đánh giá ban đầu",
    lastVisit: "13/06/2025",
    nextVisit: "23/06/2025",
    progressPercentage: 10,
    treatmentCount: 0,
    medicalHistory: "Không có",
    note: "Cần đánh giá chất lượng tinh trùng"
  },
  {
    id: "PT10330",
    name: "Đặng Thị G",
    age: 31,
    gender: "Nữ",
    phone: "0978901234",
    email: "dangg@example.com",
    treatmentType: "IUI",
    treatmentStage: "Theo dõi nang trứng",
    lastVisit: "11/06/2025",
    nextVisit: "17/06/2025",
    progressPercentage: 40,
    treatmentCount: 1,
    medicalHistory: "Không có",
    note: "Nang trứng phát triển tốt, chuẩn bị cho IUI"
  },
  {
    id: "PT10342",
    name: "Ngô Văn H",
    age: 39,
    gender: "Nam",
    phone: "0989012345",
    email: "ngoh@example.com",
    treatmentType: "Tư vấn kết quả",
    treatmentStage: "Đánh giá trước điều trị",
    lastVisit: "09/06/2025",
    nextVisit: "19/06/2025",
    progressPercentage: 5,
    treatmentCount: 0,
    medicalHistory: "Biến chứng sau phẫu thuật ruột thừa",
    note: "Đã có kết quả xét nghiệm, cần tư vấn phương pháp điều trị"
  },
  {
    id: "PT10355",
    name: "Dương Thị I",
    age: 33,
    gender: "Nữ",
    phone: "0990123456",
    email: "duongi@example.com",
    treatmentType: "IVF",
    treatmentStage: "Chuẩn bị thu trứng",
    lastVisit: "07/06/2025",
    nextVisit: "17/06/2025",
    progressPercentage: 35,
    treatmentCount: 1,
    medicalHistory: "Thừa cân",
    note: "Kích thích buồng trứng thành công, có nhiều nang trứng"
  },
  {
    id: "PT10367",
    name: "Bùi Văn K",
    age: 37,
    gender: "Nam",
    phone: "0901234567",
    email: "buik@example.com",
    treatmentType: "Tư vấn điều trị",
    treatmentStage: "Chưa bắt đầu điều trị",
    lastVisit: "06/06/2025",
    nextVisit: "16/06/2025",
    progressPercentage: 0,
    treatmentCount: 0,
    medicalHistory: "Tiểu đường type 2",
    note: "Cần kiểm soát đường huyết trước khi bắt đầu điều trị"
  }
];

const DoctorPatients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  const patientsPerPage = 5;

  // Filter patients
  const filteredPatients = allPatients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);
    
    const matchesTreatment = selectedTreatment ? patient.treatmentType.includes(selectedTreatment) : true;
    const matchesStage = selectedStage ? patient.treatmentStage.includes(selectedStage) : true;
    
    return matchesSearch && matchesTreatment && matchesStage;
  });

  // Get current patients for pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const pageCount = Math.ceil(filteredPatients.length / patientsPerPage);

  // Get selected patient details
  const selectedPatient = allPatients.find(patient => patient.id === selectedPatientId);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedTreatment(null);
    setSelectedStage(null);
    setCurrentPage(1);
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý bệnh nhân</h1>
            <p className="mt-1 text-gray-600">
              Xem và quản lý thông tin của tất cả bệnh nhân đang điều trị
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <User className="mr-2 h-4 w-4" />
              Thêm bệnh nhân mới
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
                  placeholder="Tìm kiếm bệnh nhân theo tên, ID, email hoặc số điện thoại..."
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedTreatment || ""}
                onChange={(e) => setSelectedTreatment(e.target.value || null)}
                className="block border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả phương pháp</option>
                <option value="IUI">IUI</option>
                <option value="IVF">IVF</option>
                <option value="Tư vấn">Tư vấn</option>
                <option value="Xét nghiệm">Xét nghiệm</option>
              </select>
              
              <select
                value={selectedStage || ""}
                onChange={(e) => setSelectedStage(e.target.value || null)}
                className="block border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả giai đoạn</option>
                <option value="Chuẩn bị">Chuẩn bị</option>
                <option value="Tiêm kích thích">Tiêm kích thích</option>
                <option value="Thu thập trứng">Thu thập trứng</option>
                <option value="Theo dõi">Theo dõi</option>
                <option value="Chưa bắt đầu">Chưa bắt đầu điều trị</option>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patients List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Danh sách bệnh nhân</h2>
                <span className="text-sm text-gray-500">
                  Hiển thị {currentPatients.length} trong số {filteredPatients.length} bệnh nhân
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
                      Thông tin liên hệ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Điều trị
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cuộc hẹn
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPatients.map((patient) => (
                    <tr 
                      key={patient.id} 
                      onClick={() => setSelectedPatientId(patient.id === selectedPatientId ? null : patient.id)}
                      className={`hover:bg-gray-50 cursor-pointer ${patient.id === selectedPatientId ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                            <div className="text-sm text-gray-500">
                              ID: {patient.id} · {patient.age} tuổi · {patient.gender}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900 mb-1">
                          <Phone className="h-4 w-4 text-gray-400 mr-1" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-4 w-4 text-gray-400 mr-1" />
                          {patient.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 mb-1">{patient.treatmentType}</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${patient.progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {patient.treatmentStage}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span>Gần nhất: {patient.lastVisit}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 text-blue-500 mr-1" />
                          <span className="font-medium">{patient.nextVisit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {currentPatients.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-gray-500">Không tìm thấy bệnh nhân nào phù hợp với bộ lọc</p>
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
                      Hiển thị <span className="font-medium">{indexOfFirstPatient + 1}</span> đến{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastPatient, filteredPatients.length)}
                      </span>{' '}
                      trong số <span className="font-medium">{filteredPatients.length}</span> bệnh nhân
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

          {/* Patient Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {selectedPatient ? (
              <div>
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Thông tin chi tiết</h2>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedPatient.name}</h3>
                      <p className="text-gray-500">ID: {selectedPatient.id} · {selectedPatient.age} tuổi · {selectedPatient.gender}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Thông tin liên hệ</h4>
                      <div className="flex items-center mb-2">
                        <Phone className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-900">{selectedPatient.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-900">{selectedPatient.email}</span>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Thông tin điều trị</h4>
                      <p className="text-gray-900 font-medium mb-1">{selectedPatient.treatmentType}</p>
                      <p className="text-gray-700 mb-2">{selectedPatient.treatmentStage}</p>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tiến độ</span>
                          <span>{selectedPatient.progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${selectedPatient.progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <ClipboardList className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">Số lần điều trị: {selectedPatient.treatmentCount}</span>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Lịch hẹn</h4>
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">Gần nhất: {selectedPatient.lastVisit}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-gray-900 font-medium">Tiếp theo: {selectedPatient.nextVisit}</span>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Tiền sử bệnh</h4>
                      <div className="flex items-center">
                        <HeartPulse className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-700">{selectedPatient.medicalHistory}</span>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Ghi chú</h4>
                      <p className="text-gray-700">{selectedPatient.note}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <FileText className="mr-2 h-4 w-4" />
                      Xem hồ sơ đầy đủ
                    </Button>
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700">
                      <CalendarClock className="mr-2 h-4 w-4" />
                      Đặt lịch hẹn mới
                    </Button>
                    <Link to={`/doctor/treatment-records/${selectedPatient.id}`} className="block">
                      <Button variant="outline" className="w-full border-gray-300 text-gray-700">
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Xem lịch sử điều trị
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Chọn bệnh nhân</h3>
                <p className="text-gray-500">
                  Chọn một bệnh nhân từ danh sách để xem thông tin chi tiết
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-8 bg-blue-50 rounded-xl shadow-sm border border-blue-100 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Truy cập nhanh</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link to="/doctor/appointments" className="block">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Lịch hẹn hôm nay</h3>
                      <p className="text-sm text-gray-600">4 cuộc hẹn</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-blue-600 text-sm font-medium">
                    Xem lịch <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
              
              <Link to="/doctor/treatment-records" className="block">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Hồ sơ điều trị</h3>
                      <p className="text-sm text-gray-600">7 hồ sơ đang xử lý</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-blue-600 text-sm font-medium">
                    Xem hồ sơ <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Kết quả xét nghiệm</h3>
                    <p className="text-sm text-gray-600">2 kết quả đang chờ</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <ClipboardList className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-blue-600 text-sm font-medium">
                  Xem kết quả <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Lịch làm việc</h3>
                    <p className="text-sm text-gray-600">Xem & quản lý lịch</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <CalendarClock className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-blue-600 text-sm font-medium">
                  Xem lịch <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorPatients;
