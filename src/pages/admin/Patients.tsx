import { useEffect, useState } from "react";
import { patientAPI, type Patient } from "../../api/adminApi/patientAPI";

export default function AdminPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await patientAPI.getAllDoctor();
        setPatients(response);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bệnh nhân:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleDelete = (patientId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bệnh nhân này?")) {
      setPatients((prev) => prev.filter((p) => p.patientId !== patientId));
    }
  };

  const handleEdit = (patientId: string) => {
    alert(`Chuyển đến form sửa bệnh nhân ${patientId}`);
  };

  if (loading) return <p className="p-4">Đang tải danh sách bệnh nhân...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Quản lý bệnh nhân</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="text-left px-4 py-3">Họ tên</th>
              <th className="text-left px-4 py-3">Giới tính</th>
              <th className="text-left px-4 py-3">Ngày sinh</th>
              <th className="text-left px-4 py-3">SĐT</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Địa chỉ</th>
              <th className="text-left px-4 py-3">Tình trạng</th>
           
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {patients.map((patient, index) => (
              <tr key={patient.patientId} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 font-medium">{patient.user.fullName}</td>
                <td className="px-4 py-3">{patient.gender}</td>
                <td className="px-4 py-3">{new Date(patient.dateOfBirth).toLocaleDateString("vi-VN")}</td>
                <td className="px-4 py-3">{patient.phone}</td>
                <td className="px-4 py-3">{patient.email}</td>
                <td className="px-4 py-3">{patient.address}</td>
                <td className="px-4 py-3">
                  {patient.patientDetails.length > 0
                    ? patient.patientDetails[0].treatmentStatus
                    : "Chưa cập nhật"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
