// src/pages/doctor/InteractivePatient.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Save, Calendar, User, FileText } from "lucide-react";
import { format } from "date-fns";
import { 
  getBookingById, 
  getPatientById, 
  createExamination,
  getPatientMedicalHistory,
  checkExaminationExists
} from "../../api/doctorApi/interactivePatientAPI";
import type { 
  Booking as BookingType,
  Patient as PatientType,
  ExaminationRequest
} from "../../api/doctorApi/interactivePatientAPI";

// Interface để hiển thị thông tin bệnh nhân
interface PatientDisplay extends PatientType {
  age?: number;
  medicalHistory: string[];
}

// Interface để hiển thị thông tin booking
interface BookingDisplay extends BookingType {
  patientName?: string;
  doctorName?: string;
  serviceName?: string;
}

const InteractivePatient: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  
  // States
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingDisplay | null>(null);
  const [patient, setPatient] = useState<PatientDisplay | null>(null);
  const [examinationDescription, setExaminationDescription] = useState<string>("");
  const [examinationResult, setExaminationResult] = useState<string>("");
  const [specialNote, setSpecialNote] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [examinationExists, setExaminationExists] = useState<boolean>(false);

  useEffect(() => {
    // Hàm lấy dữ liệu booking và patient từ API
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Kiểm tra bookingId từ URL
        if (!bookingId) {
          setError("Không tìm thấy ID cuộc hẹn");
          setLoading(false);
          return;
        }
        
        // Lấy thông tin booking từ API
        const bookingData = await getBookingById(bookingId);
        console.log("Booking data:", bookingData);
        
        // Kiểm tra xem booking này đã có examination chưa
        try {
          const hasExamination = await checkExaminationExists(bookingId);
          setExaminationExists(hasExamination);
          
          if (hasExamination) {
            console.log("Booking đã có examination, cần tạo booking mới để khám tiếp");
            // Nếu đã có examination, hiển thị thông báo và chuyển hướng
            setTimeout(() => {
              alert("Bệnh nhân đã được khám cho lịch hẹn này!\n\nVui lòng tạo lịch hẹn mới để có thể khám tiếp.");
              navigate(`/doctor/create-appointment?patientId=${bookingData.patientId}`); // Chuyển đến trang đặt lịch của bác sĩ
            }, 100);
            return;
          }
        } catch (error) {
          console.error("Error checking examination exists:", error);
          // Nếu có lỗi khi kiểm tra, vẫn tiếp tục để bác sĩ có thể thử khám
        }
        
        // Chuẩn bị dữ liệu booking để hiển thị
        const bookingDisplay: BookingDisplay = {
          ...bookingData,
          serviceName: "Khám chữa bệnh", // Mặc định, có thể thay thế bằng dữ liệu thực khi API trả về
        };
        
        // Lấy thông tin bệnh nhân từ API
        const patientData = await getPatientById(bookingData.patientId);
        console.log("Patient data:", patientData);
        
        // Lấy tiền sử bệnh của bệnh nhân
        let medicalHistoryData = [];
        try {
          const medicalHistory = await getPatientMedicalHistory(bookingData.patientId);
          console.log("Medical history:", medicalHistory);
          
          // Trích xuất tiền sử bệnh từ response
          if (medicalHistory.medicalRecords && medicalHistory.medicalRecords.length > 0) {
            medicalHistoryData = medicalHistory.medicalRecords.map(record => 
              record.medicalHistory || "Chưa có thông tin tiền sử bệnh"
            );
          } else {
            medicalHistoryData = ["Chưa có thông tin tiền sử bệnh"];
          }
        } catch (error) {
          console.error("Error fetching medical history:", error);
          medicalHistoryData = ["Không thể tải thông tin tiền sử bệnh"];
        }
        
        // Tính tuổi từ ngày sinh
        let age;
        if (patientData.dateOfBirth) {
          const birthDate = new Date(patientData.dateOfBirth);
          const today = new Date();
          age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
        }
        
        // Chuẩn bị dữ liệu bệnh nhân để hiển thị
        const patientDisplay: PatientDisplay = {
          ...patientData,
          age,
          medicalHistory: medicalHistoryData,
        };
        
        // Cập nhật state
        setBooking(bookingDisplay);
        setPatient(patientDisplay);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Không thể tải thông tin. Vui lòng thử lại.");
        
        // Fallback dữ liệu giả lập trong trường hợp lỗi
        const mockBooking: BookingDisplay = {
          bookingId: bookingId || "BKG_001",
          patientId: "PAT_001",
          doctorId: "DOC_001",
          serviceId: "SRV_001",
          slotId: "SLOT_001",
          dateBooking: new Date().toISOString(),
          description: "Đau răng số 6 hàm dưới bên phải",
          note: "Lịch hẹn khẩn",
          status: "confirmed",
          createAt: new Date().toISOString(),
          patientName: "Nguyễn Văn A",
          doctorName: "Bác sĩ Trần Văn B",
          serviceName: "Khám răng tổng quát"
        };
        
        const mockPatient: PatientDisplay = {
          patientId: "PAT_001",
          userId: "USR_001",
          name: "Nguyễn Văn A",
          gender: "Nam",
          phone: "0987654321",
          email: "nguyenvana@example.com",
          address: "123 Đường ABC, Quận XYZ, TP. HCM",
          bloodType: "A+",
          dateOfBirth: "1988-01-01",
          emergencyPhoneNumber: "0987654322",
          age: 35,
          medicalHistory: ["Chưa có thông tin tiền sử bệnh"]
        };
        
        setBooking(mockBooking);
        setPatient(mockPatient);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [bookingId]);
  
  // Hàm xử lý khi bác sĩ hoàn thành khám bệnh
  const handleCompleteExamination = async () => {
    try {
      setSubmitting(true);
      
      // Kiểm tra dữ liệu bắt buộc
      if (!booking || !bookingId || !examinationDescription) {
        alert("Vui lòng nhập mô tả khám bệnh!");
        setSubmitting(false);
        return;
      }
      
      // Kiểm tra lại xem booking này đã có examination chưa (double check)
      try {
        const hasExamination = await checkExaminationExists(bookingId);
        if (hasExamination) {
          alert("Bệnh nhân đã được khám cho lịch hẹn này!\n\nVui lòng tạo lịch hẹn mới để có thể khám tiếp.");
          navigate(`/doctor/create-appointment?patientId=${booking.patientId}`);
          return;
        }
      } catch (error) {
        console.error("Error double-checking examination exists:", error);
      }
      
      // Tạo dữ liệu examination để gửi lên API
      const examinationData: ExaminationRequest = {
        bookingId: bookingId,
        examinationDate: new Date().toISOString(),
        examinationDescription: examinationDescription.trim(),
        result: examinationResult.trim() || "", // Đảm bảo không null/undefined
        status: "completed", // Đặt trạng thái là completed luôn
        note: specialNote.trim() || "" // Đảm bảo không null/undefined
      };
      
      console.log("Preparing to send examination data:", examinationData);
      
      // Gọi API tạo examination mới với trạng thái completed
      const response = await createExamination(examinationData);
      console.log("Created examination:", response);
      
      // Hiển thị thông báo thành công
      alert("Đã hoàn thành khám bệnh thành công!");
      
      // Quay lại trang dashboard
      navigate("/doctor/dashboard");
    } catch (error: any) {
      console.error("Error completing examination:", error);
      
      // Kiểm tra nếu lỗi do đã tồn tại examination
      if (error.response?.status === 400 || error.response?.data?.message?.includes("examination")) {
        alert("Bệnh nhân đã được khám cho lịch hẹn này!\n\nVui lòng tạo lịch hẹn mới để có thể khám tiếp.");
        navigate(`/doctor/create-appointment?patientId=${booking?.patientId}`);
      } else {
        alert("Không thể hoàn thành khám bệnh. Vui lòng thử lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  // Hàm xử lý khi hủy
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

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => navigate("/doctor/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Phiên khám bệnh</h1>
          <p className="text-gray-600">ID cuộc hẹn: {bookingId}</p>
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

      {/* Thông tin cuộc hẹn */}
      {booking && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-blue-600" />
            Thông tin lịch hẹn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Dịch vụ:</span> {booking.serviceName}</p>
              <p><span className="font-medium">Ngày hẹn:</span> {format(new Date(booking.dateBooking), 'dd/MM/yyyy')}</p>
              <p><span className="font-medium">Giờ hẹn:</span> {format(new Date(booking.dateBooking), 'HH:mm')}</p>
            </div>
            <div>
              <p>
                <span className="font-medium">Trạng thái:</span> 
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium ml-2">
                  {booking.status === 'confirmed' ? 'Đã xác nhận' : booking.status}
                </span>
              </p>
              <p><span className="font-medium">Mô tả:</span> {booking.description}</p>
              {booking.note && <p><span className="font-medium">Ghi chú:</span> {booking.note}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Thông tin bệnh nhân */}
      {patient && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <User className="mr-2 h-5 w-5 text-blue-600" />
            Thông tin bệnh nhân
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Họ tên:</span> {patient.name}</p>
              <p><span className="font-medium">ID:</span> {patient.patientId}</p>
              <p><span className="font-medium">Tuổi:</span> {patient.age}</p>
              <p><span className="font-medium">Giới tính:</span> {patient.gender}</p>
            </div>
            <div>
              <p><span className="font-medium">SĐT:</span> {patient.phone}</p>
              <p><span className="font-medium">Email:</span> {patient.email}</p>
              <p><span className="font-medium">Địa chỉ:</span> {patient.address}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-medium">Tiền sử bệnh:</p>
            <ul className="list-disc ml-8 mt-2">
              {patient.medicalHistory.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Form nhập thông tin khám */}
      {examinationExists ? (
        // Hiển thị thông báo khi đã có examination
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-yellow-800">Bệnh nhân đã được khám</h3>
              <p className="text-yellow-700">Lịch hẹn này đã có kết quả khám bệnh.</p>
            </div>
          </div>
          <div className="bg-yellow-100 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 font-medium mb-2">Lưu ý:</p>
            <ul className="text-yellow-700 text-sm list-disc ml-5 space-y-1">
              <li>Mỗi lịch hẹn chỉ được khám bệnh một lần</li>
              <li>Để khám tiếp cho bệnh nhân, vui lòng tạo lịch hẹn mới</li>
              <li>Bạn có thể xem lại kết quả khám cũ trong hồ sơ bệnh nhân</li>
            </ul>
          </div>
          <div className="flex space-x-4">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => navigate(`/doctor/create-appointment?patientId=${patient?.patientId}`)}
            >
              Tạo lịch hẹn mới
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/doctor/dashboard")}
            >
              Quay lại Dashboard
            </Button>
          </div>
        </div>
      ) : (
        // Form nhập thông tin khám bình thường
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-blue-600" />
            Thông tin khám bệnh
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              bệnh nhân bị gì "ExaminationDescription"<span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full h-40 p-3 border border-gray-300 rounded-md"
              placeholder="Nhập mô tả bệnh nhân bị gì..."
              value={examinationDescription}
              onChange={(e) => setExaminationDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kết quả chẩn đoán, kết quả kiểm tra "Result"
            </label>
            <textarea
              className="w-full h-40 p-3 border border-gray-300 rounded-md"
              placeholder="Nhập kết quả chẩn đoán..."
              value={examinationResult}
              onChange={(e) => setExaminationResult(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lưu ý đặc biệt cho bệnh nhân "Ex.note"
            </label>
            <textarea
              className="w-full h-28 p-3 border border-gray-300 rounded-md"
              placeholder="Nhập lưu ý đặc biệt cho bệnh nhân (chế độ ăn uống, vận động, dùng thuốc...)..."
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
            />
          </div>
        </div>
      )}

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
          onClick={handleCompleteExamination}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Đang xử lý...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Hoàn thành khám
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default InteractivePatient;
