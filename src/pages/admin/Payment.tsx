import React, { useEffect, useState } from "react";
import { paymentAPI, type Payment } from "../../api/adminApi/paymentAPI";
import { BookingAPI, type BookingResponse } from "../../api/adminApi/bookingsAPI";

const AdminPayment: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingInfo, setBookingInfo] = useState<BookingResponse | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const data = await paymentAPI.getAllPayment();
        setPayments(data);
      } catch (err) {
        setError("Lỗi khi lấy danh sách thanh toán");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleViewBooking = async (bookingId: string) => {
    try {
      const booking = await BookingAPI.getBookingById(bookingId);
      setBookingInfo(booking);
      setShowBooking(true);
    } catch {
      alert("Không thể lấy thông tin booking!");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-lg font-semibold text-gray-600 animate-pulse">Đang tải dữ liệu...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-lg font-semibold text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Danh Sách Thanh Toán</h1>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-600">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Mã Thanh Toán</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Mã Booking</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Ngày Booking</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Tổng Tiền</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Trạng Thái</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Phương Thức</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((p, idx) => (
                <tr
                  key={p.paymentId}
                  className="hover:bg-indigo-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleViewBooking(p.bookingId)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{p.paymentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{p.bookingId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(p.booking.dateBooking).toLocaleString("vi-VN")}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.totalAmount.toLocaleString("vi-VN")} đ</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.status === 'Đã thanh toán' ? 'bg-green-100 text-green-800' : 
                      p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showBooking && bookingInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
              onClick={() => setShowBooking(false)}
              aria-label="Đóng"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-indigo-600">Thông Tin Booking</h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Mã Booking:</span>
                <span>{bookingInfo.bookingId}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Ngày Booking:</span>
                <span>{new Date(bookingInfo.dateBooking).toLocaleString("vi-VN")}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Bệnh Nhân:</span>
                <span>{bookingInfo.patient?.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Dịch Vụ:</span>
                <span>{bookingInfo.service?.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Bác Sĩ:</span>
                <span>{bookingInfo.doctor?.doctorName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Khung Giờ:</span>
                <span>{bookingInfo.slot?.slotName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Trạng Thái:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  bookingInfo.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  bookingInfo.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {bookingInfo.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Ghi Chú:</span>
                <span>{bookingInfo.note || 'Không có'}</span>
              </div>
            </div>
            <div className="mt-8 text-right">
              <button
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                onClick={() => setShowBooking(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayment;