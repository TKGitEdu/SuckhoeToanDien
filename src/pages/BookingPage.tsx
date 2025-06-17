import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays, Clock, User, Phone, Mail, FileText, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

// Giả lập dữ liệu dịch vụ
const services = [
  { id: 1, name: "Thụ tinh trong tử cung (IUI)", price: "15,000,000 VNĐ" },
  { id: 2, name: "Thụ tinh trong ống nghiệm (IVF)", price: "60,000,000 VNĐ" },
  { id: 3, name: "Bảo quản trứng", price: "30,000,000 VNĐ" },
  { id: 4, name: "Bảo quản tinh trùng", price: "20,000,000 VNĐ" },
  { id: 5, name: "Tư vấn di truyền", price: "5,000,000 VNĐ" }
];

// Giả lập dữ liệu bác sĩ
const doctors = [
  { id: 1, name: "TS. BS. Nguyễn Văn A", specialty: "Chuyên gia IVF" },
  { id: 2, name: "PGS. TS. Trần Thị B", specialty: "Sản phụ khoa" },
  { id: 3, name: "TS. BS. Lê Văn C", specialty: "Nội tiết sinh sản" },
  { id: 4, name: "BS. CKI. Phạm Thị D", specialty: "Hiếm muộn nam" }
];

// Giả lập khung giờ
const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
  "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
];

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  serviceId: number;
  doctorId: number;
  appointmentDate: Date | null;
  appointmentTime: string;
  message: string;
};

const BookingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState("");
  
  const { 
    register, 
    handleSubmit, 
    control,
    watch,
    formState: { errors, isValid }
  } = useForm<FormData>({
    defaultValues: {
      serviceId: 0,
      doctorId: 0,
      appointmentDate: null,
      appointmentTime: ""
    }
  });

  const selectedServiceId = watch("serviceId");
  const selectedDoctorId = watch("doctorId");
  const selectedDate = watch("appointmentDate");

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data);
    // Giả lập API call
    setTimeout(() => {
      setBookingId(`BK${Math.floor(Math.random() * 10000)}`);
      setBookingComplete(true);
    }, 1500);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const selectedService = services.find(service => service.id === parseInt(String(selectedServiceId)));
  const selectedDoctor = doctors.find(doctor => doctor.id === parseInt(String(selectedDoctorId)));

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Đặt lịch tư vấn & điều trị</h1>
        <p className="mt-3 text-lg text-gray-600">
          Đặt lịch hẹn để nhận được tư vấn từ các chuyên gia của chúng tôi
        </p>
      </div>

      {!bookingComplete ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Progress Steps */}
          <div className="border-b border-gray-200">
            <div className="max-w-3xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <div className="ml-3">
                    <span className="text-sm font-medium">Chọn dịch vụ</span>
                  </div>
                </div>
                <div className={`flex-1 border-t-2 ${currentStep > 1 ? 'border-blue-600' : 'border-gray-200'} mx-4`} />
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                  <div className="ml-3">
                    <span className="text-sm font-medium">Chọn bác sĩ & lịch hẹn</span>
                  </div>
                </div>
                <div className={`flex-1 border-t-2 ${currentStep > 2 ? 'border-blue-600' : 'border-gray-200'} mx-4`} />
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    3
                  </div>
                  <div className="ml-3">
                    <span className="text-sm font-medium">Thông tin cá nhân</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Select Service */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Chọn dịch vụ bạn quan tâm</h2>
                
                <div className="grid grid-cols-1 gap-4">
                  {services.map((service) => (
                    <label
                      key={service.id}
                      className={`relative block p-6 border rounded-lg cursor-pointer ${
                        parseInt(String(selectedServiceId)) === service.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="radio"
                        value={service.id}
                        {...register("serviceId", { required: true })}
                        className="sr-only"
                      />
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                          <p className="text-blue-600 font-medium mt-1">{service.price}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          parseInt(String(selectedServiceId)) === service.id
                            ? 'border-blue-600'
                            : 'border-gray-300'
                        }`}>
                          {parseInt(String(selectedServiceId)) === service.id && (
                            <div className="w-3 h-3 rounded-full bg-blue-600" />
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {errors.serviceId && (
                  <p className="mt-2 text-sm text-red-600">Vui lòng chọn dịch vụ</p>
                )}

                <div className="mt-8 flex justify-end">
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!selectedServiceId}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Tiếp tục
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Select Doctor & Date */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Chọn bác sĩ và lịch hẹn</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Chọn bác sĩ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctors.map((doctor) => (
                      <label
                        key={doctor.id}
                        className={`relative block p-4 border rounded-lg cursor-pointer ${
                          parseInt(String(selectedDoctorId)) === doctor.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          value={doctor.id}
                          {...register("doctorId", { required: true })}
                          className="sr-only"
                        />
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-base font-medium text-gray-900">{doctor.name}</h4>
                            <p className="text-sm text-gray-500">{doctor.specialty}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            parseInt(String(selectedDoctorId)) === doctor.id
                              ? 'border-blue-600'
                              : 'border-gray-300'
                          }`}>
                            {parseInt(String(selectedDoctorId)) === doctor.id && (
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.doctorId && (
                    <p className="mt-2 text-sm text-red-600">Vui lòng chọn bác sĩ</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Chọn ngày</h3>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <CalendarDays size={20} />
                      </div>
                      <Controller
                        control={control}
                        name="appointmentDate"
                        rules={{ required: true }}
                        render={({ field }) => (
                          <ReactDatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            minDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholderText="Chọn ngày"
                          />
                        )}
                      />
                    </div>
                    {errors.appointmentDate && (
                      <p className="mt-2 text-sm text-red-600">Vui lòng chọn ngày hẹn</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Chọn giờ</h3>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <Clock size={20} />
                      </div>
                      <select
                        {...register("appointmentTime", { required: true })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        disabled={!selectedDate}
                      >
                        <option value="">Chọn giờ</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.appointmentTime && (
                      <p className="mt-2 text-sm text-red-600">Vui lòng chọn giờ hẹn</p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button 
                    type="button" 
                    onClick={prevStep}
                    variant="outline"
                    className="border-blue-600 text-blue-600"
                  >
                    Quay lại
                  </Button>
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!selectedDoctorId || !selectedDate || !watch("appointmentTime")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Tiếp tục
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Personal Information */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin của bạn</h2>
                  </div>
                  
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <User size={20} />
                      </div>
                      <input
                        id="fullName"
                        type="text"
                        {...register("fullName", { required: true })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">Vui lòng nhập họ tên</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <Phone size={20} />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        {...register("phone", { 
                          required: true,
                          pattern: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/
                        })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0912345678"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">Vui lòng nhập số điện thoại hợp lệ</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <Mail size={20} />
                      </div>
                      <input
                        id="email"
                        type="email"
                        {...register("email", { 
                          required: true,
                          pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                        })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="youremail@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">Vui lòng nhập email hợp lệ</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú (không bắt buộc)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-4 text-gray-500">
                        <FileText size={20} />
                      </div>
                      <textarea
                        id="message"
                        rows={4}
                        {...register("message")}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Vui lòng cho biết thông tin bổ sung nếu cần thiết..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Thông tin đặt lịch</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Dịch vụ</p>
                      <p className="font-medium">{selectedService?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bác sĩ</p>
                      <p className="font-medium">{selectedDoctor?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ngày hẹn</p>
                      <p className="font-medium">
                        {selectedDate ? selectedDate.toLocaleDateString('vi-VN') : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Giờ hẹn</p>
                      <p className="font-medium">{watch("appointmentTime")}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button 
                    type="button" 
                    onClick={prevStep}
                    variant="outline"
                    className="border-blue-600 text-blue-600"
                  >
                    Quay lại
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Xác nhận đặt lịch
                  </Button>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Đặt lịch thành công!</h2>
          <p className="text-lg text-gray-600 mb-2">
            Cảm ơn bạn đã đặt lịch tại FertilityCare.
          </p>
          <p className="text-gray-600 mb-6">
            Mã đặt lịch của bạn: <span className="font-bold text-blue-600">{bookingId}</span>
          </p>
          <p className="text-gray-600 mb-8">
            Chúng tôi sẽ liên hệ với bạn qua email hoặc số điện thoại để xác nhận lịch hẹn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="outline" className="border-blue-600 text-blue-600">
                Về trang chủ
              </Button>
            </Link>
            <Link to="/patient/appointments">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Xem lịch hẹn của tôi
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BookingPage;
