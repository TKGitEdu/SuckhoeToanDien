import React, { useEffect, useState } from "react";
import { BookingAPI, type BookingResponse } from "../../api/adminApi/bookingsAPI";

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await BookingAPI.getAllBookings();
        setBookings(response);
      } catch (err) {
        setError("Không thể tải dữ liệu lịch hẹn.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <p className="p-4">Đang tải dữ liệu lịch hẹn...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý lịch hẹn</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">NO</th>
              <th className="px-4 py-3 text-left">Bệnh nhân</th>
              <th className="px-4 py-3 text-left">Dịch vụ</th>
              <th className="px-4 py-3 text-left">Bác sĩ</th>
              <th className="px-4 py-3 text-left">Ngày hẹn</th>
              <th className="px-4 py-3 text-left">Khung giờ</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-left">Ghi chú</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {bookings.map((booking, idx) => (
              <tr key={booking.bookingId || idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 font-medium">{idx + 1}</td>
                <td className="px-4 py-3">{booking.patient?.name}</td>
                <td className="px-4 py-3">{booking.service?.name}</td>
                <td className="px-4 py-3">{booking.doctor?.doctorName}</td>
                <td className="px-4 py-3">
                  {booking.dateBooking ? new Date(booking.dateBooking).toLocaleString("vi-VN") : ""}
                </td>
                <td className="px-4 py-3">{booking.slot?.slotName}</td>
                <td className="px-4 py-3">{booking.status}</td>
                <td className="px-4 py-3">{booking.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;