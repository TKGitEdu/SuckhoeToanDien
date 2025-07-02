// src/pages/doctor/InteractivePatient.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { 
  getBookingById, 
  getPatientDetailsById,
  createExamination,
  createTreatmentPlan,
  updateBookingStatus
} from "../../api/doctorApi/interactivePatientAPI";
import type { PatientDetails } from "../../api/doctorApi/interactivePatientAPI";

const InteractivePatient: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientDetails | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [diagnosis, setDiagnosis] = useState<string>("");
  const [treatmentPlan, setTreatmentPlan] = useState<string>("");
  const [doctorId, setDoctorId] = useState<string>("");
  const [patientId, setPatientId] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        setLoading(true);
        
        if (!bookingId) {
          setError("Không tìm thấy ID cuộc hẹn.");
          return;
        }
        
        // Get booking details
        const bookingDetails = await getBookingById(bookingId);
        
        // Save IDs for later use
        setDoctorId(bookingDetails.doctorId);
        setPatientId(bookingDetails.patientId);
        
        // Get patient details
        const patientDetails = await getPatientDetailsById(bookingDetails.patientId);
        setPatientInfo(patientDetails);
        
      } catch (err) {
        console.error("Error fetching appointment details:", err);
        setError("Không thể tải thông tin cuộc hẹn. Vui lòng thử lại.");
        
        // Fallback to mock data for development
        const mockPatientInfo: PatientDetails = {
          patientId: "P" + Math.floor(Math.random() * 1000),
          name: "Nguyễn Văn A",
          age: 35,
          gender: "Nam",
          medicalHistory: ["Tiểu đường", "Cao huyết áp"],
          appointmentReason: "Đau răng số 6 hàm dưới"
        };
        
        setPatientInfo(mockPatientInfo);
        setPatientId(mockPatientInfo.patientId);
        setDoctorId("DOC001"); // Mock doctor ID
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [bookingId]);

  const handleSaveExamination = async () => {
    try {
      setSubmitting(true);
      
      if (!bookingId || !patientId || !doctorId) {
        throw new Error("Thiếu thông tin cần thiết để lưu phiên khám");
      }
      
      // 1. Create examination record
      const examinationData = {
        bookingId,
        patientId,
        doctorId,
        description: notes,
        result: diagnosis,
        status: "completed"
      };
      
      await createExamination(examinationData);
      
      // 2. Create treatment plan if treatment plan is provided
      if (treatmentPlan.trim()) {
        const treatmentPlanData = {
          patientId,
          doctorId,
          method: "Điều trị nha khoa", // Default method, can be customized
          status: "active",
          description: treatmentPlan
        };
        
        await createTreatmentPlan(treatmentPlanData);
      }
      
      // 3. Update booking status to completed
      await updateBookingStatus(bookingId, "completed");
      
      // Show success message
      alert("Đã lưu thông tin khám bệnh thành công!");
      
      // Navigate back to dashboard
      navigate("/doctor/dashboard");
    } catch (err) {
      console.error("Error saving examination:", err);
      alert("Không thể lưu thông tin khám bệnh. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to dashboard without saving
    navigate("/doctor/dashboard");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Đang tải thông tin cuộc hẹn...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => navigate("/doctor/dashboard")}
        >
          Quay lại Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Phiên khám bệnh</h1>
        <p className="text-gray-600">ID cuộc hẹn: {bookingId}</p>
      </div>

      {patientInfo && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Thông tin bệnh nhân</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Họ tên:</span> {patientInfo.name}</p>
              <p><span className="font-medium">ID:</span> {patientInfo.patientId}</p>
            </div>
            <div>
              <p><span className="font-medium">Tuổi:</span> {patientInfo.age}</p>
              <p><span className="font-medium">Giới tính:</span> {patientInfo.gender}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-medium">Lý do khám:</p>
            <p className="ml-4">{patientInfo.appointmentReason}</p>
          </div>
          <div className="mt-4">
            <p className="font-medium">Tiền sử bệnh:</p>
            <ul className="list-disc ml-8">
              {patientInfo.medicalHistory.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium mb-4">Ghi chú khám bệnh</h2>
          <textarea
            className="w-full h-40 p-3 border border-gray-300 rounded-md"
            placeholder="Nhập ghi chú khám bệnh..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium mb-4">Chẩn đoán</h2>
          <textarea
            className="w-full h-40 p-3 border border-gray-300 rounded-md"
            placeholder="Nhập chẩn đoán..."
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
        <h2 className="text-lg font-medium mb-4">Kế hoạch điều trị</h2>
        <textarea
          className="w-full h-40 p-3 border border-gray-300 rounded-md"
          placeholder="Nhập kế hoạch điều trị..."
          value={treatmentPlan}
          onChange={(e) => setTreatmentPlan(e.target.value)}
        />
      </div>

      <div className="flex justify-end mt-6 space-x-4">
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
          onClick={handleSaveExamination}
          disabled={submitting}
        >
          {submitting ? "Đang lưu..." : "Lưu thông tin khám"}
        </Button>
      </div>
    </div>
  );
};

export default InteractivePatient;
