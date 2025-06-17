import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Star,
  Mail,
  Phone,
  X,
  Upload,
} from "lucide-react";
import { Button } from "../../components/ui/button";

// Mock data for doctors
const doctorsMockData = [
  {
    id: 1,
    name: "TS. BS. Nguyễn Văn A",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    specialization: "Chuyên khoa Sản - Hiếm muộn",
    experience: "15 năm kinh nghiệm",
    qualification: "Tiến sĩ Y học, Đại học Y Hà Nội",
    email: "nguyenvana@fertility.vn",
    phone: "0901234567",
    workDays: "Thứ 2 - Thứ 6",
    workHours: "08:00 - 17:00",
    description: "TS. BS. Nguyễn Văn A là chuyên gia đầu ngành về điều trị hiếm muộn với hơn 15 năm kinh nghiệm. Ông đã điều trị thành công cho hơn 2000 cặp vợ chồng hiếm muộn.",
    rating: 4.9,
    totalPatients: 2150,
    totalReviews: 325,
    successRate: "72%",
    status: "active"
  },
  {
    id: 2,
    name: "BS. CKI. Phạm Thị D",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    specialization: "Chuyên khoa Nội tiết - Hiếm muộn",
    experience: "10 năm kinh nghiệm",
    qualification: "Chuyên khoa I Sản phụ khoa, Đại học Y Hồ Chí Minh",
    email: "phamthid@fertility.vn",
    phone: "0907654321",
    workDays: "Thứ 3 - Thứ 7",
    workHours: "08:00 - 17:00",
    description: "BS. CKI. Phạm Thị D có chuyên môn cao trong lĩnh vực điều trị nội tiết liên quan đến hiếm muộn. Bà đã có nhiều năm kinh nghiệm trong điều trị rối loạn nội tiết ở phụ nữ.",
    rating: 4.8,
    totalPatients: 1850,
    totalReviews: 275,
    successRate: "68%",
    status: "active"
  },
  {
    id: 3,
    name: "PGS. TS. Trần Văn B",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    specialization: "Chuyên khoa Nam học - Hiếm muộn",
    experience: "20 năm kinh nghiệm",
    qualification: "Phó Giáo sư, Tiến sĩ Y học, Đại học Y Hà Nội",
    email: "tranvanb@fertility.vn",
    phone: "0903456789",
    workDays: "Thứ 2 - Thứ 6",
    workHours: "08:00 - 17:00",
    description: "PGS. TS. Trần Văn B là chuyên gia hàng đầu về Nam học và điều trị hiếm muộn ở nam giới. Ông đã có nhiều nghiên cứu khoa học được công bố quốc tế về lĩnh vực này.",
    rating: 4.9,
    totalPatients: 2300,
    totalReviews: 412,
    successRate: "75%",
    status: "active"
  },
  {
    id: 4,
    name: "TS. BS. Lê Thị C",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    specialization: "Chuyên khoa Phôi học - IVF",
    experience: "12 năm kinh nghiệm",
    qualification: "Tiến sĩ Y học, Đại học Y Hà Nội",
    email: "lethic@fertility.vn",
    phone: "0909876543",
    workDays: "Thứ 3 - Thứ 7",
    workHours: "08:00 - 17:00",
    description: "TS. BS. Lê Thị C là chuyên gia trong lĩnh vực phôi học và thụ tinh trong ống nghiệm (IVF). Bà đã tham gia nhiều khóa đào tạo quốc tế về kỹ thuật nuôi cấy phôi tiên tiến.",
    rating: 4.7,
    totalPatients: 1650,
    totalReviews: 243,
    successRate: "70%",
    status: "active"
  },
  {
    id: 5,
    name: "BS. CKI. Hoàng Văn E",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    specialization: "Chuyên khoa Sản - Siêu âm",
    experience: "8 năm kinh nghiệm",
    qualification: "Chuyên khoa I Sản phụ khoa, Đại học Y Hà Nội",
    email: "hoangvane@fertility.vn",
    phone: "0904567890",
    workDays: "Thứ 2 - Thứ 6",
    workHours: "08:00 - 17:00",
    description: "BS. CKI. Hoàng Văn E chuyên về siêu âm sản phụ khoa và theo dõi thai kỳ cho các trường hợp thụ tinh nhân tạo. Ông có kỹ năng chẩn đoán hình ảnh tốt và kinh nghiệm theo dõi thai kỳ.",
    rating: 4.6,
    totalPatients: 1200,
    totalReviews: 180,
    successRate: "65%",
    status: "active"
  },
  {
    id: 6,
    name: "TS. BS. Vũ Thị F",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    specialization: "Chuyên khoa Nội tiết sinh sản",
    experience: "14 năm kinh nghiệm",
    qualification: "Tiến sĩ Y học, Đại học Y Hồ Chí Minh",
    email: "vuthif@fertility.vn",
    phone: "0908765432",
    workDays: "Thứ 4 - Chủ nhật",
    workHours: "08:00 - 17:00",
    description: "TS. BS. Vũ Thị F là chuyên gia về nội tiết sinh sản và điều trị các vấn đề liên quan đến rối loạn hormone ảnh hưởng đến khả năng sinh sản.",
    rating: 4.8,
    totalPatients: 1750,
    totalReviews: 265,
    successRate: "69%",
    status: "active"
  }
];

// Mock specializations
const doctorSpecializations = [
  "Tất cả",
  "Chuyên khoa Sản - Hiếm muộn",
  "Chuyên khoa Nội tiết - Hiếm muộn",
  "Chuyên khoa Nam học - Hiếm muộn",
  "Chuyên khoa Phôi học - IVF",
  "Chuyên khoa Sản - Siêu âm",
  "Chuyên khoa Nội tiết sinh sản"
];

const AdminDoctors = () => {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("Tất cả");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDoctors(doctorsMockData);
      setLoading(false);
    }, 500);
  }, []);

  // Filter doctors based on search term and specialization
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = selectedSpecialization === "Tất cả" || doctor.specialization === selectedSpecialization;
    
    return matchesSearch && matchesSpecialization;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSpecializationChange = (specialization: string) => {
    setSelectedSpecialization(specialization);
    setCurrentPage(1); // Reset to first page when changing specialization
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleAddDoctor = () => {
    setShowAddModal(true);
  };

  const handleEditDoctor = (doctor: any) => {
    setCurrentDoctor(doctor);
    setShowEditModal(true);
  };

  const handleDeleteDoctor = (doctor: any) => {
    setCurrentDoctor(doctor);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // In a real app, you would call an API to delete the doctor
    if (currentDoctor) {
      setDoctors(doctors.filter(doctor => doctor.id !== currentDoctor.id));
      setShowDeleteModal(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý bác sĩ</h1>
            <p className="mt-1 text-gray-600">
              Quản lý đội ngũ bác sĩ và chuyên gia của phòng khám
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              onClick={handleAddDoctor}
              className="flex items-center bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="mr-1 h-5 w-5" />
              Thêm bác sĩ mới
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm bác sĩ..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {doctorSpecializations.map(specialization => (
                <button
                  key={specialization}
                  onClick={() => handleSpecializationChange(specialization)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedSpecialization === specialization
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {specialization}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedDoctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="relative">
                <div className="absolute top-0 right-0 p-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    doctor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {doctor.status === 'active' ? 'Đang làm việc' : 'Tạm nghỉ'}
                  </span>
                </div>
                <div className="h-40 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                  <img 
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="h-28 w-28 rounded-full border-4 border-white object-cover"
                  />
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{doctor.name}</h3>
                    <p className="text-sm text-purple-600 mb-2">{doctor.specialization}</p>
                  </div>
                  <div className="flex">
                    <button 
                      onClick={() => handleEditDoctor(doctor)}
                      className="p-1 text-gray-500 hover:text-purple-600"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteDoctor(doctor)}
                      className="p-1 text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium text-gray-900">{doctor.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({doctor.totalReviews} đánh giá)</span>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{doctor.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{doctor.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{doctor.workDays}, {doctor.workHours}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-xs text-gray-500">Bệnh nhân</p>
                    <p className="text-sm font-semibold text-gray-900">{doctor.totalPatients}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Kinh nghiệm</p>
                    <p className="text-sm font-semibold text-gray-900">{doctor.experience.split(' ')[0]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tỷ lệ thành công</p>
                    <p className="text-sm font-semibold text-gray-900">{doctor.successRate}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
                      ? 'bg-purple-600 text-white' 
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

        {/* Add Doctor Modal */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Thêm bác sĩ mới</h3>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 flex justify-center">
                      <div className="relative">
                        <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          <img 
                            src="https://via.placeholder.com/150" 
                            alt="Doctor avatar" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <label className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer">
                          <Upload className="h-4 w-4 text-white" />
                          <input type="file" className="hidden" />
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder="TS. BS. Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên khoa</label>
                      <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent">
                        <option value="">Chọn chuyên khoa</option>
                        {doctorSpecializations.filter(s => s !== "Tất cả").map(specialization => (
                          <option key={specialization} value={specialization}>{specialization}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder="doctor@fertility.vn"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                      <input 
                        type="tel" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder="0901234567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bằng cấp chuyên môn</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder="Tiến sĩ Y học, Đại học Y Hà Nội"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kinh nghiệm</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder="15 năm kinh nghiệm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Giới thiệu</label>
                      <textarea 
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder="Nhập thông tin giới thiệu về bác sĩ"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ngày làm việc</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder="Thứ 2 - Thứ 6"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Giờ làm việc</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder="08:00 - 17:00"
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
                            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-600"
                            defaultChecked
                          />
                          <label htmlFor="active-status" className="ml-2 text-sm font-medium text-gray-700">Đang làm việc</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="inactive-status" 
                            name="status" 
                            value="inactive"
                            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-600"
                          />
                          <label htmlFor="inactive-status" className="ml-2 text-sm font-medium text-gray-700">Tạm nghỉ</label>
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
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    // In a real app, you would submit the form data to your API
                    // and add the new doctor to the list
                    setShowAddModal(false);
                  }}
                >
                  Thêm bác sĩ
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Doctor Modal */}
        {showEditModal && currentDoctor && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa thông tin bác sĩ</h3>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 flex justify-center">
                      <div className="relative">
                        <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          <img 
                            src={currentDoctor.avatar} 
                            alt={currentDoctor.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <label className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer">
                          <Upload className="h-4 w-4 text-white" />
                          <input type="file" className="hidden" />
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        defaultValue={currentDoctor.name}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên khoa</label>
                      <select 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        defaultValue={currentDoctor.specialization}
                      >
                        {doctorSpecializations.filter(s => s !== "Tất cả").map(specialization => (
                          <option key={specialization} value={specialization}>{specialization}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        defaultValue={currentDoctor.email}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                      <input 
                        type="tel" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        defaultValue={currentDoctor.phone}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bằng cấp chuyên môn</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        defaultValue={currentDoctor.qualification}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kinh nghiệm</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        defaultValue={currentDoctor.experience}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Giới thiệu</label>
                      <textarea 
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        defaultValue={currentDoctor.description}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ngày làm việc</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        defaultValue={currentDoctor.workDays}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Giờ làm việc</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        defaultValue={currentDoctor.workHours}
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
                            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-600"
                            defaultChecked={currentDoctor.status === 'active'}
                          />
                          <label htmlFor="edit-active-status" className="ml-2 text-sm font-medium text-gray-700">Đang làm việc</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="edit-inactive-status" 
                            name="edit-status" 
                            value="inactive"
                            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-600"
                            defaultChecked={currentDoctor.status !== 'active'}
                          />
                          <label htmlFor="edit-inactive-status" className="ml-2 text-sm font-medium text-gray-700">Tạm nghỉ</label>
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
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    // In a real app, you would submit the form data to your API
                    // and update the doctor in the list
                    setShowEditModal(false);
                  }}
                >
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && currentDoctor && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Xác nhận xóa</h3>
                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn xóa bác sĩ "{currentDoctor.name}"? Hành động này không thể hoàn tác.
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

export default AdminDoctors;
