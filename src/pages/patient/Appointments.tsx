//src/pages/patient/Appointments.tsx
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { appointmentApi, addStatusToBooking } from '../../api/appointmentAPI';
import type { BookingWithStatus } from '../../api/appointmentAPI';

const AppointmentDetail = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<BookingWithStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        setLoading(true);
        if (!bookingId) return;
        
        const bookingData = await appointmentApi.getBookingById(bookingId);
        // Thêm trạng thái tính toán vào booking
        const bookingWithStatus = addStatusToBooking(bookingData);
        setBooking(bookingWithStatus);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết lịch hẹn:", error);
        setError("Không thể lấy thông tin chi tiết lịch hẹn. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    
    if (bookingId) {
      fetchBookingDetail();
    }
  }, [bookingId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link to="/patient/dashboard" className="text-blue-500 hover:text-blue-700">
          ← Quay lại Dashboard
        </Link>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Không tìm thấy thông tin lịch hẹn.
        </div>
        <Link to="/patient/dashboard" className="text-blue-500 hover:text-blue-700">
          ← Quay lại Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/patient/dashboard" className="text-blue-500 hover:text-blue-700">
          ← Quay lại Dashboard
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-6">Chi tiết lịch hẹn</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin lịch hẹn</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">ID lịch hẹn:</span> 
                <span className="ml-2">{booking.bookingId}</span>
              </div>
              <div>
                <span className="font-medium">Ngày hẹn:</span> 
                <span className="ml-2">{new Date(booking.dateBooking).toLocaleDateString('vi-VN')}</span>
              </div>
              <div>
                <span className="font-medium">Thời gian:</span> 
                <span className="ml-2">{booking.slot?.startTime} - {booking.slot?.endTime}</span>
              </div>
              <div>
                <span className="font-medium">Trạng thái:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                  booking.status === "Đã khám" ? "bg-green-100 text-green-800" :
                  booking.status === "Đã thanh toán" ? "bg-blue-100 text-blue-800" :
                  booking.status === "Chờ thanh toán" ? "bg-yellow-100 text-yellow-800" :
                  booking.status === "Đã quá hạn" ? "bg-red-100 text-red-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {booking.status}
                </span>
              </div>
              <div>
                <span className="font-medium">Ghi chú:</span> 
                <p className="mt-1 text-gray-700">{booking.note || "Không có ghi chú"}</p>
              </div>
              <div>
                <span className="font-medium">Mô tả:</span> 
                <p className="mt-1 text-gray-700">{booking.description || "Không có mô tả"}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin dịch vụ và bác sĩ</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Dịch vụ:</span> 
                <span className="ml-2">{booking.service?.name}</span>
              </div>
              <div>
                <span className="font-medium">Giá dịch vụ:</span> 
                <span className="ml-2">{booking.service?.price?.toLocaleString('vi-VN')} VND</span>
              </div>
              <div>
                <span className="font-medium">Bác sĩ:</span> 
                <span className="ml-2">{booking.doctor?.doctorName}</span>
              </div>
              <div>
                <span className="font-medium">Chuyên môn:</span> 
                <span className="ml-2">{booking.doctor?.specialization}</span>
              </div>
              <div>
                <span className="font-medium">Liên hệ bác sĩ:</span> 
                <div className="mt-1">
                  <div>Email: {booking.doctor?.email}</div>
                  <div>Điện thoại: {booking.doctor?.phone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {booking.payment && (
          <div className="mt-6 border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin thanh toán</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">ID thanh toán:</span> 
                <span className="ml-2">{booking.payment.paymentId}</span>
              </div>
              <div>
                <span className="font-medium">Số tiền:</span> 
                <span className="ml-2">{booking.payment.totalAmount?.toLocaleString('vi-VN')} VND</span>
              </div>
              <div>
                <span className="font-medium">Phương thức:</span> 
                <span className="ml-2">{booking.payment.method}</span>
              </div>
              <div>
                <span className="font-medium">Trạng thái thanh toán:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                  booking.payment.status === "Paid" ? "bg-green-100 text-green-800" :
                  booking.payment.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {booking.payment.status === "Paid" ? "Đã thanh toán" : 
                   booking.payment.status === "Pending" ? "Chờ thanh toán" : 
                   booking.payment.status}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {booking.examination && (
          <div className="mt-6 border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin khám bệnh</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">ID khám bệnh:</span> 
                <span className="ml-2">{booking.examination.examinationId}</span>
              </div>
              <div>
                <span className="font-medium">Ngày khám:</span> 
                <span className="ml-2">{new Date(booking.examination.examinationDate).toLocaleDateString('vi-VN')}</span>
              </div>
              <div>
                <span className="font-medium">Mô tả khám:</span> 
                <p className="mt-1 text-gray-700">{booking.examination.examinationDescription || "Không có mô tả"}</p>
              </div>
              <div>
                <span className="font-medium">Kết quả:</span> 
                <p className="mt-1 text-gray-700">{booking.examination.result || "Chưa có kết quả"}</p>
              </div>
              <div>
                <span className="font-medium">Trạng thái khám:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                  booking.examination.status === "Completed" ? "bg-green-100 text-green-800" :
                  booking.examination.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                  booking.examination.status === "Scheduled" ? "bg-yellow-100 text-yellow-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {booking.examination.status === "Completed" ? "Đã hoàn thành" : 
                   booking.examination.status === "In Progress" ? "Đang tiến hành" :
                   booking.examination.status === "Scheduled" ? "Đã lên lịch" :
                   booking.examination.status}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-end space-x-4">
          <Link 
            to="/patient/dashboard"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Quay lại
          </Link>
          
          {/* Chỉ hiển thị nút này nếu lịch hẹn chưa diễn ra và chưa khám */}
          {booking.status !== "Đã khám" && new Date(booking.dateBooking) > new Date() && (
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={() => {
                // Xử lý hủy lịch hẹn - có thể thêm xác nhận
                alert("Chức năng hủy lịch sẽ được thực hiện ở đây");
              }}
            >
              Hủy lịch hẹn
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetail;



