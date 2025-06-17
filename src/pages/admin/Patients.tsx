import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Mail,
  Phone,
  X,
  User,
  Users,
  Clock,
  FileText,
  Filter,
  ChevronDown,
  Download,
} from "lucide-react";
import { Button } from "../../components/ui/button";

// Mock data for patients
const patientsMockData = [
  {
    id: "PT10234",
    name: "Nguyễn Thị A",
    gender: "Nữ",
    age: 32,
    email: "nguyenthia@gmail.com",
    phone: "0901234567",
    address: "123 Đường Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh",
    treatmentStage: "Đang điều trị",
    treatmentType: "Thụ tinh trong ống nghiệm (IVF)",
    doctor: "TS. BS. Nguyễn Văn A",
    lastVisit: "15/05/2023",
    nextAppointment: "30/06/2023",
    registrationDate: "10/01/2023",
    status: "active"
  },
  {
    id: "PT10245",
    name: "Trần Văn B",
    gender: "Nam",
    age: 35,
    email: "tranvanb@gmail.com",
    phone: "0909876543",
    address: "456 Đường Lê Lợi, Quận 5, TP. Hồ Chí Minh",
    treatmentStage: "Mới đăng ký",
    treatmentType: "Tư vấn ban đầu",
    doctor: "BS. CKI. Phạm Thị D",
    lastVisit: "18/06/2023",
    nextAppointment: "25/06/2023",
    registrationDate: "18/06/2023",
    status: "active"
  },
  {
    id: "PT10267",
    name: "Lê Thị C",
    gender: "Nữ",
    age: 28,
    email: "lethic@gmail.com",
    phone: "0918765432",
    address: "789 Đường Võ Văn Tần, Quận 3, TP. Hồ Chí Minh",
    treatmentStage: "Hoàn thành điều trị",
    treatmentType: "Thụ tinh trong tử cung (IUI)",
    doctor: "TS. BS. Nguyễn Văn A",
    lastVisit: "10/06/2023",
    nextAppointment: null,
    registrationDate: "15/02/2023",
    status: "inactive"
  },
  {
    id: "PT10302",
    name: "Hoàng Thị E",
    gender: "Nữ",
    age: 30,
    email: "hoangthie@gmail.com",
    phone: "0987654321",
    address: "101 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
    treatmentStage: "Đang điều trị",
    treatmentType: "Thụ tinh trong ống nghiệm (IVF)",
    doctor: "PGS. TS. Trần Văn B",
    lastVisit: "05/06/2023",
    nextAppointment: "28/06/2023",
    registrationDate: "01/03/2023",
    status: "active"
  },
  {
    id: "PT10315",
    name: "Vũ Văn F",
    gender: "Nam",
    age: 40,
    email: "vuvanf@gmail.com",
    phone: "0976543210",
    address: "202 Đường Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh",
    treatmentStage: "Đang theo dõi",
    treatmentType: "Tiêm tinh trùng vào bào tương trứng (ICSI)",
    doctor: "TS. BS. Lê Thị C",
    lastVisit: "12/06/2023",
    nextAppointment: "15/07/2023",
    registrationDate: "20/03/2023",
    status: "active"
  },
  {
    id: "PT10334",
    name: "Phạm Thị G",
    gender: "Nữ",
    age: 27,
    email: "phamthig@gmail.com",
    phone: "0965432109",
    address: "303 Đường Nguyễn Du, Quận 1, TP. Hồ Chí Minh",
    treatmentStage: "Đang theo dõi",
    treatmentType: "Thụ tinh trong tử cung (IUI)",
    doctor: "BS. CKI. Hoàng Văn E",
    lastVisit: "08/06/2023",
    nextAppointment: "08/07/2023",
    registrationDate: "05/04/2023",
    status: "active"
  },
  {
    id: "PT10356",
    name: "Đặng Văn H",
    gender: "Nam",
    age: 37,
    email: "dangvanh@gmail.com",
    phone: "0954321098",
    address: "404 Đường Cách Mạng Tháng 8, Quận 3, TP. Hồ Chí Minh",
    treatmentStage: "Tạm ngưng",
    treatmentType: "Thụ tinh trong ống nghiệm (IVF)",
    doctor: "TS. BS. Nguyễn Văn A",
    lastVisit: "20/05/2023",
    nextAppointment: null,
    registrationDate: "15/04/2023",
    status: "inactive"
  },
  {
    id: "PT10378",
    name: "Ngô Thị I",
    gender: "Nữ",
    age: 33,
    email: "ngothii@gmail.com",
    phone: "0943210987",
    address: "505 Đường Lê Duẩn, Quận 1, TP. Hồ Chí Minh",
    treatmentStage: "Đang điều trị",
    treatmentType: "Tiêm tinh trùng vào bào tương trứng (ICSI)",
    doctor: "TS. BS. Vũ Thị F",
    lastVisit: "16/06/2023",
    nextAppointment: "30/06/2023",
    registrationDate: "01/05/2023",
    status: "active"
  }
];

