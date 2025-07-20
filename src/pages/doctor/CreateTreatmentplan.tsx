import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Save, FileText, User } from "lucide-react";
import { getExaminationInfo } from "../../api/doctorApi/createTreatmentplanAPI";
import { createTreatmentPlan } from "../../api/doctorApi/dashboardAPI";
import type { ExaminationInfo } from "../../api/doctorApi/createTreatmentplanAPI";
import type { CreateTreatmentPlanRequest } from "../../api/doctorApi/dashboardAPI";

const CreateTreatmentPlan: React.FC = () => {
  // Cách 1: Lấy từ URL params (nếu URL là /doctor/create-treatment-plan/:examinationId)
  const { examinationId: paramExaminationId } = useParams<{ examinationId: string }>();
  
  // Cách 2: Lấy từ query string (nếu URL là /doctor/create-treatment-plan?examinationId=EXM_123)
  const [searchParams] = useSearchParams();
  const queryExaminationId = searchParams.get('examinationId');
  
  // Chọn cách nào có dữ liệu
  const examinationId = paramExaminationId || queryExaminationId;
  
  const navigate = useNavigate();
  
  // States
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [examinationInfo, setExaminationInfo] = useState<ExaminationInfo | null>(null);
  const [doctorId, setDoctorId] = useState<string>("");
  
  // Form states
  const [method, setMethod] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [treatmentDescription, setTreatmentDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [giaidoan, setGiaidoan] = useState<string>("");
  const [ghiChu, setGhiChu] = useState<string>("");
  
  useEffect(() => {
    // Lấy doctorId từ localStorage
    const storedDoctorId = localStorage.getItem('doctorId');
    if (!storedDoctorId) {
      alert("Không tìm thấy thông tin bác sĩ!");
      navigate("/doctor/dashboard");
      return;
    }
    setDoctorId(storedDoctorId);
    
    // Kiểm tra xem có examinationId không
    if (!examinationId) {
      console.error("Không tìm thấy examinationId trong URL");
      alert("Không tìm thấy thông tin examination!");
      navigate("/doctor/dashboard");
      return;
    }
    
    // Lấy thông tin examination
    const fetchExaminationInfo = async () => {
      try {
        setLoading(true);
        const info = await getExaminationInfo(examinationId);
        setExaminationInfo(info);
        console.log("Examination info:", info);
      } catch (error) {
        console.error("Error fetching examination info:", error);
        alert("Không thể tải thông tin examination!");
        navigate("/doctor/dashboard");
      } finally {
        setLoading(false);
      }
    };
    
    fetchExaminationInfo();
  }, [examinationId, navigate]);
  
  // Xử lý tạo kế hoạch điều trị
  const handleCreateTreatmentPlan = async () => {
    try {
      setSubmitting(true);
      
      // Kiểm tra dữ liệu bắt buộc
      if (!examinationInfo || !doctorId) {
        alert("Thiếu thông tin bắt buộc!");
        return;
      }
      
      if (!method || !startDate || !endDate || !treatmentDescription || !status || !giaidoan) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
      }
      
      // Kiểm tra ngày kết thúc phải sau ngày bắt đầu
      if (new Date(endDate) <= new Date(startDate)) {
        alert("Ngày kết thúc phải sau ngày bắt đầu!");
        return;
      }
      
      // Tạo dữ liệu request
      const treatmentPlanData: CreateTreatmentPlanRequest = {
        doctorId: doctorId,
        patientId: examinationInfo.patientId,
        serviceId: examinationInfo.serviceId,
        method: method.trim(),
        startDate: startDate,
        endDate: endDate,
        status: status.trim(),
        treatmentDescription: treatmentDescription.trim(),
        giaidoan: giaidoan.trim(),
        ghiChu: ghiChu.trim() || ""
      };
      
      console.log("Creating treatment plan with data:", treatmentPlanData);
      
      // Gọi API tạo treatment plan
      const success = await createTreatmentPlan(treatmentPlanData);
      
      if (success) {
        alert("Tạo kế hoạch điều trị thành công!");
        navigate("/doctor/dashboard");
      } else {
        alert("Có lỗi xảy ra khi tạo kế hoạch điều trị!");
      }
    } catch (error) {
      console.error("Error creating treatment plan:", error);
      alert("Không thể tạo kế hoạch điều trị. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };
  
  // Xử lý hủy
  const handleCancel = () => {
    const confirmCancel = window.confirm("Bạn có chắc muốn hủy? Các thông tin đã nhập sẽ không được lưu.");
    if (confirmCancel) {
      navigate("/doctor/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!examinationId || !examinationInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Không tìm thấy thông tin examination</p>
          <Button 
            onClick={() => navigate("/doctor/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tạo kế hoạch điều trị</h1>
          <p className="text-gray-600">Examination ID: {examinationId}</p>
        </div>
        <Button 
          variant="outline"
          className="text-gray-600"
          onClick={() => navigate("/doctor/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>

      {/* Thông tin examination */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <FileText className="mr-2 h-5 w-5 text-blue-600" />
          Thông tin examination
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><span className="font-medium">Examination ID:</span> {examinationInfo.examinationId}</p>
            <p><span className="font-medium">Patient ID:</span> {examinationInfo.patientId}</p>
          </div>
          <div>
            <p><span className="font-medium">Service ID:</span> {examinationInfo.serviceId}</p>
            <p><span className="font-medium">Patient Detail ID:</span> {examinationInfo.patientDetailId}</p>
          </div>
        </div>
      </div>

      {/* Form tạo kế hoạch điều trị */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <User className="mr-2 h-5 w-5 text-blue-600" />
          Thông tin kế hoạch điều trị
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phương pháp điều trị */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phương pháp điều trị <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Nhập phương pháp điều trị..."
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              required
            />
          </div>

          {/* Giai đoạn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giai đoạn <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-md"
              value={giaidoan}
              onChange={(e) => setGiaidoan(e.target.value)}
              required
            >
              <option value="">Chọn giai đoạn</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Nhập trạng thái điều trị... stepName"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            />
          </div>

          {/* Ngày bắt đầu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày bắt đầu <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          {/* Ngày kết thúc */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày kết thúc <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Mô tả điều trị */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả điều trị <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md"
            placeholder="Nhập mô tả chi tiết về kế hoạch điều trị... stepName;stepName;...;stepName"
            value={treatmentDescription}
            onChange={(e) => setTreatmentDescription(e.target.value)}
            required
          />
        </div>

        {/* Ghi chú */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú thêm
          </label>
          <textarea
            className="w-full h-24 p-3 border border-gray-300 rounded-md"
            placeholder="Nhập ghi chú thêm (không bắt buộc)..."
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          className="text-gray-600"
          onClick={handleCancel}
          disabled={submitting}
        >
          Hủy
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={handleCreateTreatmentPlan}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Đang tạo...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Tạo kế hoạch điều trị
            </>
          )}
        </Button>
      </div>
    </div>
  );
};


export default CreateTreatmentPlan;

