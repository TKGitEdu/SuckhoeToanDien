import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { bookingApi, cancelUpdateBooking } from '../../api/patientApi/bookingAPI';
import type { Booking, Slot } from '../../api/patientApi/bookingAPI';
import { bookingApiForBookingPage } from '../../api/patientApi/bookingApiForBookingPage';

const AppointmentDetail = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Ánh xạ trạng thái từ database sang hiển thị tiếng Việt
  const mapStatusToDisplay = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Đã đặt lịch';
      case 'cancelled':
      case 'đã hủy':
        return 'Đã hủy';
      case 'chờ thanh toán':
        return 'Chờ thanh toán';
      case 'đã quá hạn':
        return 'Đã quá hạn';
      case 'đã khám':
        return 'Đã khám';
      default:
        return status;
    }
  };

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        setLoading(true);
        if (!bookingId) {
          throw new Error('Không tìm thấy ID lịch hẹn');
        }

        // Lấy danh sách booking và tìm booking theo bookingId
        const bookings = await bookingApi.getMyBookings();
        const bookingData = bookings.find(b => b.bookingId === bookingId);
        if (!bookingData) {
          throw new Error('Không tìm thấy dữ liệu lịch hẹn');
        }

        // Lấy tất cả slots để tính toán thời gian chính xác
        const allSlots = await bookingApiForBookingPage.getAllSlots();
        setSlots(allSlots);

        setBooking(bookingData);
      } catch (error: any) {
        console.error("Lỗi khi lấy chi tiết lịch hẹn:", error);
        setError(error.message || "Không thể lấy thông tin chi tiết lịch hẹn. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetail();
  }, [bookingId]);

  const handleCancelBooking = async () => {
    if (!booking) return;

    // Kiểm tra thời gian còn lại đến lịch hẹn
    if (hoursToAppointment < minHoursToCancel) {
      alert(`Không thể hủy lịch hẹn khi ${timeRemainingText} đến lịch hẹn. Vui lòng liên hệ trực tiếp với phòng khám để hủy lịch hẹn.`);
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) return;

    try {
      setCancelLoading(true);
      await cancelUpdateBooking(booking.bookingId, { status: "Đã hủy" });
      
      // Cập nhật trạng thái cục bộ
      setBooking(prev => prev ? { ...prev, status: "Đã hủy" } : null);
      alert("Hủy lịch hẹn thành công!");
    } catch (err: any) {
      console.error("Lỗi khi hủy lịch hẹn:", err);
      alert(err.message || "Hủy lịch hẹn thất bại. Vui lòng thử lại sau.");
    } finally {
      setCancelLoading(false);
    }
  };

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

  const canCancelBooking = booking.status !== "Đã khám" && 
                         booking.status !== "cancelled" && 
                         booking.status !== "Đã hủy" && 
                         new Date(booking.dateBooking) > new Date();

  // Tính thời gian còn lại đến lịch hẹn (theo giờ) - sử dụng thông tin slot chính xác
  const calculateHoursToAppointment = () => {
    if (!booking || !slots.length) return 0;
    
    // Tìm slot tương ứng với booking
    const bookingSlot = slots.find(slot => slot.slotId === booking.slotId);
    if (!bookingSlot) {
      // Fallback về cách tính cũ nếu không tìm thấy slot
      const appointmentTime = new Date(booking.dateBooking).getTime();
      const currentTime = new Date().getTime();
      const diffInMs = appointmentTime - currentTime;
      return Math.round(diffInMs / (1000 * 60 * 60));
    }
    
    // Tạo DateTime chính xác từ dateBooking và startTime của slot
    const appointmentDate = booking.dateBooking.split('T')[0]; // Lấy phần ngày (YYYY-MM-DD)
    const startTime = bookingSlot.startTime; // Định dạng "HH:MM"
    
    // Kết hợp ngày và giờ để tạo datetime chính xác
    const appointmentDateTime = new Date(`${appointmentDate}T${startTime}:00`);
    const currentTime = new Date();
    
    const diffInMs = appointmentDateTime.getTime() - currentTime.getTime();
    return Math.round(diffInMs / (1000 * 60 * 60)); // Chuyển ms thành giờ và làm tròn
  };

  const hoursToAppointment = calculateHoursToAppointment();
  
  // Kiểm tra nếu thời gian còn lại ít hơn hoặc bằng 24 giờ thì không cho phép hủy
  const minHoursToCancel = 24;
  const canCancelByTime = hoursToAppointment > minHoursToCancel;

  // Định dạng thời gian còn lại thành dạng dễ đọc
  const formatTimeRemaining = (hours: number) => {
    if (hours < 0) return "Đã quá thời gian hẹn";
    if (hours < 1) return "Còn dưới 1 giờ";
    if (hours <= 24) return `Còn ${hours} giờ`;
    
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (remainingHours === 0) {
      return `Còn ${days} ngày`;
    } else {
      return `Còn ${days} ngày ${remainingHours} giờ`;
    }
  };

  const timeRemainingText = formatTimeRemaining(hoursToAppointment);

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
              {new Date(booking.dateBooking) > new Date() && (
                <div>
                  <span className="font-medium">Thời gian còn lại:</span> 
                  <span className={`ml-2 ${
                    hoursToAppointment < 24 ? "text-red-600 font-semibold" : "text-green-600"
                  }`}>
                    {timeRemainingText}
                  </span>
                </div>
              )}
              <div>
                <span className="font-medium">Trạng thái:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                  booking.status.toLowerCase() === "pending" ? "bg-green-100 text-green-800" :
                  booking.status.toLowerCase() === "cancelled" || booking.status === "Đã hủy" ? "bg-red-100 text-red-800" :
                  booking.status === "Chờ thanh toán" ? "bg-yellow-100 text-yellow-800" :
                  booking.status === "Đã quá hạn" ? "bg-red-100 text-red-800" :
                  booking.status === "Đã khám" ? "bg-blue-100 text-blue-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {mapStatusToDisplay(booking.status)}
                </span>
              </div>
              <div>
                <span className="font-medium">Mô tả:</span> 
                <p className="mt-1 text-gray-700">{booking.note || "Không có ghi chú"}</p>
              </div>
              <div>
                <span className="font-medium">Ghi chú:</span> 
                <p className="mt-1 text-gray-700">{booking.description || "Không có mô tả"}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin dịch vụ và bác sĩ</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Dịch vụ:</span> 
                <span className="ml-2">{booking.service?.name || "Không có thông tin"}</span>
              </div>
              <div>
                <span className="font-medium">Giá dịch vụ:</span> 
                <span className="ml-2">{booking.service?.price?.toLocaleString('vi-VN') || "N/A"} VND</span>
              </div>
              <div>
                <span className="font-medium">Bác sĩ:</span> 
                <span className="ml-2">{booking.doctor?.doctorName || "Không có thông tin"}</span>
              </div>
              <div>
                <span className="font-medium">Chuyên môn:</span> 
                <span className="ml-2">{booking.doctor?.specialization || "Không có thông tin"}</span>
              </div>
              <div>
                <span className="font-medium">Liên hệ bác sĩ:</span> 
                <div className="mt-1">
                  <div>Email: {booking.doctor?.email || "Không có thông tin"}</div>
                  <div>Điện thoại: {booking.doctor?.phone || "Không có thông tin"}</div>
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
                <span className="ml-2">{booking.payment.totalAmount?.toLocaleString('vi-VN') || "N/A"} VND</span>
              </div>
              <div>
                <span className="font-medium">Phương thức:</span> 
                <span className="ml-2">{booking.payment.method || "Không có thông tin"}</span>
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
                   booking.payment.status || "Không có thông tin"}
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
                   booking.examination.status || "Không có thông tin"}
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

          {canCancelBooking && canCancelByTime && (
            <button 
              className={`px-4 py-2 rounded-md text-white ${
                cancelLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
              }`}
              onClick={handleCancelBooking}
              disabled={cancelLoading}
            >
              {cancelLoading ? "Đang hủy..." : "Hủy lịch hẹn"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetail;