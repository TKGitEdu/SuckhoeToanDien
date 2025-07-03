import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "../../components/ui/button";
import type { Examination } from "../../api/patientApi/dashboardAPI";

// Trang hiển thị chi tiết các buổi khám của bệnh nhân
const ExaminationsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  
  // Lấy dữ liệu examination từ state của location (được truyền từ Dashboard)
  const examination = location.state?.examination as Examination | undefined;

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (!examination) {
    return <div className="flex flex-col justify-center items-center h-screen">
      <p className="text-gray-500 mb-4">Không có thông tin buổi khám hoặc dữ liệu không hợp lệ</p>
      <button 
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={() => navigate(-1)}
      >
        Quay lại
      </button>
    </div>;
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Chi tiết buổi khám</h1>
            <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
              {examination.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Ngày khám: {formatDate(examination.examinationDate)}
          </p>
        </div>
        
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Thông tin chung</h2>
          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-sm text-gray-500">Mã buổi khám:</div>
            <div className="text-sm text-gray-900">{examination.examinationId}</div>
            
            <div className="text-sm text-gray-500">Mã đặt lịch:</div>
            <div className="text-sm text-gray-900">{examination.bookingId}</div>
            
            <div className="text-sm text-gray-500">Bác sĩ phụ trách:</div>
            <div className="text-sm text-gray-900">{examination.doctorName}</div>
            
            <div className="text-sm text-gray-500">Dịch vụ:</div>
            <div className="text-sm text-gray-900">{examination.serviceName}</div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Mô tả buổi khám</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {examination.examinationDescription}
          </p>
        </div>
        
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Kết quả</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {examination.result}
          </p>
        </div>
        
        <div className="px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Ghi chú của bác sĩ</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {examination.note || "Không có ghi chú"}
          </p>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Button 
            onClick={() => navigate(`/patient/treatments?bookingId=${examination.bookingId}`)}
          >
            Xem kế hoạch điều trị
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExaminationsPage;
