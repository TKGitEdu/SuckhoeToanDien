import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Save, FileText, User, AlertCircle } from "lucide-react";
import { getExaminationInfo } from "../../api/doctorApi/createTreatmentplanAPI";
import { createTreatmentPlan } from "../../api/doctorApi/dashboardAPI";
import type { ExaminationInfo } from "../../api/doctorApi/createTreatmentplanAPI";
import type { CreateTreatmentPlanRequest } from "../../api/doctorApi/dashboardAPI";

const CreateTreatmentPlan: React.FC = () => {
  const { examinationId: paramExaminationId } = useParams<{ examinationId: string }>();
  const [searchParams] = useSearchParams();
  const queryExaminationId = searchParams.get('examinationId');
  const examinationId = paramExaminationId || queryExaminationId;
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [examinationInfo, setExaminationInfo] = useState<ExaminationInfo | null>(null);
  const [doctorId, setDoctorId] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [treatmentDescription, setTreatmentDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [giaidoan, setGiaidoan] = useState<string>("");
  const [ghiChu, setGhiChu] = useState<string>("");

  useEffect(() => {
    const storedDoctorId = localStorage.getItem('doctorId');
    if (!storedDoctorId) {
      alert("Không tìm thấy thông tin bác sĩ!");
      navigate("/doctor/dashboard");
      return;
    }
    setDoctorId(storedDoctorId);

    if (!examinationId) {
      console.error("Không tìm thấy examinationId trong URL");
      alert("Không tìm thấy thông tin examination!");
      navigate("/doctor/dashboard");
      return;
    }

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

  const handleCreateTreatmentPlan = async () => {
    try {
      setSubmitting(true);

      if (!examinationInfo || !doctorId) {
        alert("Thiếu thông tin bắt buộc!");
        return;
      }

      if (!method || !startDate || !endDate || !treatmentDescription || !status || !giaidoan) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
      }

      if (new Date(endDate) <= new Date(startDate)) {
        alert("Ngày kết thúc phải sau ngày bắt đầu!");
        return;
      }

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

  const handleCancel = () => {
    const confirmCancel = window.confirm("Bạn có chắc muốn hủy? Các thông tin đã nhập sẽ không được lưu.");
    if (confirmCancel) {
      navigate("/doctor/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Đang tải dữ liệu...</p>
        </motion.div>
      </div>
    );
  }

  if (!examinationId || !examinationInfo) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4 text-base font-medium">Không tìm thấy thông tin examination</p>
          <Button 
            onClick={() => navigate("/doctor/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Tạo kế hoạch điều trị</h1>
            <p className="text-base text-gray-600 mt-2">Examination ID: {examinationId}</p>
          </div>
          <Button 
            variant="outline"
            className="border-gray-200 text-gray-700 hover:bg-gray-50 font-medium rounded-lg px-4 py-2"
            onClick={() => navigate("/doctor/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-blue-600" />
            Thông tin examination
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="space-y-2">
              <p><span className="font-medium text-gray-800">Examination ID:</span> {examinationInfo.examinationId}</p>
              <p><span className="font-medium text-gray-800">Patient ID:</span> {examinationInfo.patientId}</p>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium text-gray-800">Service ID:</span> {examinationInfo.serviceId}</p>
              <p><span className="font-medium text-gray-800">Patient Detail ID:</span> {examinationInfo.patientDetailId}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <User className="mr-2 h-5 w-5 text-blue-600" />
            Thông tin kế hoạch điều trị
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phương pháp điều trị <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                placeholder="Nhập phương pháp điều trị..."
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giai đoạn <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={giaidoan}
                onChange={(e) => setGiaidoan(e.target.value)}
                required
              >
                <option value="">Chọn giai đoạn</option>
                <option value="pending">Chờ xử lý</option>
                <option value="in-progress">Đang tiến hành</option>
                <option value="completed">Hoàn thành</option>
                <option value="canceled">Đã hủy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                placeholder="Nhập trạng thái điều trị... stepName"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả điều trị <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full h-32 p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                placeholder="Nhập mô tả chi tiết về kế hoạch điều trị... stepName;stepName;...;stepName"
                value={treatmentDescription}
                onChange={(e) => setTreatmentDescription(e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú thêm
              </label>
              <textarea
                className="w-full h-24 p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                placeholder="Nhập ghi chú thêm (không bắt buộc)..."
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex justify-end space-x-4"
        >
          <Button
            variant="outline"
            className="border-gray-200 text-gray-700 hover:bg-gray-50 font-medium rounded-lg px-4 py-2"
            onClick={handleCancel}
            disabled={submitting}
          >
            Hủy
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-4 py-2"
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
        </motion.div>
      </div>
    </div>
  );
};

export default CreateTreatmentPlan;