import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  CalendarClock,
  Calendar as CalendarIcon,
  Check,
  X,
  ClipboardList,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { getDoctorBookingsbyUserId } from "../../api/doctorApi/dashboardAPI";
import { confirmBooking, cancelBooking, rescheduleBooking, getAllSlots } from "../../api/doctorApi/appointmentsAPI";
import type { Service } from "../../api/patientApi/bookingAPI";
import type { Slot } from "../../api/doctorApi/appointmentsAPI";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

// Interface for appointment data
interface AppointmentData {
  id: string;
  patientName: string;
  patientId: string;
  service: string;
  serviceId: string;
  date: string;
  time: string;
  status: string;
  type?: string;
  history: boolean;
  notes?: string;
  rawDate: Date;
}

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State for storing actual appointment data
  const [allAppointments, setAllAppointments] = useState<AppointmentData[]>([]);
  // State for storing unique dates from appointments for filter
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  // State for storing current month and year for calendar
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  // State for storing slots data
  const [slots, setSlots] = useState<Slot[]>([]);
  
  // State cho modal đổi lịch hẹn
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleInfo, setRescheduleInfo] = useState({
    appointmentId: "",
    patientName: "",
    newDate: format(new Date(), 'yyyy-MM-dd'),
    slotId: "",
    note: "Lịch hẹn đã được lên lịch lại bởi bác sĩ"
  });
  
  const appointmentsPerPage = 5;

  // Format date for display (DD/MM/YYYY)
  const formatDate = (dateString: string): string => {
    try {
      const date = parseISO(dateString);
      return format(date, 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Format time from ISO date (HH:MM)
  const formatTime = (timeString: string): string => {
    try {
      return timeString.split(':').slice(0, 2).join(':');
    } catch (error) {
      console.error("Error formatting time:", error);
      return timeString;
    }
  };

  // Determine service type based on service category
  const getServiceType = (service: Service | undefined): string => {
    if (!service || !service.category) return 'regular';
    
    const category = service.category.toLowerCase();
    if (category.includes('điều trị') || category.includes('treatment')) return 'treatment';
    if (category.includes('tư vấn') || category.includes('consultation')) return 'consultation';
    if (category.includes('xét nghiệm') || category.includes('test')) return 'test';
    return 'regular';
  };

  // Fetch appointments data
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        // Get userId from localStorage
        const userInfo = localStorage.getItem("userInfo");
        const userId = userInfo ? JSON.parse(userInfo).userId : null;

        if (!userId) {
          console.error("Không tìm thấy userId trong localStorage");
          setLoading(false);
          return;
        }

        // Fetch bookings data
        const bookingsData = await getDoctorBookingsbyUserId(userId);
        
        // Process and format the booking data
        const formattedAppointments: AppointmentData[] = bookingsData.map(booking => {
          const bookingDate = parseISO(booking.dateBooking);
          return {
            id: booking.bookingId,
            patientName: booking.patient?.name || "Không xác định",
            patientId: booking.patientId || "Không xác định",
            service: booking.service?.name || "Không xác định",
            serviceId: booking.serviceId,
            date: formatDate(booking.dateBooking),
            time: booking.slot?.startTime ? formatTime(booking.slot.startTime) : "Không xác định",
            status: booking.status || "Pending",
            type: getServiceType(booking.service),
            history: booking.examination !== undefined,
            notes: booking.note || booking.description,
            rawDate: bookingDate
          };
        }).sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
        
        // Extract unique dates for date filter
        const uniqueDates = [...new Set(formattedAppointments.map(app => app.date))];
        
        setAllAppointments(formattedAppointments);
        setAvailableDates(uniqueDates);
        
        // Fetch slots data
        try {
          const slotsData = await getAllSlots();
          setSlots(slotsData);

        } catch (error) {
          console.error("Lỗi khi lấy thông tin slots:", error);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách lịch hẹn:", error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => {
      const newDate = new Date(prevMonth);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newDate = new Date(prevMonth);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Filter appointments
  const filteredAppointments = allAppointments.filter((appointment) => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = selectedDate ? appointment.date === selectedDate : true;
    const matchesStatus = selectedStatus ? appointment.status === selectedStatus : true;
    const matchesType = selectedType ? appointment.type === selectedType : true;
    
    return matchesSearch && matchesDate && matchesStatus && matchesType;
  });

  // Get current appointments for pagination
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const pageCount = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDate(null);
    setSelectedStatus(null);
    setSelectedType(null);
    setCurrentPage(1);
  };

  // Function to refresh appointment data
  const refreshAppointments = async () => {
    try {
      setLoading(true);
      const userInfo = localStorage.getItem("userInfo");
      const userId = userInfo ? JSON.parse(userInfo).userId : null;

      if (!userId) {
        console.error("Không tìm thấy userId trong localStorage");
        setLoading(false);
        return;
      }

      // Fetch updated bookings data
      const bookingsData = await getDoctorBookingsbyUserId(userId);
      
      // Process and format the booking data
      const formattedAppointments: AppointmentData[] = bookingsData.map(booking => {
        const bookingDate = parseISO(booking.dateBooking);
        return {
          id: booking.bookingId,
          patientName: booking.patient?.name || "Không xác định",
          patientId: booking.patientId || "Không xác định",
          service: booking.service?.name || "Không xác định",
          serviceId: booking.serviceId,
          date: formatDate(booking.dateBooking),
          time: booking.slot?.startTime ? formatTime(booking.slot.startTime) : "Không xác định",
          status: booking.status || "Pending",
          type: getServiceType(booking.service),
          history: booking.examination !== undefined,
          notes: booking.note || booking.description,
          rawDate: bookingDate
        };
      }).sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
      
      // Extract unique dates for date filter
      const uniqueDates = [...new Set(formattedAppointments.map(app => app.date))];
      
      setAllAppointments(formattedAppointments);
      setAvailableDates(uniqueDates);
      
      // Refresh slots data
      try {
        const slotsData = await getAllSlots();
        setSlots(slotsData);

      } catch (error) {
        console.error("Lỗi khi cập nhật thông tin slots:", error);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật danh sách lịch hẹn:", error);
      setLoading(false);
    }
  };

  // Function to handle appointment confirmation
  // IMPORTANT: This function only updates the status to "confirmed" 
  // while preserving all other original booking details (date, time, service, slot)
  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      setLoading(true);
      
      // Find the appointment in our local state
      const appointmentToConfirm = allAppointments.find(app => app.id === appointmentId);
      
      if (!appointmentToConfirm) {
        console.error(`Không tìm thấy lịch hẹn với ID ${appointmentId}`);
        setLoading(false);
        return;
      }
      
      // Get the booking data from the API to get the complete booking details
      const userInfo = localStorage.getItem("userInfo");
      const userId = userInfo ? JSON.parse(userInfo).userId : null;
      
      if (!userId) {
        console.error("Không tìm thấy userId trong localStorage");
        setLoading(false);
        return;
      }
      
      // Get all bookings to find the one we want to confirm
      const bookingsData = await getDoctorBookingsbyUserId(userId);
      const originalBooking = bookingsData.find(booking => booking.bookingId === appointmentId);
      
      if (!originalBooking) {
        console.error(`Không tìm thấy dữ liệu gốc của lịch hẹn ${appointmentId}`);
        setLoading(false);
        return;
      }
      
      // Create a confirmation data object that preserves ALL original booking details
      // We only change the status to "confirmed" and keep everything else exactly as it was
      const confirmationData = {
        doctorId: originalBooking.doctorId,
        serviceId: originalBooking.serviceId,
        slotId: originalBooking.slotId,
        dateBooking: originalBooking.dateBooking, // Keep the original booking date and time
        description: originalBooking.description || "", // Keep original description, fallback to empty string
        note: originalBooking.note || "Đã xác nhận bởi bác sĩ", // Can update note to indicate confirmation
        status: "confirmed" // This is the ONLY field we're changing
      };
      

      
      // Call the API to confirm the appointment - status is the only field being modified
      await confirmBooking(appointmentId, confirmationData);
      
      // // Show success message
      // alert("Xác nhận lịch hẹn thành công!");
      
      // Refresh appointment data
      await refreshAppointments();
      
    } catch (error) {
      console.error(`Lỗi khi xác nhận lịch hẹn ${appointmentId}:`, error);
      alert("Không thể xác nhận lịch hẹn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle appointment cancellation
  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      setLoading(true);
      
      // Find the appointment to be cancelled
      const appointmentToCancel = allAppointments.find(app => app.id === appointmentId);
      
      if (!appointmentToCancel) {
        console.error(`Không tìm thấy lịch hẹn với ID ${appointmentId}`);
        setLoading(false);
        return;
      }
      
      // Get the doctor information from localStorage
      const userInfo = localStorage.getItem("userInfo");
      const userObj = userInfo ? JSON.parse(userInfo) : null;
      
      if (!userObj || !userObj.userId) {
        console.error("Không tìm thấy thông tin bác sĩ");
        setLoading(false);
        return;
      }
      
      // Ask for confirmation before cancelling
      const confirmCancel = window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?");
      if (!confirmCancel) {
        setLoading(false);
        return;
      }
      
      // Get doctorId (either from doctor object or use a default if not available)
      const doctorId = userObj.doctor?.doctorId || "DOC_1";
      
      // Optional: Ask for a reason
      const cancelReason = prompt("Lý do hủy lịch hẹn (không bắt buộc):", "Lịch hẹn đã bị hủy bởi bác sĩ");
      const note = cancelReason || "Lịch hẹn đã bị hủy bởi bác sĩ";
      
      // Call the API to cancel the appointment
      await cancelBooking(appointmentId, doctorId, note);
      
      // Show success message
      alert("Hủy lịch hẹn thành công!");
      
      // Refresh appointment data
      await refreshAppointments();
      
      // Clear selected appointment
      setSelectedAppointment(null);
      
    } catch (error) {
      console.error(`Lỗi khi hủy lịch hẹn ${appointmentId}:`, error);
      alert(`Không thể hủy lịch hẹn. Lỗi: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle appointment rescheduling
  const handleRescheduleAppointment = (appointmentId: string) => {
    // Find the appointment to be rescheduled
    const appointmentToReschedule = allAppointments.find(app => app.id === appointmentId);
    
    if (!appointmentToReschedule) {
      console.error(`Không tìm thấy lịch hẹn với ID ${appointmentId}`);
      return;
    }
    
    // Tạo giá trị mặc định cho modal
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDateStr = format(tomorrow, 'yyyy-MM-dd');
    
    // Cập nhật thông tin cho modal
    setRescheduleInfo({
      appointmentId: appointmentId,
      patientName: appointmentToReschedule.patientName,
      newDate: defaultDateStr,
      slotId: slots.length > 0 ? slots[0].slotId : "",
      note: "Lịch hẹn đã được lên lịch lại bởi bác sĩ"
    });
    
    // Mở modal
    setIsRescheduleModalOpen(true);
  };
  
  // Function to handle confirming the reschedule from the modal
  const confirmReschedule = async () => {
    try {
      setLoading(true);
      
      // Get the doctor information from localStorage
      const userInfo = localStorage.getItem("userInfo");
      const userObj = userInfo ? JSON.parse(userInfo) : null;

      if (!userObj || !userObj.doctor?.doctorId) {
        console.error("Không tìm thấy thông tin bác sĩ");
        setLoading(false);
        return;
      }
      
      // Get doctorId (either from doctor object or use a default if not available)
      const doctorId = localStorage.getItem("doctorId") || userObj.doctor?.doctorId || "DOC_1";
      
      // Format the date properly
      const [year, month, day] = rescheduleInfo.newDate.split('-').map(Number);
      const newDate = new Date(year, month - 1, day + 1); // +1 to adjust for 0-indexed month
      const isoDate = newDate.toISOString();
      
      // Call the API to reschedule the appointment
      await rescheduleBooking(
        rescheduleInfo.appointmentId, 
        doctorId, 
        isoDate, 
        rescheduleInfo.slotId, 
        rescheduleInfo.note
      );
      
      // Show success message
      alert("Đổi lịch hẹn thành công!");
      
      // Refresh appointment data
      await refreshAppointments();
      
      // Close modal and clear selected appointment
      setIsRescheduleModalOpen(false);
      setSelectedAppointment(null);
      
    } catch (error) {
      console.error(`Lỗi khi đổi lịch hẹn ${rescheduleInfo.appointmentId}:`, error);
      alert(`Không thể đổi lịch hẹn. Lỗi: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý lịch hẹn</h1>
            <p className="mt-1 text-gray-600">
              Xem và quản lý tất cả các lịch hẹn với bệnh nhân
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Tìm kiếm bệnh nhân theo tên, ID hoặc dịch vụ..."
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <select
                    value={selectedDate || ""}
                    onChange={(e) => setSelectedDate(e.target.value || null)}
                    className="block border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tất cả ngày</option>
                    {availableDates.map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedStatus || ""}
                    onChange={(e) => setSelectedStatus(e.target.value || null)}
                    className="block border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="Pending">Đang chờ</option>
                    <option value="completed">Đã hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                    <option value="rescheduled">Đã đổi lịch</option>
                  </select>
                  
                  <select
                    value={selectedType || ""}
                    onChange={(e) => setSelectedType(e.target.value || null)}
                    className="block border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tất cả loại</option>
                    <option value="regular">Khám thường</option>
                    <option value="treatment">Điều trị</option>
                    <option value="consultation">Tư vấn</option>
                    <option value="test">Xét nghiệm</option>
                  </select>
                  
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    className="border-gray-300 text-gray-700"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Xóa bộ lọc
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Calendar View */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Lịch hẹn theo ngày</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="border-gray-300" onClick={goToPreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-gray-700">
                    {format(currentMonth, 'MMMM yyyy', { locale: vi })}
                  </span>
                  <Button variant="outline" size="sm" className="border-gray-300" onClick={goToNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
                  <div key={index} className="text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {(() => {
                  // Get start of month
                  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                  // Get day of week for first day (0 for Sunday, 1 for Monday, etc.)
                  const firstDayOfMonth = startOfMonth.getDay();
                  // Get number of days in month
                  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()+1;
                  
                  // Create array for calendar cells
                  const calendarDays = [];
                  
                  // Add empty cells for days before first day of month
                  for (let i = 0; i < firstDayOfMonth; i++) {
                    calendarDays.push(
                      <button key={`empty-${i}`} disabled className="h-12 rounded-md text-gray-300"></button>
                    );
                  }
                  
                  // Add cells for each day of month
                  for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    const formattedDate = format(date, 'dd/MM/yyyy', { locale: vi });
                    const isToday = new Date().toDateString() === date.toDateString();
                    
                    // Lọc ra các cuộc hẹn không bị hủy (status không phải là 'cancelled')
                    const validAppointments = allAppointments.filter(a => a.status !== 'cancelled');
                    
                    // Kiểm tra xem có cuộc hẹn nào không bị hủy không
                    const hasAppointment = validAppointments.some(a => a.date === formattedDate);
                    
                    // Chỉ đếm các cuộc hẹn không bị hủy
                    const appointmentsForDate = validAppointments.filter(a => a.date === formattedDate);
                    const appointmentCount = appointmentsForDate.length;
                    
                    // Chỉ hiển thị slot của các cuộc hẹn không bị hủy
                    const slotsForDay = new Set<string>();
                    appointmentsForDate.forEach(app => {
                      const appTime = app.time;
                      // Find matching slot
                      const matchingSlot = slots.find(slot => 
                        slot.startTime === appTime || 
                        slot.slotName.includes(appTime)
                      );
                      if (matchingSlot) {
                        slotsForDay.add(matchingSlot.slotName);
                      }
                    });
                    
                    calendarDays.push(
                      <button
                        key={`day-${day}`}
                        onClick={() => setSelectedDate(formattedDate === selectedDate ? null : formattedDate)}
                        className={`
                          min-h-12 rounded-md flex flex-col items-center justify-center p-1
                          text-gray-800 
                          ${isToday ? 'border-2 border-blue-500' : 'border border-gray-200'} 
                          ${hasAppointment ? 'bg-blue-50' : ''}
                          ${selectedDate === formattedDate ? 'bg-blue-100' : ''}
                          hover:bg-gray-50 focus:outline-none
                        `}
                      >
                        <span className="font-medium">{day}</span>
                        {appointmentCount > 0 && (
                          <div className="mt-1 text-xs font-medium text-blue-600">
                            {appointmentCount} lịch hẹn
                          </div>
                        )}
                        {slotsForDay.size > 0 && (
                          <div className="mt-1 text-xs text-gray-500 text-center">
                            {Array.from(slotsForDay).slice(0, 1).map((slotName, i) => (
                              <div key={i} className="truncate max-w-[80px]">{slotName}</div>
                            ))}
                            {slotsForDay.size > 1 && <div>+{slotsForDay.size - 1} khung giờ</div>}
                          </div>
                        )}
                      </button>
                    );
                  }
                  
                  return calendarDays;
                })()}
              </div>
              
              {/* Slot information for selected date */}
              {selectedDate && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Khung giờ cho ngày {selectedDate}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {slots.map(slot => {
                      // Check if this slot has any bookings for the selected date
                      // Tìm booking cho slot này trên ngày đã chọn
                      const bookingsForSlot = slot.bookings?.filter(booking => {
                        const bookingDate = formatDate(booking.dateBooking);
                        return bookingDate === selectedDate;
                      }) || [];
                      
                      // Tìm tất cả booking ID từ bookingsForSlot
                      const bookingIds = bookingsForSlot.map(b => b.bookingId);
                      
                      // Lọc tất cả lịch hẹn không bị hủy (từ allAppointments) dựa trên bookingIds
                      const activeBookings = allAppointments.filter(
                        app => bookingIds.includes(app.id) && app.status !== 'cancelled'
                      );
                      
                      // Kiểm tra nếu có ít nhất một lịch hẹn không bị hủy
                      const hasActiveBookingForDate = activeBookings.length > 0;
                      
                      return (
                        <div 
                          key={slot.slotId}
                          className={`p-2 rounded-md border ${activeBookings.length > 0 ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}`}
                        >
                          <div className="font-medium text-gray-900">{slot.slotName}</div>
                          <div className="text-sm text-gray-500">{`${slot.startTime} - ${slot.endTime}`}</div>
                          {activeBookings.length > 0 && (
                            <div className="mt-1 text-xs text-blue-600">
                              {activeBookings.length} lịch hẹn
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Appointments List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    Danh sách lịch hẹn {selectedDate ? `(${selectedDate})` : ''}
                  </h2>
                  <span className="text-sm text-gray-500">
                    Hiển thị {currentAppointments.length} trong số {filteredAppointments.length} lịch hẹn
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bệnh nhân
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dịch vụ
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày & Giờ
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ghi chú
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Xem thêm
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentAppointments.map((appointment) => (
                      <tr 
                        key={appointment.id} 
                        onClick={() => setSelectedAppointment(appointment.id === selectedAppointment ? null : appointment.id)}
                        className={`hover:bg-gray-50 cursor-pointer ${appointment.id === selectedAppointment ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                              <div className="text-sm text-gray-500">ID: {appointment.patientId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{appointment.service}</div>
                          <div className="text-xs text-gray-500">
                            {appointment.type === 'regular' && 'Khám thường'}
                            {appointment.type === 'treatment' && 'Điều trị'}
                            {appointment.type === 'consultation' && 'Tư vấn'}
                            {appointment.type === 'test' && 'Xét nghiệm'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">{appointment.date}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Clock className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">{appointment.time}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : appointment.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : appointment.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : appointment.status === 'rescheduled'
                              ? 'bg-purple-100 text-purple-800'
                              : appointment.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status === 'confirmed' ? 'Đã xác nhận' : 
                             appointment.status === 'Pending' ? 'Đang chờ' : // code backend, database nó vậy khỏi sửa nữa mệt quá
                             appointment.status === 'completed' ? 'Đã hoàn thành' :
                             appointment.status === 'rescheduled' ? 'Đã dời lịch' :
                             appointment.status === 'cancelled' ? 'Đã hủy' : 'Đang chờ'}
                             
                          </span>
                          {appointment.history && (
                            <div className="mt-1 flex items-center text-xs text-gray-500">
                              <ClipboardList className="h-3 w-3 mr-1" />
                              <span>Có lịch sử</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{appointment.notes || 'Không có ghi chú'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-sm border-gray-300 text-gray-700"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row selection
                              // Navigate to patient's profile page
                              navigate(`/doctor/patients?patientId=${appointment.patientId}`);
                            }}
                          >
                            Xem hồ sơ
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {currentAppointments.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Không tìm thấy lịch hẹn nào phù hợp với bộ lọc</p>
                  <Button onClick={resetFilters} className="mt-2 bg-blue-600 hover:bg-blue-700">
                    Xóa bộ lọc
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {pageCount > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <Button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="text-sm border-gray-300 text-gray-700"
                    >
                      Trước
                    </Button>
                    <Button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === pageCount}
                      variant="outline"
                      className="ml-3 text-sm border-gray-300 text-gray-700"
                    >
                      Sau
                    </Button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Hiển thị <span className="font-medium">{indexOfFirstAppointment + 1}</span> đến{' '}
                        <span className="font-medium">
                          {Math.min(indexOfLastAppointment, filteredAppointments.length)}
                        </span>{' '}
                        trong số <span className="font-medium">{filteredAppointments.length}</span> lịch hẹn
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        
                        {Array.from({ length: pageCount }, (_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border ${
                              currentPage === i + 1
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            } text-sm font-medium`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === pageCount}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Appointment Actions */}
            {selectedAppointment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8 bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100"
              >
                {(() => {
                  // Find the selected appointment to display its details
                  const appointment = allAppointments.find(app => app.id === selectedAppointment);
                  if (!appointment) return null;
                  
                  return (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Quản lý lịch hẹn #{selectedAppointment}
                          </h3>
                          
                        </div>
                        <button onClick={() => setSelectedAppointment(null)} className="text-gray-500 hover:text-gray-700">
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        <Button 
                          variant="outline" 
                          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            if (appointment && (appointment.status === 'Pending' || appointment.status === 'confirmed'|| appointment.status === 'rescheduled')) {
                              handleRescheduleAppointment(selectedAppointment);
                            } else {
                              alert("Chỉ có thể đổi lịch hẹn có trạng thái 'Đang chờ' hoặc 'Đã xác nhận' hoặc 'Đã dời lịch'");
                            }
                          }}
                          disabled={appointment.status === 'completed' || appointment.status === 'cancelled'}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Đổi lịch hẹn
                        </Button>
                        <Button 
                          variant="outline" 
                          className="bg-white border-red-300 text-red-700 hover:bg-red-50"
                          onClick={() => {
                            if (appointment && (appointment.status === 'Pending' || appointment.status === 'confirmed'|| appointment.status === 'rescheduled')) {
                              handleCancelAppointment(selectedAppointment);
                            } else {
                              alert("Chỉ có thể hủy lịch hẹn có trạng thái 'Đang chờ' hoặc 'Đã xác nhận' hoặc 'Đã dời lịch'");
                            }
                          }}
                          disabled={appointment.status === 'completed' || appointment.status === 'cancelled'}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Hủy lịch hẹn
                        </Button>
                        <Button 
                          variant="outline"
                          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            // Navigate to patient's profile page
                            navigate(`/doctor/patients?patientId=${appointment.patientId}`);
                          }}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Xem hồ sơ
                        </Button>
                        <Button 
                          className={`${appointment.status === 'confirmed' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                          onClick={() => {
                            if (appointment.status === 'Pending' || appointment.status === 'rescheduled') {
                              handleConfirmAppointment(selectedAppointment);
                            } else if (appointment.status === 'confirmed') {
                              // Nếu đã confirmed thì chuyển đến trang interactive-patient với bookingId
                              navigate(`/doctor/interactive-patient/${selectedAppointment}`);
                            } else if (appointment.status === 'completed') {
                              alert("Lịch hẹn đã hoàn thành. Không thể xác nhận lại.");
                            } else if (appointment.status === 'cancelled') {
                              alert("Lịch hẹn đã bị hủy. Không thể xác nhận.");
                            }
                          }}
                          disabled={appointment.status !== 'Pending' && appointment.status !== 'confirmed' && appointment.status !== 'rescheduled'}
                        >
                          {appointment.status === 'confirmed' ? (
                            <>
                              <CalendarClock className="mr-2 h-4 w-4" />
                              Bắt đầu khám
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Xác nhận lịch hẹn
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-md font-semibold text-gray-900 mb-2">Thông tin chi tiết</h4>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-medium text-gray-700">Bệnh nhân:</span>
                              <div className="text-sm text-gray-900">{appointment.patientName}</div>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">ID Bệnh nhân:</span>
                              <div className="text-sm text-gray-900">{appointment.patientId}</div>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Dịch vụ:</span>
                              <div className="text-sm text-gray-900">{appointment.service}</div>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Ngày hẹn:</span>
                              <div className="text-sm text-gray-900">{appointment.date}</div>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Giờ hẹn:</span>
                              <div className="text-sm text-gray-900">{appointment.time}</div>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                              <div className="text-sm text-gray-900">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  appointment.status === 'confirmed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : appointment.status === 'Pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : appointment.status === 'completed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : appointment.status === 'rescheduled'
                                    ? 'bg-purple-100 text-purple-800'
                                    : appointment.status === 'cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {appointment.status === 'confirmed' ? 'Đã xác nhận' : 
                                   appointment.status === 'Pending' ? 'Đang chờ' : // code backend, database nó vậy khỏi sửa nữa mệt quá
                                   appointment.status === 'completed' ? 'Đã hoàn thành' :
                                   appointment.status === 'rescheduled' ? 'Đã dời lịch' :
                                   appointment.status === 'cancelled' ? 'Đã hủy' : 'không biết'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}
          </>
        )}
      </div>
      
      {/* Modal đổi lịch hẹn */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Đổi lịch hẹn</h3>
              <button
                onClick={() => setIsRescheduleModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bệnh nhân
                </label>
                <input
                  type="text"
                  value={rescheduleInfo.patientName}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày mới (yyyy-MM-dd)
                </label>
                <input
                  type="date"
                  value={rescheduleInfo.newDate}
                  onChange={(e) => setRescheduleInfo({...rescheduleInfo, newDate: e.target.value})}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khung giờ
                </label>
                <select
                  value={rescheduleInfo.slotId}
                  onChange={(e) => setRescheduleInfo({...rescheduleInfo, slotId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {slots.map(slot => (
                    <option key={slot.slotId} value={slot.slotId}>
                      {slot.slotName} ({slot.startTime} - {slot.endTime})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lý do đổi lịch
                </label>
                <textarea
                  value={rescheduleInfo.note}
                  onChange={(e) => setRescheduleInfo({...rescheduleInfo, note: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsRescheduleModalOpen(false)}
                  className="border-gray-300"
                >
                  Hủy
                </Button>
                <Button
                  onClick={confirmReschedule}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Xác nhận đổi lịch
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
