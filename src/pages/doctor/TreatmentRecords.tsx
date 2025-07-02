import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
  Calendar,
  User,
  ArrowRight,
  Pill,
  Activity,
  CalendarClock,
  Check,
  ClipboardList,
  FileBarChart,
  ListTodo,
  AlertCircle
} from "lucide-react";
import { Button } from "../../components/ui/button";

// Mock data for treatment records
const treatmentRecords = [
  {
    id: 1,
    patientName: "Nguyễn Thị A",
    patientId: "PT10234",
    treatmentType: "IUI",
    currentStage: "Tiêm kích thích buồng trứng",
    startDate: "15/05/2025",
    lastUpdate: "10/06/2025",
    nextStage: "Theo dõi sự phát triển của nang trứng",
    nextDate: "20/06/2025",
    progress: 30,
    doctor: "TS. BS. Nguyễn Văn A",
    status: "active",
    medications: [
      { name: "Gonal-F", dosage: "150 IU", frequency: "Mỗi ngày", duration: "10 ngày" },
      { name: "Orgalutran", dosage: "0.25mg", frequency: "Mỗi ngày", duration: "5 ngày" }
    ],
    appointments: [
      { date: "15/05/2025", type: "Khám ban đầu", status: "completed" },
      { date: "25/05/2025", type: "Siêu âm theo dõi", status: "completed" },
      { date: "05/06/2025", type: "Xét nghiệm nội tiết", status: "completed" },
      { date: "10/06/2025", type: "Theo dõi nang trứng", status: "completed" },
      { date: "20/06/2025", type: "Theo dõi nang trứng", status: "scheduled" }
    ],
    tests: [
      { date: "15/05/2025", type: "Xét nghiệm nội tiết cơ bản", result: "Trong giới hạn bình thường" },
      { date: "05/06/2025", type: "Xét nghiệm nội tiết theo dõi", result: "Estradiol tăng, phù hợp với kích thích buồng trứng" }
    ],
    notes: "Đang phản ứng tốt với thuốc kích thích buồng trứng"
  },
  {
    id: 2,
    patientName: "Trần Văn B",
    patientId: "PT10245",
    treatmentType: "IVF",
    currentStage: "Thu thập trứng",
    startDate: "01/05/2025",
    lastUpdate: "12/06/2025",
    nextStage: "Thụ tinh trong phòng thí nghiệm",
    nextDate: "18/06/2025",
    progress: 45,
    doctor: "TS. BS. Nguyễn Văn A",
    status: "active",
    medications: [
      { name: "Gonal-F", dosage: "225 IU", frequency: "Mỗi ngày", duration: "12 ngày" },
      { name: "Menopur", dosage: "75 IU", frequency: "Mỗi ngày", duration: "12 ngày" },
      { name: "Cetrotide", dosage: "0.25mg", frequency: "Mỗi ngày", duration: "5 ngày" }
    ],
    appointments: [
      { date: "01/05/2025", type: "Khám ban đầu", status: "completed" },
      { date: "15/05/2025", type: "Siêu âm theo dõi", status: "completed" },
      { date: "01/06/2025", type: "Xét nghiệm nội tiết", status: "completed" },
      { date: "12/06/2025", type: "Theo dõi nang trứng", status: "completed" },
      { date: "18/06/2025", type: "Thu thập trứng", status: "scheduled" }
    ],
    tests: [
      { date: "01/05/2025", type: "Xét nghiệm nội tiết cơ bản", result: "Trong giới hạn bình thường" },
      { date: "01/06/2025", type: "Xét nghiệm nội tiết theo dõi", result: "Estradiol 1500 pg/mL, LH 1.5 mIU/mL" },
      { date: "12/06/2025", type: "Siêu âm buồng trứng", result: "12 nang trứng >14mm, lớn nhất 18mm" }
    ],
    notes: "Đã hoàn thành kích thích buồng trứng, chuẩn bị thu trứng"
  },
  {
    id: 3,
    patientName: "Hoàng Thị E",
    patientId: "PT10302",
    treatmentType: "IVF",
    currentStage: "Theo dõi sau chuyển phôi",
    startDate: "10/04/2025",
    lastUpdate: "08/06/2025",
    nextStage: "Xét nghiệm beta hCG",
    nextDate: "18/06/2025",
    progress: 70,
    doctor: "TS. BS. Nguyễn Văn A",
    status: "active",
    medications: [
      { name: "Progesterone", dosage: "200mg", frequency: "Hai lần mỗi ngày", duration: "14 ngày" },
      { name: "Estradiol", dosage: "2mg", frequency: "Hai lần mỗi ngày", duration: "14 ngày" }
    ],
    appointments: [
      { date: "10/04/2025", type: "Khám ban đầu", status: "completed" },
      { date: "25/04/2025", type: "Bắt đầu kích thích buồng trứng", status: "completed" },
      { date: "10/05/2025", type: "Thu thập trứng", status: "completed" },
      { date: "15/05/2025", type: "Thụ tinh trong phòng thí nghiệm", status: "completed" },
      { date: "20/05/2025", type: "Nuôi cấy phôi", status: "completed" },
      { date: "25/05/2025", type: "Chuyển phôi", status: "completed" },
      { date: "08/06/2025", type: "Theo dõi sau chuyển phôi", status: "completed" },
      { date: "18/06/2025", type: "Xét nghiệm beta hCG", status: "scheduled" }
    ],
    tests: [
      { date: "10/04/2025", type: "Xét nghiệm nội tiết cơ bản", result: "Trong giới hạn bình thường" },
      { date: "05/05/2025", type: "Siêu âm buồng trứng", result: "10 nang trứng >16mm" },
      { date: "10/05/2025", type: "Thu thập trứng", result: "Thu được 8 trứng" },
      { date: "15/05/2025", type: "Thụ tinh", result: "6 trứng thụ tinh thành công" },
      { date: "20/05/2025", type: "Nuôi cấy phôi", result: "4 phôi blastocyst chất lượng tốt" }
    ],
    notes: "Đã chuyển phôi thành công, đang theo dõi"
  },
  {
    id: 4,
    patientName: "Đặng Thị G",
    patientId: "PT10330",
    treatmentType: "IUI",
    currentStage: "Theo dõi nang trứng",
    startDate: "20/05/2025",
    lastUpdate: "11/06/2025",
    nextStage: "Tiêm hCG",
    nextDate: "17/06/2025",
    progress: 40,
    doctor: "TS. BS. Nguyễn Văn A",
    status: "active",
    medications: [
      { name: "Clomiphene citrate", dosage: "50mg", frequency: "Mỗi ngày", duration: "5 ngày" },
      { name: "Estradiol", dosage: "1mg", frequency: "Mỗi ngày", duration: "10 ngày" }
    ],
    appointments: [
      { date: "20/05/2025", type: "Khám ban đầu", status: "completed" },
      { date: "01/06/2025", type: "Bắt đầu kích thích buồng trứng", status: "completed" },
      { date: "11/06/2025", type: "Theo dõi nang trứng", status: "completed" },
      { date: "17/06/2025", type: "Siêu âm trước tiêm hCG", status: "scheduled" }
    ],
    tests: [
      { date: "20/05/2025", type: "Xét nghiệm nội tiết cơ bản", result: "Trong giới hạn bình thường" },
      { date: "11/06/2025", type: "Siêu âm buồng trứng", result: "2 nang trứng, kích thước lớn nhất 15mm" }
    ],
    notes: "Nang trứng phát triển tốt, chuẩn bị cho IUI"
  },
  {
    id: 5,
    patientName: "Dương Thị I",
    patientId: "PT10355",
    treatmentType: "IVF",
    currentStage: "Chuẩn bị thu trứng",
    startDate: "15/05/2025",
    lastUpdate: "07/06/2025",
    nextStage: "Thu thập trứng",
    nextDate: "17/06/2025",
    progress: 35,
    doctor: "TS. BS. Nguyễn Văn A",
    status: "active",
    medications: [
      { name: "Gonal-F", dosage: "200 IU", frequency: "Mỗi ngày", duration: "10 ngày" },
      { name: "Menopur", dosage: "75 IU", frequency: "Mỗi ngày", duration: "10 ngày" },
      { name: "Cetrotide", dosage: "0.25mg", frequency: "Mỗi ngày", duration: "5 ngày" }
    ],
    appointments: [
      { date: "15/05/2025", type: "Khám ban đầu", status: "completed" },
      { date: "25/05/2025", type: "Bắt đầu kích thích buồng trứng", status: "completed" },
      { date: "07/06/2025", type: "Siêu âm theo dõi", status: "completed" },
      { date: "17/06/2025", type: "Thu thập trứng", status: "scheduled" }
    ],
    tests: [
      { date: "15/05/2025", type: "Xét nghiệm nội tiết cơ bản", result: "FSH hơi cao, trong giới hạn điều trị" },
      { date: "07/06/2025", type: "Siêu âm buồng trứng", result: "14 nang trứng, kích thước từ 12-16mm" }
    ],
    notes: "Kích thích buồng trứng thành công, có nhiều nang trứng"
  }
];

const DoctorTreatmentRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'medications' | 'appointments' | 'tests'>('overview');
  const location = useLocation();
  
  // Get patientId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const patientIdFromUrl = queryParams.get('patientId');
  
  useEffect(() => {
    // If patientId is provided in URL, filter records for that patient
    if (patientIdFromUrl) {
      setSearchTerm(patientIdFromUrl);
    }
  }, [patientIdFromUrl]);
  
  const recordsPerPage = 3;

  // Filter records
  const filteredRecords = treatmentRecords.filter((record) => {
    const matchesSearch = record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.treatmentType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType ? record.treatmentType === selectedType : true;
    const matchesStage = selectedStage ? record.currentStage.includes(selectedStage) : true;
    
    return matchesSearch && matchesType && matchesStage;
  });

  // Get current records for pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  // Get selected record details
  const recordDetails = treatmentRecords.find(record => record.id === selectedRecord);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const pageCount = Math.ceil(filteredRecords.length / recordsPerPage);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType(null);
    setSelectedStage(null);
    setCurrentPage(1);
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hồ sơ điều trị</h1>
            <p className="mt-1 text-gray-600">
              Quản lý và theo dõi tất cả các quá trình điều trị hiện tại
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="mr-2 h-4 w-4" />
              Tạo hồ sơ điều trị mới
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
                  placeholder="Tìm kiếm theo tên bệnh nhân, ID hoặc phương pháp điều trị..."
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedType || ""}
                onChange={(e) => setSelectedType(e.target.value || null)}
                className="block border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả phương pháp</option>
                <option value="IUI">IUI</option>
                <option value="IVF">IVF</option>
              </select>
              
              <select
                value={selectedStage || ""}
                onChange={(e) => setSelectedStage(e.target.value || null)}
                className="block border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả giai đoạn</option>
                <option value="kích thích">Kích thích buồng trứng</option>
                <option value="Thu thập">Thu thập trứng</option>
                <option value="Theo dõi">Theo dõi</option>
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
          {/* Treatment Records List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Danh sách hồ sơ</h2>
                <span className="text-sm text-gray-500">
                  {filteredRecords.length} hồ sơ điều trị
                </span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <div 
                    key={record.id} 
                    onClick={() => setSelectedRecord(record.id === selectedRecord ? null : record.id)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${record.id === selectedRecord ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="mr-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{record.patientName}</h3>
                            <p className="text-xs text-gray-500">ID: {record.patientId}</p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {record.treatmentType}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">{record.currentStage}</p>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full" 
                              style={{ width: `${record.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Tiến độ: {record.progress}%</span>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Cập nhật: {record.lastUpdate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Tiếp theo: {record.nextDate}</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                            Chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Không tìm thấy hồ sơ điều trị nào phù hợp với bộ lọc</p>
                  <Button onClick={resetFilters} className="mt-2 bg-blue-600 hover:bg-blue-700">
                    Xóa bộ lọc
                  </Button>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {pageCount > 1 && (
              <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm text-gray-500">
                  Trang {currentPage} / {pageCount}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === pageCount}
                  className="p-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Treatment Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {recordDetails ? (
              <div>
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Chi tiết điều trị</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Đang điều trị
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{recordDetails.patientName}</h3>
                      <div className="flex items-center text-gray-600">
                        <span className="text-sm mr-2">ID: {recordDetails.patientId}</span>
                        <span className="text-sm">Bác sĩ: {recordDetails.doctor}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-gray-100">
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`flex-1 py-3 px-4 text-center text-sm font-medium ${
                        activeTab === 'overview'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Tổng quan
                    </button>
                    <button
                      onClick={() => setActiveTab('medications')}
                      className={`flex-1 py-3 px-4 text-center text-sm font-medium ${
                        activeTab === 'medications'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Thuốc
                    </button>
                    <button
                      onClick={() => setActiveTab('appointments')}
                      className={`flex-1 py-3 px-4 text-center text-sm font-medium ${
                        activeTab === 'appointments'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Lịch hẹn
                    </button>
                    <button
                      onClick={() => setActiveTab('tests')}
                      className={`flex-1 py-3 px-4 text-center text-sm font-medium ${
                        activeTab === 'tests'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Xét nghiệm
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {activeTab === 'overview' && (
                    <div>
                      <div className="mb-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {recordDetails.treatmentType}
                            </h3>
                            <p className="text-gray-600">Bắt đầu ngày: {recordDetails.startDate}</p>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 text-gray-500 mr-1" />
                            <span className="text-gray-600">Cập nhật gần nhất: {recordDetails.lastUpdate}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Tiến độ điều trị</span>
                            <span className="text-sm font-medium text-gray-700">{recordDetails.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${recordDetails.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Giai đoạn hiện tại</h4>
                          <p className="text-gray-900">{recordDetails.currentStage}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Giai đoạn tiếp theo</h4>
                          <p className="text-gray-900">{recordDetails.nextStage}</p>
                          <p className="text-sm text-blue-600 mt-1">Ngày: {recordDetails.nextDate}</p>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Ghi chú</h4>
                        <p className="text-gray-700">{recordDetails.notes}</p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Tóm tắt</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                          <div className="text-center">
                            <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Pill className="h-6 w-6 text-blue-600" />
                            </div>
                            <p className="text-xs font-medium text-gray-700">Thuốc</p>
                            <p className="text-lg font-semibold text-gray-900">{recordDetails.medications.length}</p>
                          </div>
                          <div className="text-center">
                            <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-2">
                              <CalendarClock className="h-6 w-6 text-green-600" />
                            </div>
                            <p className="text-xs font-medium text-gray-700">Lịch hẹn</p>
                            <p className="text-lg font-semibold text-gray-900">{recordDetails.appointments.length}</p>
                          </div>
                          <div className="text-center">
                            <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Activity className="h-6 w-6 text-purple-600" />
                            </div>
                            <p className="text-xs font-medium text-gray-700">Xét nghiệm</p>
                            <p className="text-lg font-semibold text-gray-900">{recordDetails.tests.length}</p>
                          </div>
                          <div className="text-center">
                            <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Check className="h-6 w-6 text-yellow-600" />
                            </div>
                            <p className="text-xs font-medium text-gray-700">Hoàn thành</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {recordDetails.appointments.filter(a => a.status === 'completed').length}/{recordDetails.appointments.length}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                          <FileBarChart className="mr-2 h-4 w-4" />
                          Cập nhật tiến độ
                        </Button>
                        <Button variant="outline" className="flex-1 border-gray-300 text-gray-700">
                          <ListTodo className="mr-2 h-4 w-4" />
                          Thêm ghi chú
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'medications' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Thuốc hiện tại</h3>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Pill className="mr-2 h-4 w-4" />
                          Thêm thuốc
                        </Button>
                      </div>
                      
                      {recordDetails.medications.length > 0 ? (
                        <div className="space-y-4">
                          {recordDetails.medications.map((medication, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex justify-between">
                                <h4 className="font-medium text-gray-900">{medication.name}</h4>
                                <Button variant="outline" size="sm" className="h-7 text-xs border-gray-300 text-gray-700">
                                  Chỉnh sửa
                                </Button>
                              </div>
                              <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                                <div>
                                  <p className="text-gray-500">Liều lượng</p>
                                  <p className="font-medium text-gray-900">{medication.dosage}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Tần suất</p>
                                  <p className="font-medium text-gray-900">{medication.frequency}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Thời gian</p>
                                  <p className="font-medium text-gray-900">{medication.duration}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-6 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">Không có thuốc nào được kê cho bệnh nhân này</p>
                        </div>
                      )}
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử thuốc</h3>
                        <div className="text-center p-6 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">Không có lịch sử thuốc trước đây</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'appointments' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Lịch trình cuộc hẹn</h3>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <CalendarClock className="mr-2 h-4 w-4" />
                          Thêm lịch hẹn
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {recordDetails.appointments.map((appointment, index) => (
                          <div 
                            key={index} 
                            className={`p-4 rounded-lg border ${
                              appointment.status === 'scheduled' 
                                ? 'border-blue-200 bg-blue-50' 
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                  appointment.status === 'scheduled' 
                                    ? 'bg-blue-100' 
                                    : 'bg-green-100'
                                }`}>
                                  {appointment.status === 'scheduled' ? (
                                    <Calendar className={`h-5 w-5 ${
                                      appointment.status === 'scheduled' 
                                        ? 'text-blue-600' 
                                        : 'text-green-600'
                                    }`} />
                                  ) : (
                                    <Check className="h-5 w-5 text-green-600" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{appointment.type}</p>
                                  <p className="text-sm text-gray-500">{appointment.date}</p>
                                </div>
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                appointment.status === 'scheduled' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {appointment.status === 'scheduled' ? 'Lịch hẹn' : 'Hoàn thành'}
                              </span>
                            </div>
                            
                            {appointment.status === 'scheduled' && (
                              <div className="mt-3 flex justify-end space-x-2">
                                <Button variant="outline" size="sm" className="text-xs border-gray-300 text-gray-700">
                                  Đổi lịch
                                </Button>
                                <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700">
                                  Xác nhận hoàn thành
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'tests' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Kết quả xét nghiệm</h3>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <ClipboardList className="mr-2 h-4 w-4" />
                          Thêm xét nghiệm
                        </Button>
                      </div>
                      
                      {recordDetails.tests.length > 0 ? (
                        <div className="space-y-4">
                          {recordDetails.tests.map((test, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex justify-between">
                                <h4 className="font-medium text-gray-900">{test.type}</h4>
                                <span className="text-sm text-gray-500">{test.date}</span>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-1">Kết quả:</p>
                                <p className="text-gray-700">{test.result}</p>
                              </div>
                              <div className="mt-3 flex justify-end">
                                <Button variant="outline" size="sm" className="text-xs border-gray-300 text-gray-700">
                                  Xem chi tiết
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-6 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">Không có kết quả xét nghiệm nào</p>
                        </div>
                      )}
                      
                      <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Nhắc nhở</h4>
                            <p className="text-sm text-gray-700">
                              Đừng quên cập nhật kết quả xét nghiệm ngay khi có để theo dõi tiến trình điều trị một cách hiệu quả.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Chọn hồ sơ điều trị</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Vui lòng chọn một hồ sơ điều trị từ danh sách bên trái để xem chi tiết
                </p>
                <Button 
                  variant="outline" 
                  className="border-gray-300 text-gray-700"
                  onClick={() => setSelectedRecord(treatmentRecords[0].id)}
                >
                  Xem hồ sơ mẫu
                </Button>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tài liệu và hướng dẫn</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-1">Quy trình IUI</h3>
                <p className="text-sm text-gray-600 mb-2">Hướng dẫn chi tiết về các bước trong quy trình IUI</p>
                <Link to="#" className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
                  Xem tài liệu <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-1">Quy trình IVF</h3>
                <p className="text-sm text-gray-600 mb-2">Hướng dẫn chi tiết về các bước trong quy trình IVF</p>
                <Link to="#" className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
                  Xem tài liệu <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-1">Chuẩn đoán và đánh giá</h3>
                <p className="text-sm text-gray-600 mb-2">Hướng dẫn đánh giá và chuẩn đoán hiếm muộn</p>
                <Link to="#" className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
                  Xem tài liệu <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorTreatmentRecords;
