import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark } from "lucide-react";
import { Button } from "../../components/ui/button";
import treatmentPlanAPI from "../../api/patientApi/treatmentPlanAPI";
import type { TreatmentPlan, TreatmentStep } from "../../api/patientApi/treatmentPlanAPI";
import { bookingApi, getPatientDetailIdByPatientId} from "../../api/patientApi/bookingAPI";
import type { Booking } from "../../api/patientApi/bookingAPI";

export default function ComponentTrackingTRM() {
  const [patientId, setPatientId] = useState<string | null>(null);
  const [patientDetailId, setPatientDetailId] = useState<string | null>(null);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [treatmentSteps, setTreatmentSteps] = useState<Record<string, TreatmentStep[]>>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(() => {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo).userId : null;
  });

  // Hàm lấy thông tin patient từ localStorage
  const getPatientInfoFromLocalStorage = () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) return null;
      
      const parsedUserInfo = JSON.parse(userInfo);
      // Lấy patientId từ localStorage, cái này có tui có lưu rồi
      const patientId = localStorage.getItem("patientId");
      
      return {
        userId: parsedUserInfo.userId,
        patientId: patientId || null
      };
    } catch (error) {
      console.error("Error parsing userInfo from localStorage:", error);
      return null;
    }
  };

  // Lắng nghe thay đổi localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const patientInfo = getPatientInfoFromLocalStorage();
      const newUserId = patientInfo?.userId || null;
      const newPatientId = patientInfo?.patientId || null;
      
      if (newUserId !== userId) {
        setUserId(newUserId);
        setPatientId(newPatientId);
        setPatientDetailId(null);
        setTreatmentPlans([]);
        setTreatmentSteps({});
        setBookings([]);
        setLoading(true);
      }
    };

    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [userId]);

  // Lấy patientId từ localStorage và patientDetailId từ API
  useEffect(() => {
    const patientInfo = getPatientInfoFromLocalStorage();
    
    if (patientInfo?.userId && patientInfo?.patientId) {
      setUserId(patientInfo.userId);
      setPatientId(patientInfo.patientId);
      
      // Chỉ cần gọi API để lấy patientDetailId
      setLoading(true);
      setError(null);
      
      getPatientDetailIdByPatientId(patientInfo.patientId)
        .then((detailId) => {
          setPatientDetailId(detailId);
        })
        .catch((err) => {
          console.error("Lỗi lấy patientDetailId:", err);
          setPatientDetailId(null);
          setError("Lỗi lấy thông tin chi tiết bệnh nhân");
        })
        .finally(() => setLoading(false));
    } else {
      // Reset tất cả state nếu không có thông tin patient
      setUserId(null);
      setPatientId(null);
      setPatientDetailId(null);
      setTreatmentPlans([]);
      setTreatmentSteps({});
      setBookings([]);
      setLoading(false);
    }
  }, []);  // Chỉ chạy một lần khi component mount

  // Lấy bookings và treatmentPlans
  useEffect(() => {
    if (patientId && patientDetailId) {
      setLoading(true);
      setError(null);
      Promise.all([
        bookingApi.getMyBookings(),
        treatmentPlanAPI.getAllTreatmentPlansByPatient(patientId),
      ])
        .then(async ([bookingsData, plans]) => {
          setBookings(bookingsData); // Lưu tất cả bookings để kiểm tra trạng thái

          // Lọc treatmentPlans dựa trên patientDetailId, doctorId, và serviceId
          const matchedPlans = plans.filter((plan) =>
            bookingsData.some(
              (booking) =>
                booking.patientId === patientId &&
                booking.doctorId === plan.doctorId &&
                booking.serviceId === plan.serviceId &&
                patientDetailId === plan.patientDetailId
            )
          );
          setTreatmentPlans(matchedPlans);

          // Lấy treatment steps cho từng treatment plan
          const stepsPromises = matchedPlans.map(plan => 
            treatmentPlanAPI.getTreatmentStepsByTreatmentPlanId(plan.treatmentPlanId)
              .then(steps => ({ planId: plan.treatmentPlanId, steps }))
              .catch(err => {
                console.error(`Error fetching steps for plan ${plan.treatmentPlanId}:`, err);
                return { planId: plan.treatmentPlanId, steps: [] };
              })
          );

          const stepsResults = await Promise.all(stepsPromises);
          const stepsMap = stepsResults.reduce((acc, { planId, steps }) => {
            acc[planId] = steps;
            return acc;
          }, {} as Record<string, TreatmentStep[]>);
          
          setTreatmentSteps(stepsMap);
        })
        .catch((err) => {
          console.error("Lỗi tải dữ liệu:", err);
          setError("Lỗi tải dữ liệu điều trị hoặc lịch hẹn");
        })
        .finally(() => setLoading(false));
    } else {
      setTreatmentPlans([]);
      setTreatmentSteps({});
      setBookings([]);
    }
  }, [patientId, patientDetailId]);

  // Hàm parse treatmentDescription (deprecated - giữ lại để không break existing code)
  function parseTreatmentDescription(description: string): string[] {
    if (!description) return [];
    return description
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  // Hàm tính tiến độ điều trị mới dựa trên treatment steps
  function calculateTreatmentProgressFromSteps(treatmentPlanId: string, currentStatus: string): {
    progress: number;
    currentStage: string;
    nextStage: string;
    totalSteps: number;
    completedSteps: number;
  } {
    const steps = treatmentSteps[treatmentPlanId] || [];
    
    if (steps.length === 0) {
      return {
        progress: 0,
        currentStage: currentStatus || "Chưa bắt đầu",
        nextStage: "Chưa xác định",
        totalSteps: 0,
        completedSteps: 0
      };
    }

    // Sắp xếp các steps theo stepOrder để có thứ tự chính xác
    const sortedSteps: TreatmentStep[] = steps.sort((a, b) => a.stepOrder - b.stepOrder);
    
    let completedSteps = 0;
    let currentStage = "Chưa bắt đầu";
    let nextStage = "Hoàn thành";

    if (currentStatus) {
      // Tìm step matching chính xác với currentStatus bằng stepName
      const currentStepIndex = sortedSteps.findIndex(step => 
        step.stepName.toLowerCase() === currentStatus.toLowerCase()
      );

      if (currentStepIndex !== -1) {
        // Tìm thấy step hiện tại, đếm số bước đã hoàn thành
        completedSteps = currentStepIndex + 1;
        currentStage = sortedSteps[currentStepIndex].stepName;
        
        // Tìm bước tiếp theo
        if (currentStepIndex + 1 < sortedSteps.length) {
          nextStage = sortedSteps[currentStepIndex + 1].stepName;
        } else {
          nextStage = "Hoàn thành";
        }
      } else {
        // Nếu không tìm thấy step matching, kiểm tra các trạng thái đặc biệt
        const statusLower = currentStatus.toLowerCase();
        
        if (statusLower === "completed" || statusLower === "hoàn thành") {
          completedSteps = sortedSteps.length;
          currentStage = "Hoàn thành";
          nextStage = "Hoàn thành";
        } else if (statusLower === "cancelled" || statusLower === "đã hủy") {
          completedSteps = 0;
          currentStage = "Đã hủy";
          nextStage = "Không áp dụng";
        } else if (statusLower === "in-progress" || statusLower === "đang tiến hành") {
          // Nếu đang tiến hành nhưng không match step cụ thể, coi như bước đầu
          completedSteps = 1;
          currentStage = sortedSteps[0]?.stepName || "Đang tiến hành";
          nextStage = sortedSteps[1]?.stepName || "Hoàn thành";
        } else {
          // Trường hợp status không match với bất kỳ stepName nào
          // Coi như chưa bắt đầu hoặc bước đầu tiên
          completedSteps = 0;
          currentStage = currentStatus;
          nextStage = sortedSteps[0]?.stepName || "Chưa xác định";
        }
      }
    } else {
      // Không có status, coi như chưa bắt đầu
      completedSteps = 0;
      currentStage = "Chưa bắt đầu";
      nextStage = sortedSteps[0]?.stepName || "Chưa xác định";
    }

    // Tính phần trăm tiến độ
    const progress = sortedSteps.length > 0 ? Math.round((completedSteps / sortedSteps.length) * 100) : 0;

    return {
      progress,
      currentStage,
      nextStage,
      totalSteps: sortedSteps.length,
      completedSteps
    };
  }

  // Hàm tính tiến độ điều trị cũ (deprecated - giữ lại để fallback)
  function calculateTreatmentProgress(status: string, steps: string[]): number {
    if (!status || steps.length === 0) return 0;
    const currentIndex = steps.findIndex(
      (step) => step.toLowerCase() === status.toLowerCase()
    );
    if (currentIndex === -1) return 0;
    if (currentIndex === steps.length - 1) return 100;
    return Math.round(((currentIndex + 1) / steps.length) * 100);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 max-w-4xl mx-auto"
      role="region"
      aria-label="Theo dõi điều trị"
    >
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Theo dõi điều trị</h2>
      </div>

      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 flex justify-center items-center gap-3"
            role="status"
            aria-live="polite"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <span className="text-gray-600 text-lg">Đang tải dữ liệu...</span>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 text-center"
            role="alert"
          >
            <p className="text-red-600 text-lg font-medium">{error}</p>
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              onClick={() => {
                const patientInfo = getPatientInfoFromLocalStorage();
                
                if (patientInfo?.userId && patientInfo?.patientId) {
                  setLoading(true);
                  setError(null);
                  
                  // Chỉ cần thử lại lấy patientDetailId
                  getPatientDetailIdByPatientId(patientInfo.patientId)
                    .then((detailId) => {
                      setUserId(patientInfo.userId);
                      setPatientId(patientInfo.patientId);
                      setPatientDetailId(detailId);
                    })
                    .catch((err) => {
                      console.error("Lỗi lấy patientDetailId:", err);
                      setError("Lỗi lấy thông tin chi tiết bệnh nhân");
                    })
                    .finally(() => setLoading(false));
                } else {
                  setError("Không tìm thấy thông tin bệnh nhân trong hệ thống");
                }
              }}
              aria-label="Thử lại tải dữ liệu"
              disabled={!getPatientInfoFromLocalStorage()?.userId}
            >
              Thử lại
            </Button>
          </motion.div>
        ) : treatmentPlans.length > 0 ? (
          <motion.div
            key="plans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="divide-y divide-gray-200"
          >
            {treatmentPlans.map((plan) => {
              // Debug logging để kiểm tra dữ liệu
              console.log(`=== Processing plan ${plan.treatmentPlanId} ===`);
              console.log("Plan status:", plan.status);
              console.log("Treatment steps for this plan:", treatmentSteps[plan.treatmentPlanId]);
              
              // Sử dụng hàm mới để tính toán tiến độ với plan.status chính xác
              const progressData = calculateTreatmentProgressFromSteps(plan.treatmentPlanId, plan.status);
              console.log("Progress data calculated:", progressData);
              
              // Fallback về logic cũ nếu không có treatment steps
              const steps = parseTreatmentDescription(plan.treatmentDescription);
              const fallbackProgress = calculateTreatmentProgress(plan.status, steps);
              const fallbackCurrentStage = plan.status || "Chưa bắt đầu";
              const fallbackNextStage = steps[
                steps.findIndex(
                  (step) => step.toLowerCase() === plan.status?.toLowerCase()
                ) + 1
              ] || "Hoàn thành";

              // Sử dụng dữ liệu từ treatment steps nếu có, nếu không thì dùng fallback
              const progress = progressData.totalSteps > 0 ? progressData.progress : fallbackProgress;
              const currentStage = progressData.totalSteps > 0 ? progressData.currentStage : fallbackCurrentStage;
              const nextStage = progressData.totalSteps > 0 ? progressData.nextStage : fallbackNextStage;
              
              console.log("Final values:", { progress, currentStage, nextStage });
              
              const nextDate = plan.endDate
                ? new Date(plan.endDate).toLocaleDateString("vi-VN")
                : "Chưa xác định";
              const notes = plan.treatmentProcesses?.[0]?.result || "Không có ghi chú";

              // Tìm booking tương ứng
              const relatedBooking = bookings.find(
                (booking) =>
                  booking.patientId === patientId &&
                  booking.doctorId === plan.doctorId &&
                  booking.serviceId === plan.serviceId &&
                  patientDetailId === plan.patientDetailId
              );

              return (
                <motion.div
                  key={plan.treatmentPlanId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${
                    relatedBooking?.status.toLowerCase() === "cancelled" ? "opacity-50" : ""
                  }`}
                  role="article"
                  aria-labelledby={`treatment-${plan.treatmentPlanId}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Bookmark
                          className="h-5 w-5 text-blue-600"
                          aria-hidden="true"
                        />
                        <h3
                          id={`treatment-${plan.treatmentPlanId}`}
                          className="text-lg font-semibold text-gray-900"
                        >
                          Điều trị {plan.method || "Chưa xác định"}
                        </h3>
                      </div>
                      <p className="text-gray-600 mt-1 text-sm">
                        Bác sĩ: {plan.doctor?.doctorName || "Chưa phân công"}
                      </p>
                      {relatedBooking?.status.toLowerCase() === "cancelled" && (
                        <p className="text-red-500 text-sm font-medium">Lịch hẹn đã bị hủy</p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Ngày bắt đầu: {new Date(plan.startDate).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Tiến độ điều trị
                        {progressData.totalSteps > 0 && (
                          <span className="text-xs text-gray-500 ml-2">
                            ({progressData.completedSteps}/{progressData.totalSteps} bước)
                          </span>
                        )}
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-blue-600 h-3 rounded-full"
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                    {progressData.totalSteps > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Dựa trên {progressData.totalSteps} bước điều trị đã được lên kế hoạch
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">
                        Giai đoạn hiện tại
                      </p>
                      <p className="font-medium text-gray-900">{currentStage}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="text-sm text-gray-500 mb-1">
                        Giai đoạn tiếp theo
                      </p>
                      <p className="font-medium text-gray-900">{nextStage}</p>
                      <p className="text-sm text-blue-600 mt-1">
                        Ngày: {nextDate}
                      </p>
                    </div>
                  </div>

                  {!!notes && (
                    <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-100">
                      <p className="text-sm text-gray-700 font-medium mb-1">
                        Ghi chú từ bác sĩ:
                      </p>
                      <p className="text-gray-600 text-sm">{notes}</p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Link to={`/patient/treatments/${plan.treatmentPlanId}`}>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                        aria-label={`Xem chi tiết điều trị ${plan.method || "Chưa xác định"}`}
                        disabled={relatedBooking?.status.toLowerCase() === "cancelled"}
                      >
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 text-center"
            role="alert"
          >
            <p className="text-gray-500 text-lg">
              Bạn chưa có quá trình điều trị hoặc lịch hẹn nào
            </p>
            <Link to="/services" className="mt-4 inline-block">
              <Button
                className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                aria-label="Tìm hiểu dịch vụ điều trị"
              >
                Tìm hiểu dịch vụ
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}