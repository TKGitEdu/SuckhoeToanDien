import { useState, useEffect } from "react";
import { doctorAPI } from "../../api/doctorsAPI";

type Booking = {
  bookingId: string;
  dateBooking: string;
  description: string;
  note: string;
};

type Doctor = {
  doctorId: string;
  doctorName: string;
  specialization: string;
  phone: string;
  email: string;
  user: {
    fullName: string;
    email: string;
    phone: string;
    gender: string;
  };
  bookings: Booking[];
};

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorAPI.getAllDoctor();
        setDoctors(response);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bác sĩ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <p className="p-4">Đang tải danh sách bác sĩ...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Danh sách bác sĩ</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="text-left px-4 py-3">Họ tên</th>
              <th className="text-left px-4 py-3">Chuyên môn</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">SĐT</th>
              <th className="text-left px-4 py-3">Giới tính</th>
              <th className="text-left px-4 py-3">Lịch hẹn</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {doctors.map((doctor, index) => (
              <tr
                key={doctor.doctorId}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-3 font-medium">{doctor.user.fullName}</td>
                <td className="px-4 py-3">{doctor.specialization}</td>
                <td className="px-4 py-3">{doctor.user.email}</td>
                <td className="px-4 py-3">{doctor.user.phone}</td>
                <td className="px-4 py-3">{doctor.user.gender}</td>
                <td className="px-4 py-3">
                  {doctor.bookings.length === 0 ? (
                    <span className="text-sm text-gray-400 italic">Không có</span>
                  ) : (
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {doctor.bookings.map((booking) => (
                        <li key={booking.bookingId}>
                          <p><strong>Ngày:</strong> {new Date(booking.dateBooking).toLocaleString("vi-VN")}</p>
                          <p><strong>Mô tả:</strong> {booking.description}</p>
                          <p><strong>Ghi chú:</strong> {booking.note}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
