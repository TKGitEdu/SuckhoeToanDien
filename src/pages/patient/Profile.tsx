import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  Shield,
  Edit,
  Save,
  X,
  AlertCircle,
  Heart,
  Activity,
  Pill,
  Info
} from "lucide-react";
import { Button } from "../../components/ui/button";

const PatientProfile = () => {
  // Mock patient data
  const [profile, setProfile] = useState({
    id: "PT12345",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    firstName: "Nguyễn",
    lastName: "Thị An",
    email: "nguyenthian@example.com",
    phone: "0912345678",
    dateOfBirth: "15/05/1990",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    bloodType: "A+",
    weight: 54,
    height: 165,
    occupation: "Giáo viên",
    emergencyContact: {
      name: "Nguyễn Văn Bình",
      relation: "Chồng",
      phone: "0987654321"
    }
  });
  // Medical history data
  const [medicalHistory] = useState({
    allergies: ["Penicillin", "Hải sản"],
    chronicConditions: ["Cao huyết áp"],
    medications: ["Amlodipine 5mg"],
    previousSurgeries: ["Phẫu thuật ruột thừa (2015)"],
    familyHistory: {
      infertility: true,
      diabetes: true,
      heartDisease: false,
      cancer: false
    }
  });
  // Fertility specific data
  const [fertilityHistory] = useState({
    yearsOfTrying: 4,
    previousTreatments: [
      { type: "Thuốc kích thích buồng trứng", year: "2021", result: "Không thành công" },
      { type: "IUI", year: "2022", result: "Không thành công" }
    ],
    menstrualCycle: {
      regularCycle: true,
      cycleDuration: 28,
      lastPeriod: "05/06/2025"
    },
    partnerInfo: {
      name: "Nguyễn Văn Bình",
      age: 35,
      spermAnalysisDone: true,
      spermAnalysisResult: "Bình thường"
    },
    familyHistory: {
      infertility: true,
      diabetes: true,
      heartDisease: false,
      cancer: false
    }
  });

  // Edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [isEditingFertility, setIsEditingFertility] = useState(false);
  
  // Form state for editing
  const [formData, setFormData] = useState(profile);

  // Handle profile update
  const handleProfileUpdate = () => {
    setProfile(formData);
    setIsEditingProfile(false);
    // Here would be API call to update profile
  };

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Cá Nhân</h1>
            <p className="text-gray-500">Quản lý thông tin cá nhân và lịch sử y tế của bạn</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="mr-2 h-4 w-4" />
              Xuất PDF
            </Button>
          </div>
        </motion.div>

        {/* Profile Information */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-600" />
              Thông Tin Cá Nhân
            </h2>
            <Button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              variant="outline"
              className={isEditingProfile ? "bg-red-50 text-red-600" : ""}
            >
              {isEditingProfile ? (
                <>
                  <X className="mr-2 h-4 w-4" /> Hủy
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" /> Chỉnh Sửa
                </>
              )}
            </Button>
          </div>

          <div className="p-6">
            {isEditingProfile ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative">
                    <img
                      src={profile.avatar}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                    />
                    <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="font-medium">{`${profile.firstName} ${profile.lastName}`}</h3>
                    <p className="text-sm text-gray-500">ID: {profile.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                    <input
                      type="text"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nghề nghiệp</label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                  />
                  <div className="mt-4 text-center">
                    <h3 className="font-medium">{`${profile.firstName} ${profile.lastName}`}</h3>
                    <p className="text-sm text-gray-500">ID: {profile.id}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-medium">{profile.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Ngày sinh</p>
                      <p className="font-medium">{profile.dateOfBirth}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Địa chỉ</p>
                      <p className="font-medium">{profile.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isEditingProfile && (
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  onClick={() => setIsEditingProfile(false)}
                  variant="outline"
                >
                  Hủy
                </Button>
                <Button onClick={handleProfileUpdate} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Medical Information */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-600" />
              Thông Tin Y Tế
            </h2>
            <Button
              onClick={() => setIsEditingMedical(!isEditingMedical)}
              variant="outline"
              className={isEditingMedical ? "bg-red-50 text-red-600" : ""}
            >
              {isEditingMedical ? (
                <>
                  <X className="mr-2 h-4 w-4" /> Hủy
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" /> Chỉnh Sửa
                </>
              )}
            </Button>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  Dị ứng
                </h3>
                {isEditingMedical ? (
                  <div className="space-y-2">
                    {medicalHistory.allergies.map((allergy, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={allergy}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="ml-2 p-2 text-red-500">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button className="text-blue-600 font-medium text-sm flex items-center mt-2">
                      + Thêm dị ứng
                    </button>
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {medicalHistory.allergies.map((allergy, index) => (
                      <li key={index}>{allergy}</li>
                    ))}
                    {medicalHistory.allergies.length === 0 && (
                      <p className="text-gray-500 italic">Không có dị ứng nào được ghi nhận</p>
                    )}
                  </ul>
                )}

                <h3 className="font-medium text-gray-900 mt-6 mb-4 flex items-center">
                  <Heart className="h-4 w-4 text-red-500 mr-2" />
                  Bệnh mãn tính
                </h3>
                {isEditingMedical ? (
                  <div className="space-y-2">
                    {medicalHistory.chronicConditions.map((condition, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={condition}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="ml-2 p-2 text-red-500">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button className="text-blue-600 font-medium text-sm flex items-center mt-2">
                      + Thêm bệnh mãn tính
                    </button>
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {medicalHistory.chronicConditions.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                    {medicalHistory.chronicConditions.length === 0 && (
                      <p className="text-gray-500 italic">Không có bệnh mãn tính nào được ghi nhận</p>
                    )}
                  </ul>
                )}
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                  <Pill className="h-4 w-4 text-blue-500 mr-2" />
                  Thuốc đang sử dụng
                </h3>
                {isEditingMedical ? (
                  <div className="space-y-2">
                    {medicalHistory.medications.map((medication, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={medication}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="ml-2 p-2 text-red-500">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button className="text-blue-600 font-medium text-sm flex items-center mt-2">
                      + Thêm thuốc
                    </button>
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {medicalHistory.medications.map((medication, index) => (
                      <li key={index}>{medication}</li>
                    ))}
                    {medicalHistory.medications.length === 0 && (
                      <p className="text-gray-500 italic">Không có thuốc nào được ghi nhận</p>
                    )}
                  </ul>
                )}

                <h3 className="font-medium text-gray-900 mt-6 mb-4 flex items-center">
                  <FileText className="h-4 w-4 text-blue-500 mr-2" />
                  Phẫu thuật trước đây
                </h3>
                {isEditingMedical ? (
                  <div className="space-y-2">
                    {medicalHistory.previousSurgeries.map((surgery, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={surgery}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="ml-2 p-2 text-red-500">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button className="text-blue-600 font-medium text-sm flex items-center mt-2">
                      + Thêm phẫu thuật
                    </button>
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {medicalHistory.previousSurgeries.map((surgery, index) => (
                      <li key={index}>{surgery}</li>
                    ))}
                    {medicalHistory.previousSurgeries.length === 0 && (
                      <p className="text-gray-500 italic">Không có phẫu thuật nào được ghi nhận</p>
                    )}
                  </ul>
                )}
              </div>
            </div>

            {isEditingMedical && (
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  onClick={() => setIsEditingMedical(false)}
                  variant="outline"
                >
                  Hủy
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Fertility Information */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center">
              <Info className="mr-2 h-5 w-5 text-blue-600" />
              Thông Tin Điều Trị Hiếm Muộn
            </h2>
            <Button
              onClick={() => setIsEditingFertility(!isEditingFertility)}
              variant="outline"
              className={isEditingFertility ? "bg-red-50 text-red-600" : ""}
            >
              {isEditingFertility ? (
                <>
                  <X className="mr-2 h-4 w-4" /> Hủy
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" /> Chỉnh Sửa
                </>
              )}
            </Button>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Thông tin chung</h3>
                
                <div className="space-y-4 text-gray-700">
                  <div>
                    <p className="text-sm text-gray-500">Số năm cố gắng có con</p>
                    {isEditingFertility ? (
                      <input
                        type="number"
                        value={fertilityHistory.yearsOfTrying}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="font-medium">{fertilityHistory.yearsOfTrying} năm</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Chu kỳ kinh nguyệt</p>
                    {isEditingFertility ? (
                      <div className="space-y-2 mt-1">
                        <div className="flex items-center">
                          <label className="mr-3 text-sm">Đều?</label>
                          <input
                            type="checkbox"
                            checked={fertilityHistory.menstrualCycle.regularCycle}
                            className="h-4 w-4 text-blue-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Kỳ kinh gần nhất</label>
                          <input
                            type="text"
                            value={fertilityHistory.menstrualCycle.lastPeriod}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Số ngày/chu kỳ</label>
                          <input
                            type="number"
                            value={fertilityHistory.menstrualCycle.cycleDuration}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">
                          {fertilityHistory.menstrualCycle.regularCycle ? "Đều" : "Không đều"}, 
                          {fertilityHistory.menstrualCycle.cycleDuration} ngày/chu kỳ
                        </p>
                        <p className="text-sm">
                          Kỳ kinh gần nhất: {fertilityHistory.menstrualCycle.lastPeriod}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="font-medium text-gray-900 mt-6 mb-4">Thông tin người phối ngẫu</h3>
                
                {isEditingFertility ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1">Họ tên</label>
                      <input
                        type="text"
                        value={fertilityHistory.partnerInfo.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Tuổi</label>
                      <input
                        type="number"
                        value={fertilityHistory.partnerInfo.age}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="mr-3 text-sm">Đã xét nghiệm tinh trùng?</label>
                      <input
                        type="checkbox"
                        checked={fertilityHistory.partnerInfo.spermAnalysisDone}
                        className="h-4 w-4 text-blue-600"
                      />
                    </div>
                    {fertilityHistory.partnerInfo.spermAnalysisDone && (
                      <div>
                        <label className="block text-sm mb-1">Kết quả xét nghiệm</label>
                        <input
                          type="text"
                          value={fertilityHistory.partnerInfo.spermAnalysisResult}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <span className="text-gray-500">Họ tên:</span> {fertilityHistory.partnerInfo.name}
                    </p>
                    <p>
                      <span className="text-gray-500">Tuổi:</span> {fertilityHistory.partnerInfo.age}
                    </p>
                    {fertilityHistory.partnerInfo.spermAnalysisDone && (
                      <p>
                        <span className="text-gray-500">Kết quả xét nghiệm tinh trùng:</span> {fertilityHistory.partnerInfo.spermAnalysisResult}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-4">Các liệu pháp điều trị trước đây</h3>
                
                {isEditingFertility ? (
                  <div className="space-y-3">
                    {fertilityHistory.previousTreatments.map((treatment, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-md">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{treatment.type}</h4>
                          <button className="text-red-500">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <label className="block text-sm mb-1">Năm</label>
                            <input
                              type="text"
                              value={treatment.year}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Kết quả</label>
                            <input
                              type="text"
                              value={treatment.result}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button className="text-blue-600 font-medium text-sm flex items-center mt-2">
                      + Thêm liệu pháp điều trị
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {fertilityHistory.previousTreatments.map((treatment, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-md">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{treatment.type}</h4>
                          <span className="text-sm text-gray-500">{treatment.year}</span>
                        </div>
                        <p className="text-sm mt-1">
                          <span className="text-gray-500">Kết quả:</span> {treatment.result}
                        </p>
                      </div>
                    ))}
                    {fertilityHistory.previousTreatments.length === 0 && (
                      <p className="text-gray-500 italic">Không có liệu pháp điều trị nào trước đây</p>
                    )}
                  </div>
                )}

                <h3 className="font-medium text-gray-900 mt-6 mb-4">Tiền sử gia đình</h3>
                
                {isEditingFertility ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <label className="mr-3 text-sm">Hiếm muộn</label>
                      <input
                        type="checkbox"
                        checked={fertilityHistory.familyHistory.infertility}
                        className="h-4 w-4 text-blue-600"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="mr-3 text-sm">Tiểu đường</label>
                      <input
                        type="checkbox"
                        checked={fertilityHistory.familyHistory.diabetes}
                        className="h-4 w-4 text-blue-600"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="mr-3 text-sm">Bệnh tim</label>
                      <input
                        type="checkbox"
                        checked={fertilityHistory.familyHistory.heartDisease}
                        className="h-4 w-4 text-blue-600"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="mr-3 text-sm">Ung thư</label>
                      <input
                        type="checkbox"
                        checked={fertilityHistory.familyHistory.cancer}
                        className="h-4 w-4 text-blue-600"
                      />
                    </div>
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {fertilityHistory.familyHistory.infertility && <li>Hiếm muộn</li>}
                    {fertilityHistory.familyHistory.diabetes && <li>Tiểu đường</li>}
                    {fertilityHistory.familyHistory.heartDisease && <li>Bệnh tim</li>}
                    {fertilityHistory.familyHistory.cancer && <li>Ung thư</li>}
                    {!Object.values(fertilityHistory.familyHistory).some(Boolean) && (
                      <p className="text-gray-500 italic">Không có tiền sử gia đình nào được ghi nhận</p>
                    )}
                  </ul>
                )}
              </div>
            </div>

            {isEditingFertility && (
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  onClick={() => setIsEditingFertility(false)}
                  variant="outline"
                >
                  Hủy
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Account Security */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold flex items-center">
              <Shield className="mr-2 h-5 w-5 text-blue-600" />
              Bảo Mật Tài Khoản
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Đổi mật khẩu</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Cập nhật mật khẩu
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Xác thực hai lớp</h3>
                <p className="text-gray-500 mb-4">Bảo vệ tài khoản của bạn bằng cách thêm một lớp bảo mật bổ sung.</p>
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="font-medium">Xác thực qua SMS</p>
                    <p className="text-sm text-gray-500">Nhận mã xác thực qua tin nhắn SMS khi đăng nhập</p>
                  </div>
                  <div>
                    <Button variant="outline">Thiết lập</Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Quản lý phiên đăng nhập</h3>
                <p className="text-gray-500 mb-4">Kiểm tra các thiết bị đang đăng nhập vào tài khoản của bạn.</p>
                <Button variant="outline">Đăng xuất khỏi tất cả các thiết bị khác</Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PatientProfile;
