// Page for doctors to manage their patients
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
  HeartPulse,
  ClipboardList,
  CalendarClock
} from "lucide-react";
import { Button } from "../../components/ui/button";

// Import API functions
import { 
  getPatientsByDoctorId, 
  getPatientDetails, 
  getPatientTreatmentHistory, 
  getPatientTestResults, 
  updatePatientNote, 
  addNewTreatmentRecord,
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
        // Get userId (doctorId) from localStorage
        const userInfo = localStorage.getItem("userInfo");
        const userId = userInfo ? JSON.parse(userInfo).userId : null;

        if (!userId) {
          console.error("Không tìm thấy userId trong localStorage");
          setLoading(false);
          return;
        }

        const patientsData = await getPatientsByDoctorId(userId);
        setPatients(patientsData);
        
        // Check if patientId is in URL params
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
  
  // Refresh appointments when URL params change (e.g., after creating a new appointment)
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
          // Sort by examinationDate to get the latest one
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
      
      // Fetch patient appointments
      setLoadingAppointments(true);
      const appointments = await getAppointmentsByPatientId(patientId);
      // Sort by date, most recent first
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

  // Add new treatment record function
  const addTreatmentRecord = async (patientId: string, treatmentPlanId: string, result: string, status: string) => {
    try {
      setLoading(true);
      // Get doctorId from localStorage
      const userInfo = localStorage.getItem("userInfo");
      const doctorId = userInfo ? JSON.parse(userInfo).userId : null;

      if (!doctorId) {
        console.error("Không tìm thấy doctorId trong localStorage");
        setLoading(false);
        return;
      }

      const today = new Date().toISOString();
      const recordData = {
        patientId,
        doctorId,
        treatmentPlanId,
        processDate: today,
        result,
        status
      };

      await addNewTreatmentRecord(recordData);
      
      // Refresh patient details to show the new treatment record
      const updatedPatient = await getPatientDetails(patientId);
      setSelectedPatient(updatedPatient);
      
      // Update the patient in the list
      setPatients(patients.map(p => p.patientId === patientId ? updatedPatient : p));
      
      setLoading(false);
    } catch (error) {
      console.error(`Lỗi khi thêm bản ghi điều trị cho bệnh nhân ${patientId}:`, error);
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý bệnh nhân</h1>
            <p className="mt-1 text-gray-600">Xem và quản lý thông tin bệnh nhân</p>
          </div>
          <Button 
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/register')}
          >
            <User className="mr-2 h-4 w-4" />
            Thêm bệnh nhân mới
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Tìm kiếm bệnh nhân..."
                />
              </div>
            </div>
            <Button variant="outline" onClick={resetFilters} className="border-gray-300 text-gray-700">
              <Filter className="mr-2 h-4 w-4" />
              Xóa bộ lọc
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Danh sách bệnh nhân</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thông tin liên hệ</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                      <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
                    </td>
                  </tr>
                ) : currentPatients.length > 0 ? (
                  currentPatients.map((patient) => (
                    <tr 
                      key={patient.patientId} 
                      className={`hover:bg-gray-50 cursor-pointer ${patient.patientId === selectedPatientId ? 'bg-blue-50' : ''}`}
                      onClick={() => handleSelectPatient(patient.patientId)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                            <div className="text-sm text-gray-500">
                              {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} tuổi, {patient.gender}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-1" />
                          {patient.phone}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Mail className="h-4 w-4 text-gray-400 mr-1" />
                          {patient.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPatient(patient.patientId);
                          }}
                        >
                          Xem hồ sơ
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      Không tìm thấy bệnh nhân nào
                    </td>
                  </tr>
                )}
              </tbody>
              </table>
            </div>
            {currentPatients.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-gray-500">Không tìm thấy bệnh nhân</p>
                <Button onClick={resetFilters} className="mt-2 bg-blue-600 hover:bg-blue-700">
                  Xóa bộ lọc
                </Button>
              </div>
            )}
            {pageCount > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="hidden sm:flex sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{(currentPage - 1) * patientsPerPage + 1}</span> đến{' '}
                    <span className="font-medium">{Math.min(currentPage * patientsPerPage, filteredPatients.length)}</span>{' '}
                    trong số <span className="font-medium">{filteredPatients.length}</span> bệnh nhân
                  </p>
                  <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: pageCount }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`px-4 py-2 border ${
                          currentPage === i + 1 ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        } text-sm font-medium`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === pageCount}
                      className="px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
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
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 text-center">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                  <p className="mt-3 text-gray-500">Đang tải thông tin...</p>
                </div>
              ) : selectedPatient ? (
                <div className="text-left">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{selectedPatient.name}</h3>
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
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Thông tin cá nhân</h4>
                      <div className="text-sm">
                        <div className="flex items-center mb-1">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear()} tuổi, {selectedPatient.gender}</span>
                        </div>
                        <div className="flex items-center mb-1">
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
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Tiến trình điều trị</h4>
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Tiến độ</span>
                          <span>{selectedPatient.progressPercentage || 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500" 
                            style={{ width: `${selectedPatient.progressPercentage || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center mb-1">
                          <HeartPulse className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{selectedPatient.treatmentType || "Chưa có điều trị"}</span>
                        </div>
                        <div className="flex items-center mb-1">
                          <ClipboardList className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{selectedPatient.treatmentCount || 0} lần điều trị</span>
                        </div>
                        {selectedPatient.treatmentType && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-1 w-full text-purple-600 border-purple-300"
                            onClick={() => {
                              // In a real implementation, you'd use a form in a modal
                              // This is a simplified example to demonstrate the function
                              
                              // Get all treatment plans from the API
                              getPatientTreatmentHistory(selectedPatient.patientId)
                                .then(history => {
                                  if (history.treatmentPlans && history.treatmentPlans.length > 0) {
                                    const treatmentPlanId = history.treatmentPlans[0].treatmentPlanId;
                                    
                                    // Add a treatment record
                                    addTreatmentRecord(
                                      selectedPatient.patientId,
                                      treatmentPlanId,
                                      "Bệnh nhân tiến triển tốt",
                                      "Đang điều trị"
                                    );
                                  } else {
                                    alert("Bệnh nhân chưa có kế hoạch điều trị");
                                  }
                                })
                                .catch(error => {
                                  console.error("Lỗi khi lấy kế hoạch điều trị:", error);
                                });
                            }}
                          >
                            Thêm bản ghi điều trị
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Ghi chú khám</h4>
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
                        className="mt-2 w-full text-blue-600"
                        onClick={async () => {
                          try {
                            // Get the patient's appointments to find a suitable bookingId
                            const appointments = await getAppointmentsByPatientId(selectedPatient.patientId);
                            
                            if (appointments.length === 0) {
                              alert("Bệnh nhân chưa có lịch hẹn nào để cập nhật ghi chú.");
                              return;
                            }
                            
                            // Use the most recent appointment for the note
                            const latestAppointment = appointments[0];
                            
                            // Get the latest test result note for pre-filling the prompt
                            const testResults = await getPatientTestResults(selectedPatient.patientId);
                            const sortedResults = testResults.sort((a, b) => 
                              new Date(b.examinationDate).getTime() - new Date(a.examinationDate).getTime()
                            );
                            const currentNote = sortedResults.length > 0 ? sortedResults[0].note : "";
                            
                            // In a real implementation, you'd use a dialog or modal
                            const note = prompt("Nhập ghi chú khám bệnh:", currentNote || "");
                            
                            if (note !== null) {
                              // Hiển thị trạng thái loading
                              setIsLoadingNote(true);
                              
                              // Cập nhật ghi chú
                              await updatePatientNote(selectedPatient.patientId, 
                                JSON.parse(localStorage.getItem("userInfo") || "{}").userId, 
                                note, 
                                latestAppointment.bookingId
                              );
                              
                              // Lấy kết quả mới nhất ngay lập tức
                              const updatedResults = await getPatientTestResults(selectedPatient.patientId);
                              const updatedSortedResults = updatedResults.sort((a, b) => 
                                new Date(b.examinationDate).getTime() - new Date(a.examinationDate).getTime()
                              );
                              
                              // Cập nhật state để hiển thị ngay lập tức
                              if (updatedSortedResults.length > 0 && updatedSortedResults[0].note) {
                                setLatestNote(updatedSortedResults[0].note);
                              }
                              
                              // Kết thúc loading
                              setIsLoadingNote(false);
                              
                              // Refreshing patient details in the background
                              const updatedPatient = await getPatientDetails(selectedPatient.patientId);
                              setSelectedPatient(updatedPatient);
                              setPatients(patients.map(p => p.patientId === selectedPatient.patientId ? updatedPatient : p));
                              
                              // Refresh the appointments list
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
                        Cập nhật ghi chú khám
                      </Button>
                    </div>
                    
                    <div className="pt-2 space-y-2">
                      <Button
                        variant="outline"
                        className="w-full border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => navigate(`/doctor/create-appointment?patientId=${selectedPatient.patientId}`)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Tạo lịch hẹn mới
                      </Button>
                    </div>
                    
                    {/* Patient Appointments Section */}
                    <div className="mt-6 border-t pt-4">
                      <h3 className="text-md font-semibold flex items-center mb-3">
                        <CalendarClock className="h-4 w-4 mr-2 text-blue-500" />
                        Lịch sử các cuộc hẹn
                      </h3>
                      
                      {loadingAppointments ? (
                        <div className="flex items-center justify-center py-4">
                          <span className="animate-spin h-5 w-5 border-b-2 border-blue-500 mr-2"></span>
                          <span>Đang tải danh sách cuộc hẹn...</span>
                        </div>
                      ) : patientAppointments.length > 0 ? (
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {patientAppointments.map((appointment) => (
                            <div 
                              key={appointment.bookingId} 
                              className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-blue-600">
                                    {appointment.service?.name || "Dịch vụ không xác định"}
                                  </p>
                                  <div className="text-sm text-gray-600 space-y-1 mt-1">
                                    <p className="flex items-center">
                                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                      {new Date(appointment.dateBooking).toLocaleDateString('vi-VN')}
                                    </p>
                                    <p className="flex items-center">
                                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                                      {appointment.slot?.startTime} - {appointment.slot?.endTime}
                                    </p>
                                    {appointment.note && (
                                      <p className="flex items-start">
                                        <FileText className="h-3.5 w-3.5 mr-1.5 mt-0.5" />
                                        <span className="line-clamp-2">{appointment.note}</span>
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${
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
                        <p className="text-center text-gray-500 py-4">
                          Bệnh nhân này chưa có cuộc hẹn nào
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Chọn bệnh nhân</h3>
                  <p className="text-gray-500">Chọn một bệnh nhân để xem chi tiết</p>
                </>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-8 bg-blue-50 rounded-xl shadow-sm border border-blue-100 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Truy cập nhanh</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link to="/doctor/appointments">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Lịch hẹn hôm nay</h3>
                      <p className="text-sm text-gray-600">Xem lịch hẹn</p>
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
              <Link to={`/doctor/treatment-records?patientId=${selectedPatient?.patientId}`}>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Hồ sơ điều trị</h3>
                      <p className="text-sm text-gray-600">Xem hồ sơ</p>
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
                    <p className="text-sm text-gray-600">Xem kết quả</p>
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