// Treatment stage options
const treatmentStages = [
  "Tất cả",
  "Mới đăng ký",
  "Đang điều trị",
  "Đang theo dõi",
  "Hoàn thành điều trị",
  "Tạm ngưng"
];

// Treatment type options
const treatmentTypes = [
  "Tất cả",
  "Tư vấn ban đầu",
  "Thụ tinh trong tử cung (IUI)",
  "Thụ tinh trong ống nghiệm (IVF)",
  "Tiêm tinh trùng vào bào tương trứng (ICSI)"
];

const AdminPatients = () => {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTreatmentStage, setSelectedTreatmentStage] = useState("Tất cả");
  const [selectedTreatmentType, setSelectedTreatmentType] = useState("Tất cả");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPatients(patientsMockData);
      setLoading(false);
    }, 500);
  }, []);

  // Filter patients based on search term, treatment stage and type
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);
    
    const matchesTreatmentStage = selectedTreatmentStage === "Tất cả" || patient.treatmentStage === selectedTreatmentStage;
    const matchesTreatmentType = selectedTreatmentType === "Tất cả" || patient.treatmentType === selectedTreatmentType;
    
    return matchesSearch && matchesTreatmentStage && matchesTreatmentType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleTreatmentStageChange = (stage: string) => {
    setSelectedTreatmentStage(stage);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleTreatmentTypeChange = (type: string) => {
    setSelectedTreatmentType(type);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleAddPatient = () => {
    setShowAddModal(true);
  };

  const handleEditPatient = (patient: any) => {
    setCurrentPatient(patient);
    setShowEditModal(true);
  };

  const handleDeletePatient = (patient: any) => {
    setCurrentPatient(patient);
    setShowDeleteModal(true);
  };

  const handleViewDetails = (patient: any) => {
    setCurrentPatient(patient);
    setShowDetailsModal(true);
  };

  const confirmDelete = () => {
    // In a real app, you would call an API to delete the patient
    if (currentPatient) {
      setPatients(patients.filter(patient => patient.id !== currentPatient.id));
      setShowDeleteModal(false);
    }
  };

  // Loading state
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
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý bệnh nhân</h1>
            <p className="mt-1 text-gray-600">
              Quản lý thông tin và quá trình điều trị của bệnh nhân
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="mr-1 h-5 w-5" />
              Bộ lọc
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
            <Button 
              onClick={handleAddPatient}
              className="flex items-center bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-1 h-5 w-5" />
              Thêm bệnh nhân mới
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <div className="relative flex-grow mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, ID, email hoặc số điện thoại..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giai đoạn điều trị</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={selectedTreatmentStage}
                  onChange={(e) => handleTreatmentStageChange(e.target.value)}
                >
                  {treatmentStages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loại điều trị</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={selectedTreatmentType}
                  onChange={(e) => handleTreatmentTypeChange(e.target.value)}
                >
                  {treatmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </motion.div>

        {/* Patients Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID & Thông tin
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tình trạng điều trị
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bác sĩ & Lịch hẹn
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">
                            ID: {patient.id} · {patient.gender}, {patient.age} tuổi
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-1" /> {patient.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Phone className="h-4 w-4 text-gray-400 mr-1" /> {patient.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        patient.treatmentStage === 'Đang điều trị' 
                          ? 'bg-green-100 text-green-800' 
                          : patient.treatmentStage === 'Mới đăng ký'
                          ? 'bg-blue-100 text-blue-800'
                          : patient.treatmentStage === 'Đang theo dõi'
                          ? 'bg-yellow-100 text-yellow-800'
                          : patient.treatmentStage === 'Hoàn thành điều trị'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.treatmentStage}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">{patient.treatmentType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.doctor}</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" /> 
                        {patient.nextAppointment ? patient.nextAppointment : 'Không có lịch hẹn'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleViewDetails(patient)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FileText className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleEditPatient(patient)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDeletePatient(patient)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Không tìm thấy bệnh nhân</h3>
              <p className="mt-2 text-sm text-gray-500">
                Không có bệnh nhân nào phù hợp với điều kiện tìm kiếm của bạn.
              </p>
            </div>
          )}
        </motion.div>

        {/* Summary and Export */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            Hiển thị {paginatedPatients.length} trong tổng số {filteredPatients.length} bệnh nhân
          </div>
          <Button variant="outline" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 mx-1 rounded-md ${
                    currentPage === i + 1 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        )}

        {/* Add Patient Modal */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Thêm bệnh nhân mới</h3>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <form className="space-y-6">
                  <h4 className="text-md font-medium text-gray-900 border-b pb-2">Thông tin cá nhân</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                      <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tuổi</label>
                      <input 
                        type="number" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                      <input 
                        type="tel" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="0901234567"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="123 Đường Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh"
                      />
                    </div>
                  </div>

                  <h4 className="text-md font-medium text-gray-900 border-b pb-2 mt-6">Thông tin điều trị</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Giai đoạn điều trị</label>
                      <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                        <option value="">Chọn giai đoạn</option>
                        {treatmentStages.filter(stage => stage !== "Tất cả").map(stage => (
                          <option key={stage} value={stage}>{stage}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Loại điều trị</label>
                      <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                        <option value="">Chọn loại điều trị</option>
                        {treatmentTypes.filter(type => type !== "Tất cả").map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bác sĩ phụ trách</label>
                      <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                        <option value="">Chọn bác sĩ</option>
                        <option value="TS. BS. Nguyễn Văn A">TS. BS. Nguyễn Văn A</option>
                        <option value="BS. CKI. Phạm Thị D">BS. CKI. Phạm Thị D</option>
                        <option value="PGS. TS. Trần Văn B">PGS. TS. Trần Văn B</option>
                        <option value="TS. BS. Lê Thị C">TS. BS. Lê Thị C</option>
                        <option value="BS. CKI. Hoàng Văn E">BS. CKI. Hoàng Văn E</option>
                        <option value="TS. BS. Vũ Thị F">TS. BS. Vũ Thị F</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lịch hẹn tiếp theo</label>
                      <input 
                        type="date" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="active-status" 
                            name="status" 
                            value="active"
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                            defaultChecked
                          />
                          <label htmlFor="active-status" className="ml-2 text-sm font-medium text-gray-700">Đang hoạt động</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="inactive-status" 
                            name="status" 
                            value="inactive"
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                          />
                          <label htmlFor="inactive-status" className="ml-2 text-sm font-medium text-gray-700">Không hoạt động</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddModal(false)}
                >
                  Hủy
                </Button>
                <Button 
                  onClick={() => {
                    // In a real app, you would submit the form data to your API
                    // and add the new patient to the list
                    setShowAddModal(false);
                  }}
                >
                  Thêm bệnh nhân
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Patient Modal */}
        {showEditModal && currentPatient && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa thông tin bệnh nhân</h3>
                  <button 
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <form className="space-y-6">
                  <h4 className="text-md font-medium text-gray-900 border-b pb-2">Thông tin cá nhân</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        defaultValue={currentPatient.name}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                      <select 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        defaultValue={currentPatient.gender}
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tuổi</label>
                      <input 
                        type="number" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        defaultValue={currentPatient.age}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        defaultValue={currentPatient.email}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                      <input 
                        type="tel" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        defaultValue={currentPatient.phone}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        defaultValue={currentPatient.address}
                      />
                    </div>
                  </div>

                  <h4 className="text-md font-medium text-gray-900 border-b pb-2 mt-6">Thông tin điều trị</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Giai đoạn điều trị</label>
                      <select 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        defaultValue={currentPatient.treatmentStage}
                      >
                        {treatmentStages.filter(stage => stage !== "Tất cả").map(stage => (
                          <option key={stage} value={stage}>{stage}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Loại điều trị</label>
                      <select 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        defaultValue={currentPatient.treatmentType}
                      >
                        {treatmentTypes.filter(type => type !== "Tất cả").map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bác sĩ phụ trách</label>
                      <select 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        defaultValue={currentPatient.doctor}
                      >
                        <option value="TS. BS. Nguyễn Văn A">TS. BS. Nguyễn Văn A</option>
                        <option value="BS. CKI. Phạm Thị D">BS. CKI. Phạm Thị D</option>
                        <option value="PGS. TS. Trần Văn B">PGS. TS. Trần Văn B</option>
                        <option value="TS. BS. Lê Thị C">TS. BS. Lê Thị C</option>
                        <option value="BS. CKI. Hoàng Văn E">BS. CKI. Hoàng Văn E</option>
                        <option value="TS. BS. Vũ Thị F">TS. BS. Vũ Thị F</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lịch hẹn tiếp theo</label>
                      <input 
                        type="date" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        defaultValue={currentPatient.nextAppointment ? currentPatient.nextAppointment.split('/').reverse().join('-') : ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="edit-active-status" 
                            name="edit-status" 
                            value="active"
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                            defaultChecked={currentPatient.status === 'active'}
                          />
                          <label htmlFor="edit-active-status" className="ml-2 text-sm font-medium text-gray-700">Đang hoạt động</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="edit-inactive-status" 
                            name="edit-status" 
                            value="inactive"
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
                            defaultChecked={currentPatient.status === 'inactive'}
                          />
                          <label htmlFor="edit-inactive-status" className="ml-2 text-sm font-medium text-gray-700">Không hoạt động</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy
                </Button>
                <Button 
                  onClick={() => {
                    // In a real app, you would submit the form data to your API
                    // and update the patient in the list
                    setShowEditModal(false);
                  }}
                >
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Patient Details Modal */}
        {showDetailsModal && currentPatient && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Chi tiết bệnh nhân</h3>
                  <button 
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 mb-6 md:mb-0">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="flex-shrink-0 h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="h-12 w-12 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-bold text-center text-gray-900 mb-1">{currentPatient.name}</h4>
                      <p className="text-sm text-center text-gray-500 mb-4">ID: {currentPatient.id}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{currentPatient.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{currentPatient.phone}</span>
                        </div>
                        <div className="flex items-start text-sm text-gray-600">
                          <div className="flex-shrink-0 mt-1">
                            <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span>{currentPatient.address}</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div>
                            <p className="text-xs text-gray-500">Giới tính</p>
                            <p className="text-sm font-semibold text-gray-900">{currentPatient.gender}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Tuổi</p>
                            <p className="text-sm font-semibold text-gray-900">{currentPatient.age}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Ngày đăng ký</p>
                            <p className="text-sm font-semibold text-gray-900">{currentPatient.registrationDate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Trạng thái</p>
                            <p className={`text-sm font-semibold ${
                              currentPatient.status === 'active' ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              {currentPatient.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 md:pl-6">
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Thông tin điều trị</h4>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Giai đoạn điều trị</p>
                            <p className="text-base font-medium text-gray-900">{currentPatient.treatmentStage}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Loại điều trị</p>
                            <p className="text-base font-medium text-gray-900">{currentPatient.treatmentType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Bác sĩ phụ trách</p>
                            <p className="text-base font-medium text-gray-900">{currentPatient.doctor}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Lần khám gần nhất</p>
                            <p className="text-base font-medium text-gray-900">{currentPatient.lastVisit}</p>
                          </div>
                        </div>
                      </div>
                      
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Lịch hẹn tiếp theo</h4>
                      {currentPatient.nextAppointment ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                              <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-base font-medium text-gray-900">{currentPatient.nextAppointment}</p>
                              <p className="text-sm text-gray-500">Bác sĩ: {currentPatient.doctor}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 text-center">
                          <p className="text-gray-500">Không có lịch hẹn sắp tới</p>
                        </div>
                      )}
                      
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Lịch sử điều trị</h4>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b border-gray-200">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-sm font-medium text-gray-500">Ngày</div>
                            <div className="text-sm font-medium text-gray-500">Hoạt động</div>
                            <div className="text-sm font-medium text-gray-500">Bác sĩ</div>
                          </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                          <div className="p-3">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-sm text-gray-900">{currentPatient.lastVisit}</div>
                              <div className="text-sm text-gray-900">Khám định kỳ</div>
                              <div className="text-sm text-gray-900">{currentPatient.doctor}</div>
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-sm text-gray-900">10/05/2023</div>
                              <div className="text-sm text-gray-900">Xét nghiệm nội tiết</div>
                              <div className="text-sm text-gray-900">BS. CKI. Phạm Thị D</div>
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-sm text-gray-900">25/04/2023</div>
                              <div className="text-sm text-gray-900">Tư vấn và lên kế hoạch</div>
                              <div className="text-sm text-gray-900">{currentPatient.doctor}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <Button 
                        variant="outline" 
                        className="flex items-center"
                        onClick={() => {
                          setShowDetailsModal(false);
                          handleEditPatient(currentPatient);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </Button>
                      <Button 
                        className="flex items-center"
                        onClick={() => {
                          // In a real app, you would navigate to a dedicated treatment page
                          setShowDetailsModal(false);
                        }}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Xem hồ sơ điều trị
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && currentPatient && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Xác nhận xóa</h3>
                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn xóa bệnh nhân "{currentPatient.name}" (ID: {currentPatient.id})? Hành động này không thể hoàn tác.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Hủy
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={confirmDelete}
                  >
                    Xác nhận xóa
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPatients;
