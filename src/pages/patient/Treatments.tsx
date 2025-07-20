// src/components/PatientTreatments.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarClock,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Pill,
  Syringe,
  FileText,
  Calendar,
  TestTube,
  ArrowUpRight,
  Microscope,
  Bookmark,
  BarChart,
  Info,
  ArrowLeftCircle
} from "lucide-react";
import { Button } from "../../components/ui/button";
import treatmentPlanAPI from "../../api/patientApi/treatmentPlanAPI";
import type { TreatmentPlan, Medication as APIMedication, TreatmentPlanBooking, Examination, TreatmentStep } from "../../api/patientApi/treatmentPlanAPI";

// Interface cho dữ liệu điều trị hiển thị trong component
interface Medication {
  drugType: string;
  drugName: string;
  description: string;
}

// Hàm ánh xạ API Medication sang component Medication
const mapAPIMedicationToMedication = (apiMedication: APIMedication): Medication => {
  return {
    drugType: apiMedication.drugType,
    drugName: apiMedication.drugName,
    description: apiMedication.description
  };
};

// Hàm ánh xạ TreatmentPlanBooking sang Appointment
const mapTreatmentPlanBookingToAppointment = (booking: TreatmentPlanBooking): Appointment => {
  return {
    id: booking.bookingId,
    date: new Date(booking.dateBooking).toLocaleDateString('vi-VN'),
    time: booking.slotId || "N/A", // Có thể cần mapping slot thành thời gian
    purpose: booking.description || "Tư vấn điều trị",
    status: booking.status.toLowerCase(),
    note: booking.note,
    slotName: booking.slotName || "Không xác định" // Thêm slotName nếu cần
  };
};

// Hàm ánh xạ Examination sang TestResult
const mapExaminationToTestResult = (examination: Examination): TestResult => {
  return {
    id: examination.examinationId,
    date: new Date(examination.examinationDate).toLocaleDateString('vi-VN'),
    type: examination.examinationDescription.includes('IVF') ? 'Khám IVF' : 
          examination.examinationDescription.includes('IUI') ? 'Khám IUI' : 'Khám tổng quát',
    result: examination.result,
    details: examination.examinationDescription,
    status: examination.status,
    note: examination.note
  };
};

interface Appointment { // là booking
  id: string;
  date: string;
  time: string;
  purpose: string;
  status: string;
  note?: string;
  slotName?: string; // Thêm slotName nếu cần
}

interface Examinations {
  examinationId: string;
  doctorId: string;
  patientId: string;
  bookingId: string;
  examinationDate: string;
  examinationDescription: string;
  status: string;
  result: string;
  createAt: string;
  note: string;
}

interface TestResult {
  id: string;
  date: string;
  type: string;
  result: string;
  details: string;
  status: string;
  note: string;
}

interface Stage {
  stepOrder: number;
  stepName: string;
  description: string;
}

interface Treatment { // chắc là treatmentplan
  id: string;
  type: string;
  startDate: string;
  endDate?: string;
  doctor: string;
  status: string;
  progress: number;
  currentStage?: string;
  nextStage?: string;
  nextDate?: string;
  notes: string;
  result?: string;
  giaidoan: string; // Thêm trường giaidoan nếu cần
  medications: Medication[];
  appointments: Appointment[];
  testResults: TestResult[];
  stages: Stage[];
}

const PatientTreatments = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedStages, setExpandedStages] = useState<{ [key: number]: boolean }>({});
  const navigate = useNavigate();
  const { treatmentPlanId } = useParams(); // Lấy treatmentPlanId từ URL

  // Hàm toggle mô tả đầy đủ cho giai đoạn
  const toggleStageDescription = (index: number) => {
    setExpandedStages(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Hàm cắt ngắn mô tả
  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

// Hàm ánh xạ TreatmentStep sang Stage
const mapTreatmentStepToStage = (treatmentStep: TreatmentStep): Stage => {
  return {
    stepOrder: treatmentStep.stepOrder,
    stepName: treatmentStep.stepName,
    description: treatmentStep.description
  };
};

  // Hàm ánh xạ TreatmentPlan sang Treatment
  const mapToTreatment = (plan: TreatmentPlan, medications: Medication[], appointments: Appointment[], testResults: TestResult[], steps: TreatmentStep[] = []): Treatment => {
    // Xác định tiến độ dựa trên trạng thái và số giai đoạn hoàn thành
    const completedProcesses = plan.treatmentProcesses.filter(p => p.status === "completed").length;
    const totalProcesses = plan.treatmentProcesses.length;
    const progress = totalProcesses > 0 ? Math.round((completedProcesses / totalProcesses) * 100) : 0;

    // Lấy giai đoạn hiện tại và tiếp theo
    const currentProcess = plan.treatmentProcesses.find(p => p.status === "in-progress");
    const nextProcess = plan.treatmentProcesses.find(p => p.status === "pending");

    // Ánh xạ treatment steps thành stages
    const stages: Stage[] = steps.map(step => mapTreatmentStepToStage(step));

    return {
      id: plan.treatmentPlanId,
      type: plan.method,
      startDate: plan.startDate,
      endDate: plan.endDate,
      doctor: plan.doctor.doctorName,
      status: plan.status.toLowerCase(),
      progress,
      currentStage: currentProcess?.method,
      nextStage: nextProcess?.method,
      nextDate: nextProcess?.scheduledDate,
      notes: plan.treatmentDescription || "Không có ghi chú",
      result: plan.treatmentProcesses.find(p => p.result)?.result,
      medications,
      appointments,
      testResults,
      stages,
      giaidoan: plan.giaidoan // Thêm trường giaidoan nếu cần
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Giả sử userId được lưu trong localStorage
        const currentUser = localStorage.getItem("userInfo");
        const userId = currentUser ? JSON.parse(currentUser).userId : null;
        if (!userId) {
          throw new Error("Vui lòng đăng nhập để xem thông tin điều trị");
        }

        // Lấy patientId từ userId
        const patientId = await treatmentPlanAPI.getPatientIdFromUserId(userId);
        console.log("Patient ID:", patientId);

        // Lấy danh sách TreatmentPlan
        const treatmentPlans = await treatmentPlanAPI.getAllTreatmentPlansByPatient(patientId);
        console.log("Treatment Plans:", treatmentPlans);

        // Lấy medications, bookings và examinations cho từng treatment plan
        const treatmentPlansWithData = await Promise.all(
          treatmentPlans.map(async (plan) => {
            try {
              // Fetch medications
              const apiMedications = await treatmentPlanAPI.getMedicationsByTreatmentPlanId(plan.treatmentPlanId);
              const medications = apiMedications.map(mapAPIMedicationToMedication);

              // Fetch bookings từ treatment plan
              const treatmentPlanBookings = await treatmentPlanAPI.getBookingsByTreatmentPlanId(plan.treatmentPlanId);
              const appointments = treatmentPlanBookings.map(mapTreatmentPlanBookingToAppointment);

              // Fetch examinations từ tất cả bookings
              const allExaminations: Examinations[] = [];
              for (const booking of treatmentPlanBookings) {
                try {
                  const examinations = await treatmentPlanAPI.getExaminationsByBooking(
                    booking.bookingId, 
                    booking.patientId, 
                    booking.doctorId
                  );
                  allExaminations.push(...examinations);
                } catch (error) {
                  console.error(`Error fetching examinations for booking ${booking.bookingId}:`, error);
                }
              }
              
              const testResults = allExaminations.map(mapExaminationToTestResult);

              // Fetch treatment steps
              const treatmentSteps = await treatmentPlanAPI.getTreatmentStepsByTreatmentPlanId(plan.treatmentPlanId);

              return { plan, medications, appointments, testResults, treatmentSteps };
            } catch (error) {
              console.error(`Error fetching data for plan ${plan.treatmentPlanId}:`, error);
              return { plan, medications: [], appointments: [], testResults: [], treatmentSteps: [] };
            }
          })
        );

        // Ánh xạ dữ liệu sang định dạng Treatment
        const mappedTreatments = treatmentPlansWithData.map(({ plan, medications, appointments, testResults, treatmentSteps }) => 
          mapToTreatment(plan, medications, appointments, testResults, treatmentSteps)
        );
        setTreatments(mappedTreatments);
        
        // Ưu tiên hiển thị treatment plan từ URL nếu có
        if (treatmentPlanId) {
          const targetTreatment = mappedTreatments.find(treatment => treatment.id === treatmentPlanId);
          if (targetTreatment) {
            setSelectedTreatment(targetTreatment);
            console.log(`Auto-selected treatment plan: ${treatmentPlanId}`);
          } else {
            console.warn(`Treatment plan with ID ${treatmentPlanId} not found`);
            setSelectedTreatment(mappedTreatments[0] || null);
          }
        } else {
          // Nếu không có ID từ URL, chọn treatment đầu tiên
          setSelectedTreatment(mappedTreatments[0] || null);
        }
      } catch (err) {
        setError("Không thể tải dữ liệu điều trị. Vui lòng thử lại sau.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [treatmentPlanId]); // Thêm treatmentPlanId vào dependency array

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Filter treatments
  const filteredTreatments = treatments.filter(treatment => {
    const matchesSearch = treatment.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = activeFilter === "all" || treatment.giaidoan === activeFilter;

    return matchesSearch && matchesFilter;
  });

  if (error) {
    return (
      <div className="py-20 flex justify-center items-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Giữ nguyên phần render của component, chỉ thay đổi dữ liệu đầu vào
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý quá trình điều trị</h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <ArrowLeftCircle className="h-5 w-5" />
            Quay lại
          </button>
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
                onClick={() => setActiveFilter("in-progress")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "in-progress"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Đang thực hiện
              </button>
              <button
                onClick={() => setActiveFilter("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeFilter === "pending"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Chờ xác nhận
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
                  placeholder="Tìm kiếm theo loại điều trị, bác sĩ, mã điều trị..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Tìm kiếm
              </Button>
            </form>
          </div>
        </div>
        
        {filteredTreatments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Treatments List */}
            <div className="md:col-span-1 space-y-4">
              {filteredTreatments.map((treatment) => (
                <motion.div
                  key={treatment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white rounded-xl shadow-sm border cursor-pointer hover:shadow-md transition-shadow ${
                    selectedTreatment?.id === treatment.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-100'
                  } ${
                    treatmentPlanId === treatment.id 
                      ? 'bg-blue-50 border-blue-300' 
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedTreatment(treatment);
                    setActiveTab("overview");
                    setExpandedStages({}); // Reset expanded stages when switching treatments
                  }}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
  treatment.giaidoan === 'in-progress'
    ? 'bg-blue-100 text-blue-800'
    : treatment.giaidoan === 'completed'
      ? 'bg-green-100 text-green-800'
      : treatment.giaidoan === 'pending'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-red-100 text-red-800'
}`}>
  {treatment.giaidoan === 'in-progress'
    ? 'Đang thực hiện'
    : treatment.giaidoan === 'completed'
      ? 'Đã hoàn thành'
      : treatment.giaidoan === 'pending'
        ? 'Chờ xác nhận'
        : 'Đã hủy'}
</span>
                      
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900">Điều trị {treatment.type}</h3>
                    <p className="text-gray-600 text-sm mt-1">{treatment.doctor}</p>
                    
                    <div className="flex items-center mt-3 text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Bắt đầu: {treatment.startDate}</span>
                    </div>
                    {treatment.status === 'completed' && treatment.result && (
                      <div className="mt-3 text-sm">
                        <span className="font-medium text-gray-700">Kết quả: </span>
                        <span className={`font-medium ${treatment.result === 'Thành công' ? 'text-green-600' : 'text-red-600'}`}>
                          {treatment.result}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Treatment Detail */}
            <div className="md:col-span-3">
              {selectedTreatment && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Treatment Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Điều trị {selectedTreatment.type}
                        </h2>
                        <p className="text-gray-600">Bác sĩ phụ trách: {selectedTreatment.doctor}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
  selectedTreatment.giaidoan === 'in-progress'
    ? 'bg-blue-100 text-blue-800'
    : selectedTreatment.giaidoan === 'completed'
      ? 'bg-green-100 text-green-800'
      : selectedTreatment.giaidoan === 'pending'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-red-100 text-red-800'
}`}>
  {selectedTreatment.giaidoan === 'in-progress'
    ? 'Đang thực hiện'
    : selectedTreatment.giaidoan === 'completed'
      ? 'Đã hoàn thành'
      : selectedTreatment.giaidoan === 'pending'
        ? 'Chờ xác nhận'
        : 'Đã hủy'}
</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Ngày bắt đầu</p>
                          <p className="font-medium">{selectedTreatment.startDate}</p>
                        </div>
                      </div>
                      
                      {selectedTreatment.status === 'completed' && selectedTreatment.endDate && (
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-500">Ngày kết thúc</p>
                            <p className="font-medium">{selectedTreatment.endDate}</p>
                          </div>
                        </div>
                      )}
                      
                      {selectedTreatment.status === 'in-progress' && selectedTreatment.nextDate && (
                        <div className="flex items-center">
                          <CalendarClock className="h-5 w-5 mr-2 text-yellow-600" />
                          <div>
                            <p className="text-sm text-gray-500">Ngày tiếp theo</p>
                            <p className="font-medium">{selectedTreatment.nextDate}</p>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                  
                  {/* Tabs */}
                  <div className="border-b border-gray-100">
                    <div className="flex overflow-x-auto">
                      <button
                        onClick={() => setActiveTab("overview")}
                        className={`py-3 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
                          activeTab === "overview"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Tổng quan
                      </button>
                      <button
                        onClick={() => setActiveTab("medications")}
                        className={`py-3 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
                          activeTab === "medications"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Thuốc điều trị
                      </button>
                      <button
                        onClick={() => setActiveTab("appointments")}
                        className={`py-3 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
                          activeTab === "appointments"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Lịch hẹn
                      </button>
                      <button
                        onClick={() => setActiveTab("test-results")}
                        className={`py-3 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
                          activeTab === "test-results"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Kết quả khám bệnh
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab("stages");
                          setExpandedStages({}); // Reset expanded stages when switching to stages tab
                        }}
                        className={`py-3 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
                          activeTab === "stages"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Các giai đoạn
                      </button>
                    </div>
                  </div>
                  
                  {/* Tab Content */}
                  <div className="p-6">
                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                      <div>
                        {selectedTreatment.status === 'in-progress' && (
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiến độ điều trị</h3>
                            <div className="mb-4">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Hoàn thành</span>
                                <span className="text-sm font-medium text-gray-700">{selectedTreatment.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${selectedTreatment.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-start">
                                  <div className="mt-0.5 mr-3">
                                    <Bookmark className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 mb-1">Giai đoạn hiện tại</p>
                                    <p className="font-medium text-gray-900">{selectedTreatment.currentStage}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-start">
                                  <div className="mt-0.5 mr-3">
                                    <ArrowUpRight className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 mb-1">Giai đoạn tiếp theo</p>
                                    <p className="font-medium text-gray-900">{selectedTreatment.nextStage}</p>
                                    <p className="text-sm text-blue-600 mt-1">Ngày: {selectedTreatment.nextDate}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {selectedTreatment.status === 'completed' && selectedTreatment.result && (
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kết quả điều trị</h3>
                            <div className={`p-4 rounded-lg ${
                              selectedTreatment.result === 'Thành công'
                                ? 'bg-green-50 border border-green-100'
                                : 'bg-red-50 border border-red-100'
                            }`}>
                              <div className="flex items-start">
                                <div className="mt-0.5 mr-3">
                                  {selectedTreatment.result === 'Thành công' ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                  )}
                                </div>
                                <div>
                                  <p className={`font-medium ${
                                    selectedTreatment.result === 'Thành công'
                                      ? 'text-green-800'
                                      : 'text-red-800'
                                  }`}>
                                    {selectedTreatment.result}
                                  </p>
                                  <p className="text-gray-600 mt-1">{selectedTreatment.notes}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ghi chú từ bác sĩ</h3>
                          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                            <div className="flex items-start">
                              <div className="mt-0.5 mr-3">
                                <Info className="h-5 w-5 text-yellow-600" />
                              </div>
                              <p className="text-gray-700">{selectedTreatment.notes}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="flex items-start">
                                <div className="mt-0.5 mr-3">
                                  <Pill className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Thuốc điều trị</p>
                                  <p className="text-sm text-gray-600">{selectedTreatment.medications.length} loại thuốc</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="flex items-start">
                                <div className="mt-0.5 mr-3">
                                  <Calendar className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Lịch hẹn</p>
                                  <p className="text-sm text-gray-600">{selectedTreatment.appointments.length} lịch hẹn</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="flex items-start">
                                <div className="mt-0.5 mr-3">
                                  <TestTube className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Kết quả khám</p>
                                  <p className="text-sm text-gray-600">{selectedTreatment.testResults.length} kết quả</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Medications Tab */}
                    {activeTab === "medications" && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thuốc điều trị</h3>
                        
                        {selectedTreatment.medications.length > 0 ? (
                          <div className="space-y-4">
                            {selectedTreatment.medications.map((medication, index) => (
                              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                    {medication.drugName.includes('inject') ? (
                                      <Syringe className="h-5 w-5 text-blue-600" />
                                    ) : (
                                      <Pill className="h-5 w-5 text-blue-600" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900">{medication.drugName}</h4>
                                    <p className="text-sm text-gray-500">{medication.drugType}</p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                  <div>
                                    <p className="text-sm text-gray-500">Loại thuốc</p>
                                    <p className="font-medium">{medication.drugType}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Mô tả thuốc</p>
                                    <p className="font-medium">{medication.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">Không có thông tin về thuốc điều trị.</p>
                        )}
                        
                        <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                          <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">Lưu ý quan trọng</p>
                              <p className="text-gray-600 mt-1">
                                Luôn tuân thủ chính xác liều lượng và thời gian dùng thuốc. Nếu có bất kỳ tác dụng phụ nào, hãy liên hệ ngay với bác sĩ.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Appointments Tab */}
                    {activeTab === "appointments" && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch hẹn điều trị</h3>
                        
                        {selectedTreatment.appointments.length > 0 ? (
                          <div className="space-y-4">
                            {selectedTreatment.appointments.map((appointment, index) => (
                              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                  <div className="flex items-center mb-3 md:mb-0">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                      <Calendar className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-gray-900">{appointment.purpose}</h4>
                                      <div className="flex items-center mt-1 text-gray-500 text-sm">
                                        <Calendar className="h-4 w-4 mr-1" /> {appointment.date}
                                        <Clock className="h-4 w-4 ml-3 mr-1" /> {appointment.time} : {appointment.slotName}
                                      </div>
                                      {/* <p className="text-xs text-gray-400 mt-1">ID: {appointment.id}</p> */}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      appointment.status === 'pending' 
                                        ? 'bg-yellow-100 text-yellow-800' 
                                        : appointment.status === 'confirmed'
                                          ? 'bg-blue-100 text-blue-800'
                                          : appointment.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                      {appointment.status === 'pending' 
                                        ? 'Chờ xác nhận' 
                                        : appointment.status === 'confirmed'
                                          ? 'Đã xác nhận'
                                          : appointment.status === 'completed'
                                            ? 'Đã hoàn thành'
                                            : 'Đã hủy'}
                                    </span>
                                  </div>
                                </div>
                                
                                {appointment.note && (
                                  <div className="mt-3 pt-3 border-t border-gray-100">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                      <p className="text-sm text-gray-600">
                                        <span className="font-medium">Ghi chú:</span> {appointment.note}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                
                                {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                                    <Link to={`/patient/appointments`}>
                                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                        Xem chi tiết
                                      </Button>
                                    </Link>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Calendar className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 mb-4">Chưa có lịch hẹn nào cho kế hoạch điều trị này.</p>
                            <Link to="/booking">
                              <Button className="bg-blue-600 hover:bg-blue-700">
                                Đặt lịch hẹn mới
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Test Results Tab */}
                    {activeTab === "test-results" && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kết quả khám bệnh</h3>
                        
                        {selectedTreatment.testResults.length > 0 ? (
                          <div className="space-y-4">
                            {selectedTreatment.testResults.map((result) => (
                              <div key={result.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                    {result.type.includes('IVF') ? (
                                      <Microscope className="h-5 w-5 text-blue-600" />
                                    ) : result.type.includes('IUI') ? (
                                      <TestTube className="h-5 w-5 text-blue-600" />
                                    ) : (
                                      <BarChart className="h-5 w-5 text-blue-600" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium text-gray-900">{result.type}</h4>
                                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        result.status === 'completed'
                                          ? 'bg-green-100 text-green-800'
                                          : result.status === 'in-progress'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {result.status}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{result.date}</p>
                                  </div>
                                </div>
                                
                                <div className="mt-3">
                                  <div className="mb-3">
                                    <span className="text-sm font-medium text-gray-700">Mô tả khám bệnh:</span>
                                    <p className="text-sm text-gray-600 mt-1">{result.details}</p>
                                  </div>
                                  
                                  <div className="mb-3">
                                    <span className="text-sm font-medium text-gray-700">Kết quả:</span>
                                    <div className="bg-gray-50 p-3 rounded mt-1">
                                      <p className="text-sm text-gray-700">{result.result}</p>
                                    </div>
                                  </div>
                                  
                                  {result.note && (
                                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                      <div className="flex items-start">
                                        <Info className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <p className="text-sm font-medium text-yellow-800">Ghi chú từ bác sĩ:</p>
                                          <p className="text-sm text-yellow-700 mt-1">{result.note}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <TestTube className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 mb-4">Chưa có kết quả khám bệnh nào cho kế hoạch điều trị này.</p>
                            <p className="text-sm text-gray-400">Kết quả khám sẽ được cập nhật sau mỗi lần thăm khám.</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Stages Tab */}
                    {activeTab === "stages" && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Các giai đoạn điều trị</h3>
                        
                        {selectedTreatment.stages.length > 0 ? (
                          <div className="relative">
                            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                            
                            <div className="space-y-6">
                              {selectedTreatment.stages
                                .sort((a, b) => a.stepOrder - b.stepOrder)
                                .map((stage, index) => {
                                  const isExpanded = expandedStages[index];
                                  const shouldTruncate = stage.description.length > 150;
                                  const displayDescription = isExpanded || !shouldTruncate 
                                    ? stage.description 
                                    : truncateDescription(stage.description);
                                  
                                  return (
                                    <div key={index} className="relative flex items-start">
                                      <div className="absolute left-0 w-10 h-10 rounded-full flex items-center justify-center z-10 bg-blue-100 border-2 border-white shadow-sm">
                                        <span className="text-sm font-medium text-blue-600">{stage.stepOrder}</span>
                                      </div>
                                      
                                      <div className="ml-16 bg-white border border-gray-200 rounded-lg p-4 shadow-sm w-full">
                                        <h4 className="font-semibold text-blue-600 mb-2">
                                          {stage.stepName}
                                        </h4>
                                        
                                        <div className="text-gray-600 leading-relaxed">
                                          <p className="whitespace-pre-wrap">{displayDescription}</p>
                                          
                                          {shouldTruncate && (
                                            <button
                                              onClick={() => toggleStageDescription(index)}
                                              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none focus:underline transition-colors"
                                            >
                                              {isExpanded ? (
                                                <span className="flex items-center">
                                                  Ẩn bớt
                                                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                  </svg>
                                                </span>
                                              ) : (
                                                <span className="flex items-center">
                                                  Xem thêm
                                                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                  </svg>
                                                </span>
                                              )}
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <FileText className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 mb-2">Không có thông tin về các giai đoạn điều trị.</p>
                            <p className="text-sm text-gray-400">Các giai đoạn điều trị sẽ được cập nhật khi có kế hoạch chi tiết.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy quá trình điều trị</h3>
            <p className="text-gray-500 mb-6">
              {activeFilter === "all" 
                ? "Bạn chưa có quá trình điều trị nào. Hãy đặt lịch tư vấn để bắt đầu." 
                : `Không tìm thấy quá trình điều trị nào ở trạng thái "${
                    activeFilter === "in-progress" 
                      ? "đang thực hiện" 
                      : activeFilter === "completed" 
                        ? "đã hoàn thành" 
                        : "đã hủy"
                  }".`}
            </p>
            <Link to="/booking">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Đặt lịch tư vấn
              </Button>
            </Link>
          </div>
        )}
        
        {/* Treatment Guidelines */}
        <div className="mt-10 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hướng dẫn về quá trình điều trị</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Quá trình IUI</h4>
              <p className="text-gray-600 text-sm mb-4">
                Quá trình IUI thường kéo dài 2-3 tuần cho một chu kỳ, bao gồm kích thích buồng trứng, theo dõi nang trứng, và bơm tinh trùng vào tử cung.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Ít xâm lấn hơn IVF</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Chi phí thấp hơn</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Thường được thử trước IVF</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Quá trình IVF</h4>
              <p className="text-gray-600 text-sm mb-4">
                Quá trình IVF thường kéo dài 4-6 tuần cho một chu kỳ, bao gồm kích thích buồng trứng, chọc hút trứng, thụ tinh trong phòng thí nghiệm và chuyển phôi.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Tỷ lệ thành công cao hơn IUI</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Phù hợp cho nhiều loại vô sinh</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Có thể trữ đông phôi cho lần sau</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientTreatments;