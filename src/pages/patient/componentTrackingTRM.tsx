//src/pages/patient/componentTrackingTRM.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { Button } from "../../components/ui/button";
import treatmentPlanAPI from "../../api/treatmentPlanAPI";
import type { TreatmentPlan } from "../../api/treatmentPlanAPI";

interface ComponentTrackingTRMProps {
  patientId?: string; // Optional patientId prop for flexibility
}

const ComponentTrackingTRM = ({ patientId }: ComponentTrackingTRMProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);

  useEffect(() => {    // Lấy thông tin người dùng từ localStorage nếu không có patientId được truyền vào
    const fetchPatientIdFromLocalStorage = async (): Promise<string> => {
      const userInfo = localStorage.getItem("userInfo");
      let id = "";
      
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          console.log("User info from localStorage:", user);
          
          // Kiểm tra nếu có userId
          if (user.userId) {
            try {
              // Sử dụng API mới để lấy patientId từ userId
              id = await treatmentPlanAPI.getPatientIdFromUserId(user.userId);
              console.log("Got patientId from API:", id);
              return id;
            } catch (error) {
              console.error("Error getting patientId from userId:", error);
              // Tiếp tục với các phương pháp khác nếu API gọi thất bại
            }
          }
          
          // Các phương pháp dự phòng từ trước nếu API không hoạt động
          if (user.patientId) {
            id = user.patientId;
            console.log("Found patientId directly:", id);
          } else if (user.patient?.id) {
            id = user.patient.id;
            console.log("Found patientId in user.patient.id:", id);
          } else if (user.patient?.patientId) {
            id = user.patient.patientId;
            console.log("Found patientId in user.patient.patientId:", id);
          } else if (user.id && user.role === "PATIENT") {
            id = user.id;
            console.log("Using user.id as patientId (role=PATIENT):", id);
          }
          
          if (!id) {
            console.warn("Failed to extract a valid patientId");
          }
        } catch (e) {
          console.error("Error parsing userInfo from localStorage:", e);
          setError("Lỗi khi đọc thông tin người dùng. Vui lòng đăng nhập lại.");
        }
      } else {
        console.warn("No userInfo found in localStorage");
        setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem thông tin điều trị.");
      }
      
      return id;
    };    // Sử dụng patientId từ props nếu có, nếu không thì lấy từ localStorage
    const fetchTreatmentPlans = async () => {
      try {
        // Lấy patientId với xử lý lỗi tốt hơn
        let id = patientId || await fetchPatientIdFromLocalStorage();
        
        if (!id) {
          setError("Không thể xác định thông tin bệnh nhân. Vui lòng đăng nhập lại.");
          setLoading(false);
          return;
        }
        
        console.log("Fetching treatment plans for patientId:", id);
        
        // Lấy tất cả kế hoạch điều trị cho bệnh nhân trực tiếp từ API
        const plans = await treatmentPlanAPI.getAllTreatmentPlansByPatient(id);
        console.log("Received treatment plans:", plans);
        
        if (!plans || plans.length === 0) {
          console.log("No treatment plans found for this patient");
          setTreatmentPlans([]);
          setLoading(false);
          return;
        }
        
        // Lưu kế hoạch điều trị vào state
        setTreatmentPlans(plans);
      } catch (error) {
        console.error("Lỗi khi lấy kế hoạch điều trị:", error);
        setError("Không thể lấy dữ liệu kế hoạch điều trị. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTreatmentPlans();
  }, [patientId]);

  // Hàm hỗ trợ tính toán tiến độ dựa trên các quá trình điều trị
  const calculateProgress = (plan: TreatmentPlan): number => {
    if (!plan.treatmentProcesses || plan.treatmentProcesses.length === 0) {
      return 0;
    }
    
    // Đếm số quá trình đã hoàn thành
    const completedProcesses = plan.treatmentProcesses.filter(
      process => process.status === "Completed" || process.status === "Done"
    ).length;
    
    // Tính phần trăm tiến độ
    return Math.round((completedProcesses / plan.treatmentProcesses.length) * 100);
  };
  
  // Hàm lấy giai đoạn hiện tại và giai đoạn tiếp theo
  const getStages = (plan: TreatmentPlan): { currentStage: string, nextStage: string } => {
    // Phân tách các giai đoạn từ mô tả điều trị
    const stages = plan.treatmentDescription 
      ? plan.treatmentDescription.split(';')
          .map(stage => stage.trim())
          .filter(Boolean)
      : ["Chưa có thông tin giai đoạn"];
    
    // Xác định giai đoạn hiện tại dựa trên tiến độ
    const progress = calculateProgress(plan);
    const stageIndex = Math.floor((progress / 100) * stages.length);
    const currentStageIndex = Math.min(stageIndex, stages.length - 1);
    
    return {
      currentStage: stages[currentStageIndex] || "Không có thông tin",
      nextStage: currentStageIndex < stages.length - 1 
        ? stages[currentStageIndex + 1] 
        : "Hoàn thành điều trị"
    };
  };
  
  // Hàm lấy ngày cho giai đoạn tiếp theo
  const getNextDate = (plan: TreatmentPlan): string => {
    // Tìm quá trình điều trị sắp tới
    const upcomingProcess = plan.treatmentProcesses && plan.treatmentProcesses.length > 0
      ? plan.treatmentProcesses.find(p => 
          p.status === "Pending" || p.status === "Scheduled" || p.status === "Đã lên lịch")
      : null;
    
    if (upcomingProcess && upcomingProcess.scheduledDate) {
      return new Date(upcomingProcess.scheduledDate).toLocaleDateString('vi-VN');
    }
    
    // Nếu không có quá trình sắp tới, dự đoán ngày tiếp theo (giả định mỗi giai đoạn kéo dài 7 ngày)
    const startDate = new Date(plan.startDate);
    const nextDate = new Date(startDate);
    const progress = calculateProgress(plan);
    const daysToAdd = 7 * (Math.floor((progress / 100) * 5) + 1); // Ước tính dựa trên tiến độ
    nextDate.setDate(startDate.getDate() + daysToAdd);
    
    return nextDate.toLocaleDateString('vi-VN');
  };
  
  // Hàm lấy ghi chú mới nhất từ các quá trình điều trị
  const getLatestNote = (plan: TreatmentPlan): string => {
    if (!plan.treatmentProcesses || plan.treatmentProcesses.length === 0) {
      return "Không có ghi chú";
    }
    
    // Sắp xếp quá trình điều trị theo thời gian và lấy cái mới nhất
    const latestProcess = [...plan.treatmentProcesses]
      .sort((a, b) => {
        const dateA = new Date(a.actualDate || a.scheduledDate || "");
        const dateB = new Date(b.actualDate || b.scheduledDate || "");
        return dateB.getTime() - dateA.getTime();
      })[0];
    
    return latestProcess && latestProcess.result
      ? latestProcess.result
      : "Không có ghi chú";
  };

  // Render component with direct use of treatment plans
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Theo dõi điều trị</h2>
        </div>
      </div>
      
      {loading ? (
        <div className="p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Đang tải dữ liệu điều trị...</span>
        </div>
      ) : error ? (
        <div className="p-6 text-center">
          <p className="text-red-500">{error}</p>
          <Button className="bg-blue-600 hover:bg-blue-700 mt-4" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      ) : treatmentPlans.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {treatmentPlans.map((plan) => {
            const progress = calculateProgress(plan);
            const { currentStage, nextStage } = getStages(plan);
            const nextDate = getNextDate(plan);
            const notes = getLatestNote(plan);
            
            return (
              <div key={plan.treatmentPlanId} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <div className="flex items-center">
                      <Bookmark className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">Điều trị {plan.method || "Chưa xác định"}</h3>
                    </div>
                    <p className="text-gray-600 mt-1">Bác sĩ: {plan.doctor?.doctorName || "Chưa phân công"}</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <p className="text-sm text-gray-500">Ngày bắt đầu: {new Date(plan.startDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Tiến độ điều trị</span>
                    <span className="text-sm font-medium text-gray-700">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Giai đoạn hiện tại</p>
                    <p className="font-medium text-gray-900">{currentStage}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Giai đoạn tiếp theo</p>
                    <p className="font-medium text-gray-900">{nextStage}</p>
                    <p className="text-sm text-blue-600 mt-1">Ngày: {nextDate}</p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-700 font-medium mb-1">Ghi chú từ bác sĩ:</p>
                  <p className="text-gray-600">{notes}</p>
                </div>
                
                <div className="flex justify-end">
                  <Link to={`/patient/treatments/${plan.treatmentPlanId}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Xem chi tiết điều trị
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 text-center">
          <p className="text-gray-500">Bạn chưa có quá trình điều trị nào</p>
          <Link to="/services" className="mt-2 inline-block">
            <Button className="bg-blue-600 hover:bg-blue-700 mt-2">
              Tìm hiểu dịch vụ
            </Button>
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default ComponentTrackingTRM;
