import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
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
  CalendarClock,
  ArrowLeftCircle
} from "lucide-react";
import { Button } from "../../components/ui/button";

// Import API functions
import { 
  getPatientsByDoctorId, 
  getPatientDetails, 
  getPatientTestResults, 
  updatePatientNote, 
  getAppointmentsByPatientId
} from "../../api/doctorApi/patientsAPI";

// Import types with type-only imports
import type { 
  Patient,
  Booking
} from "../../api/doctorApi/patientsAPI";

const DoctorPatients = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [latestNote, setLatestNote] = useState<string>("");
  const [isLoadingNote, setIsLoadingNote] = useState<boolean>(false);
  const [patientAppointments, setPatientAppointments] = useState<Booking[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(false);
  const patientsPerPage = 5;

  // Fetch patients on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const userInfo = localStorage.getItem("userInfo");
        const userId = userInfo ? JSON.parse(userInfo).userId : null;

        if (!userId) {
          console.error("Không tìm thấy userId trong localStorage");
          setLoading(false);
          return;
        }

        const patientsData = await getPatientsByDoctorId(userId);
        setPatients(patientsData);
        
        const patientIdFromUrl = searchParams.get('patientId');
        if (patientIdFromUrl) {
          handleSelectPatient(patientIdFromUrl);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bệnh nhân:", error);
        setLoading(false);
      }
    };

    fetchPatients();
  }, [searchParams]);

  // Refresh appointments when URL params or selected patient change
  useEffect(() => {
    if (selectedPatient?.patientId) {
      const refreshAppointments = async () => {
        setLoadingAppointments(true);
        try {
          const appointments = await getAppointmentsByPatientId(selectedPatient.patientId);
          const sortedAppointments = appointments.sort((a, b) => 
            new Date(b.dateBooking).getTime() - new Date(a.dateBooking).getTime()
          );
          setPatientAppointments(sortedAppointments);
        } catch (error) {
          console.error("Lỗi khi làm mới danh sách cuộc hẹn:", error);
        } finally {
          setLoadingAppointments(false);
        }
      };
      refreshAppointments();
    }
  }, [searchParams, selectedPatient?.patientId]);

  // Fetch latest note when patient changes
  useEffect(() => {
    const fetchLatestNote = async () => {
      if (selectedPatient?.patientId) {
        setIsLoadingNote(true);
        try {
          const testResults = await getPatientTestResults(selectedPatient.patientId);
          const sortedResults = testResults.sort((a, b) => 
            new Date(b.examinationDate).getTime() - new Date(a.examinationDate).getTime()
          );
          
          if (sortedResults.length > 0 && sortedResults[0].note) {
            setLatestNote(sortedResults[0].note);
          } else {
            setLatestNote("Không có ghi chú khám bệnh");
          }
        } catch (error) {
          console.error("Lỗi khi lấy kết quả xét nghiệm:", error);
          setLatestNote("Không thể tải ghi chú khám bệnh");
        } finally {
          setIsLoadingNote(false);
        }
      }
    };
    
    fetchLatestNote();
  }, [selectedPatient?.patientId, patientAppointments.length]);

  // Filter patients based on search term
  const filteredPatients = patients.filter((patient) => {
    return (
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.phone && patient.phone.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Pagination logic
  const currentPatients = filteredPatients.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage
  );
  const pageCount = Math.ceil(filteredPatients.length / patientsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Handle patient selection
  const handleSelectPatient = async (patientId: string) => {
    try {
      setLoading(true);
      setSelectedPatientId(patientId);
      
      const patientDetails = await getPatientDetails(patientId);
      setSelectedPatient(patientDetails);
      
      setLoadingAppointments(true);
      const appointments = await getAppointmentsByPatientId(patientId);
      const sortedAppointments = appointments.sort((a, b) => 
        new Date(b.dateBooking).getTime() - new Date(a.dateBooking).getTime()
      );
      setPatientAppointments(sortedAppointments);
      setLoadingAppointments(false);
      
      setLoading(false);
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin chi tiết của bệnh nhân ${patientId}:`, error);
      setLoading(false);
      setLoadingAppointments(false);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý bệnh nhân</h1>
            <p className="mt-1 text-sm text-gray-600">Xem và quản lý thông tin bệnh nhân</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftCircle className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Tìm kiếm bệnh nhân..."
              />
            </div>
            <Button variant="outline" onClick={resetFilters} className="border-gray-300 text-gray-700">
              <Filter className="mr-2 h-4 w-4" />
              Xóa bộ lọc
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Danh sách bệnh nhân</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thông tin liên hệ</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">Đang tải dữ liệu...</p>
                      </td>
                    </tr>
                  ) : currentPatients.length > 0 ? (
                    currentPatients.map((patient) => (
                      <tr 
                        key={patient.patientId} 
                        className={`hover:bg-gray-50 cursor-pointer ${patient.patientId === selectedPatientId ? 'bg-blue-50' : ''}`}
                        onClick={() => handleSelectPatient(patient.patientId)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                              <div className="text-xs text-gray-500">
                                {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} tuổi, {patient.gender}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-1" />
                            {patient.phone}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Mail className="h-4 w-4 text-gray-400 mr-1" />
                            {patient.email}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => navigate(`/doctor/create-appointment?patientId=${patient.patientId}`)}
                          >
                            <CalendarClock className="mr-1 h-3 w-3" />
                            Lịch mới
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-center text-sm text-gray-500">
                        Không tìm thấy bệnh nhân nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {currentPatients.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500">Không tìm thấy bệnh nhân</p>
                <Button onClick={resetFilters} className="mt-2 bg-blue-600 hover:bg-blue-700 text-sm">
                  Xóa bộ lọc
                </Button>
              </div>
            )}
            {pageCount > 1 && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{(currentPage - 1) * patientsPerPage + 1}</span> đến{' '}
                    <span className="font-medium">{Math.min(currentPage * patientsPerPage, filteredPatients.length)}</span>{' '}
                    / <span className="font-medium">{filteredPatients.length}</span> bệnh nhân
                  </p>
                  <nav className="flex rounded-md shadow-sm">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 py-1 rounded-l-md border border-gray-300 bg-white text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: pageCount }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`px-3 py-1 border ${
                          currentPage === i + 1 ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        } text-sm`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === pageCount}
                      className="px-2 py-1 rounded-r-md border border-gray-300 bg-white text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-sm text-gray-500">Đang tải thông tin...</p>
                </div>
              ) : selectedPatient ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{selectedPatient.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedPatient.treatmentStage === "Hoàn thành" 
                        ? "bg-green-100 text-green-800" 
                        : selectedPatient.treatmentStage === "Đang điều trị"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {selectedPatient.treatmentStage || "Chưa bắt đầu"}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 mb-1">Thông tin cá nhân</h4>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear()} tuổi, {selectedPatient.gender}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{selectedPatient.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{selectedPatient.email}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 mb-1">Ghi chú khám</h4>
                    <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      {isLoadingNote ? (
                        <span className="flex items-center justify-center">
                          <span className="animate-spin h-4 w-4 border-b-2 border-blue-500 mr-2"></span>
                          Đang tải ghi chú...
                        </span>
                      ) : (
                        latestNote
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 w-full text-blue-600 text-sm"
                      onClick={async () => {
                        try {
                          const appointments = await getAppointmentsByPatientId(selectedPatient.patientId);
                          if (appointments.length === 0) {
                            alert("Bệnh nhân chưa có lịch hẹn nào để cập nhật ghi chú.");
                            return;
                          }
                          const latestAppointment = appointments[0];
                          const testResults = await getPatientTestResults(selectedPatient.patientId);
                          const sortedResults = testResults.sort((a, b) => 
                            new Date(b.examinationDate).getTime() - new Date(a.examinationDate).getTime()
                          );
                          const currentNote = sortedResults.length > 0 ? sortedResults[0].note : "";
                          const note = prompt("Nhập ghi chú khám bệnh:", currentNote || "");
                          if (note !== null) {
                            setIsLoadingNote(true);
                            await updatePatientNote(
                              selectedPatient.patientId, 
                              JSON.parse(localStorage.getItem("userInfo") || "{}").userId, 
                              note, 
                              latestAppointment.bookingId
                            );
                            const updatedResults = await getPatientTestResults(selectedPatient.patientId);
                            const updatedSortedResults = updatedResults.sort((a, b) => 
                              new Date(b.examinationDate).getTime() - new Date(a.examinationDate).getTime()
                            );
                            if (updatedSortedResults.length > 0 && updatedSortedResults[0].note) {
                              setLatestNote(updatedSortedResults[0].note);
                            }
                            setIsLoadingNote(false);
                            const updatedPatient = await getPatientDetails(selectedPatient.patientId);
                            setSelectedPatient(updatedPatient);
                            setPatients(patients.map(p => p.patientId === selectedPatient.patientId ? updatedPatient : p));
                            const updatedAppointments = await getAppointmentsByPatientId(selectedPatient.patientId);
                            const sortedAppointments = updatedAppointments.sort((a, b) => 
                              new Date(b.dateBooking).getTime() - new Date(a.dateBooking).getTime()
                            );
                            setPatientAppointments(sortedAppointments);
                          }
                        } catch (error) {
                          console.error("Lỗi khi cập nhật ghi chú bệnh nhân:", error);
                          setIsLoadingNote(false);
                        }
                      }}
                    >
                      Cập nhật ghi chú
                    </Button>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      className="w-full border-green-500 text-green-600 hover:bg-green-50 text-sm"
                      onClick={() => navigate(`/doctor/create-appointment?patientId=${selectedPatient.patientId}`)}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Tạo lịch hẹn mới
                    </Button>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="text-xs font-semibold text-gray-500 mb-2 flex items-center">
                      <CalendarClock className="h-4 w-4 mr-2 text-blue-500" />
                      Lịch sử cuộc hẹn
                    </h4>
                    {loadingAppointments ? (
                      <div className="flex items-center justify-center py-3">
                        <span className="animate-spin h-4 w-4 border-b-2 border-blue-500 mr-2"></span>
                        <span className="text-sm">Đang tải...</span>
                      </div>
                    ) : patientAppointments.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {patientAppointments.map((appointment) => (
                          <div 
                            key={appointment.bookingId} 
                            className="bg-gray-50 rounded-md border border-gray-200 p-2"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-blue-600">
                                  {appointment.service?.name || "Dịch vụ không xác định"}
                                </p>
                                <div className="text-xs text-gray-600 space-y-1 mt-1">
                                  <p className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(appointment.dateBooking).toLocaleDateString('vi-VN')}
                                  </p>
                                  <p className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {appointment.slot?.startTime} - {appointment.slot?.endTime}
                                  </p>
                                  {appointment.note && (
                                    <p className="flex items-start">
                                      <FileText className="h-3 w-3 mr-1 mt-0.5" />
                                      <span className="line-clamp-1">{appointment.note}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                appointment.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                appointment.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                                appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                appointment.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {appointment.status === 'Completed' ? 'Hoàn thành' :
                                 appointment.status === 'Confirmed' ? 'Đã xác nhận' :
                                 appointment.status === 'Pending' ? 'Chờ xác nhận' :
                                 appointment.status === 'Cancelled' ? 'Đã hủy' :
                                 appointment.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-sm text-gray-500 py-3">
                        Chưa có cuộc hẹn nào
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <User className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <h3 className="text-sm font-medium text-gray-900">Chọn bệnh nhân</h3>
                  <p className="text-xs text-gray-500">Chọn một bệnh nhân để xem chi tiết</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-6 bg-blue-50 rounded-lg shadow-sm border border-blue-100"
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Truy cập nhanh</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link to="/doctor/appointments">
                <div className="bg-white p-3 rounded-md shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Lịch hẹn hôm nay</h3>
                    <p className="text-xs text-gray-600">Xem lịch hẹn</p>
                  </div>
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </Link>
              <Link to={`/doctor/treatment-records?patientId=${selectedPatient?.patientId}`}>
                <div className="bg-white p-3 rounded-md shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Hồ sơ điều trị</h3>
                    <p className="text-xs text-gray-600">Xem hồ sơ</p>
                  </div>
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorPatients;