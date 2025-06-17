import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Send,
  User,
  Calendar,
  Check,
  FileText,
  X
} from "lucide-react";
import { Button } from "../../components/ui/button";

// Define types for feedback
type DoctorType = {
  id: string;
  name: string;
  specialty: string;
  image: string;
};

type ServiceType = {
  id: string;
  name: string;
  description: string;
};

type TreatmentType = {
  id: string;
  type: string;
  doctor: string;
  doctorId: string;
  startDate: string;
  endDate: string | null;
  status: "in-progress" | "completed" | "cancelled";
};

const PatientFeedback = () => {
  // Mock data for doctors and services
  const doctors: DoctorType[] = [
    {
      id: "DR001",
      name: "TS. BS. Nguyễn Văn A",
      specialty: "Chuyên gia IVF",
      image: "https://randomuser.me/api/portraits/men/36.jpg"
    },
    {
      id: "DR002",
      name: "PGS. TS. Trần Thị B",
      specialty: "Sản phụ khoa",
      image: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
      id: "DR003",
      name: "TS. BS. Lê Văn C",
      specialty: "Nội tiết sinh sản",
      image: "https://randomuser.me/api/portraits/men/59.jpg"
    }
  ];

  const services: ServiceType[] = [
    {
      id: "SV001",
      name: "Thụ tinh trong tử cung (IUI)",
      description: "Quy trình điều trị hiếm muộn thông qua thụ tinh trong tử cung"
    },
    {
      id: "SV002",
      name: "Thụ tinh trong ống nghiệm (IVF)",
      description: "Quy trình điều trị hiếm muộn thông qua thụ tinh trong ống nghiệm"
    },
    {
      id: "SV003",
      name: "Bảo quản trứng",
      description: "Dịch vụ bảo quản trứng để sử dụng trong tương lai"
    }
  ];

  const treatments: TreatmentType[] = [
    {
      id: "TR001",
      type: "IUI",
      doctor: "TS. BS. Nguyễn Văn A",
      doctorId: "DR001",
      startDate: "15/01/2025",
      endDate: "20/03/2025",
      status: "completed"
    },
    {
      id: "TR002",
      type: "IVF",
      doctor: "PGS. TS. Trần Thị B",
      doctorId: "DR002",
      startDate: "10/04/2025",
      endDate: null,
      status: "in-progress"
    }
  ];

  // State for the current active tab
  const [activeTab, setActiveTab] = useState<"doctor" | "service">("doctor");

  // State for the selected doctor/service
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);

  // State for the rating and comment
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  // State for submission status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset form after submission
  const resetForm = () => {
    setSelectedDoctor(null);
    setSelectedService(null);
    setSelectedTreatment(null);
    setRating(0);
    setComment("");
    setIsAnonymous(false);
    setIsSuccess(false);
    setErrorMessage(null);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if ((activeTab === "doctor" && !selectedDoctor) || 
        (activeTab === "service" && !selectedService) || 
        rating === 0) {
      setErrorMessage("Vui lòng chọn đầy đủ thông tin và đánh giá");
      return;
    }

    // Simulate form submission
    setIsSubmitting(true);
    setErrorMessage(null);

    // Simulating API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // In a real app, you would send data to the server here
      console.log({
        type: activeTab,
        doctorId: selectedDoctor,
        serviceId: selectedService,
        treatmentId: selectedTreatment,
        rating,
        comment,
        isAnonymous
      });
    }, 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Đánh Giá & Phản Hồi</h1>
          <p className="text-gray-500 mt-2">
            Chia sẻ trải nghiệm của bạn để giúp chúng tôi cải thiện dịch vụ
          </p>
        </motion.div>

        {isSuccess ? (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Cảm ơn bạn đã gửi đánh giá!</h2>
            <p className="text-gray-500 mb-6">
              Phản hồi của bạn rất quan trọng đối với chúng tôi và sẽ giúp cải thiện dịch vụ.
            </p>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              Gửi đánh giá khác
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("doctor")}
                  className={`px-4 py-2 rounded-md font-medium ${
                    activeTab === "doctor"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <User className="inline-block w-4 h-4 mr-2" />
                  Đánh giá bác sĩ
                </button>
                <button
                  onClick={() => setActiveTab("service")}
                  className={`px-4 py-2 rounded-md font-medium ${
                    activeTab === "service"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <FileText className="inline-block w-4 h-4 mr-2" />
                  Đánh giá dịch vụ
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Doctor Selection (shown when doctor tab is active) */}
                {activeTab === "doctor" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn bác sĩ để đánh giá
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {doctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          onClick={() => setSelectedDoctor(doctor.id)}
                          className={`p-4 border rounded-lg cursor-pointer flex items-center ${
                            selectedDoctor === doctor.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                            <p className="text-sm text-gray-500">{doctor.specialty}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service Selection (shown when service tab is active) */}
                {activeTab === "service" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn dịch vụ để đánh giá
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => setSelectedService(service.id)}
                          className={`p-4 border rounded-lg cursor-pointer ${
                            selectedService === service.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <h3 className="font-medium text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Treatment Selection */}
                {selectedDoctor && activeTab === "doctor" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn quá trình điều trị (không bắt buộc)
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {treatments
                        .filter(t => t.doctorId === selectedDoctor)
                        .map((treatment) => (
                          <div
                            key={treatment.id}
                            onClick={() => setSelectedTreatment(treatment.id)}
                            className={`p-3 border rounded-lg cursor-pointer flex justify-between items-center ${
                              selectedTreatment === treatment.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium text-gray-900">{treatment.type}</span>
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                  treatment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  treatment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {treatment.status === 'completed' ? 'Hoàn thành' :
                                   treatment.status === 'in-progress' ? 'Đang điều trị' :
                                   'Đã hủy'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                <Calendar className="inline-block w-3 h-3 mr-1" />
                                {treatment.startDate} - {treatment.endDate || 'Hiện tại'}
                              </p>
                            </div>
                          </div>
                        ))}
                      {treatments.filter(t => t.doctorId === selectedDoctor).length === 0 && (
                        <p className="text-sm text-gray-500 italic">
                          Bạn chưa có quá trình điều trị nào với bác sĩ này
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Rating Stars */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đánh giá của bạn
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            rating >= star
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-500 self-end">
                      {rating > 0 ? `${rating} sao` : "Chưa đánh giá"}
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhận xét của bạn
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                    placeholder="Chia sẻ trải nghiệm của bạn..."
                  ></textarea>
                </div>

                {/* Anonymous Option */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                    Gửi đánh giá ẩn danh
                  </label>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start">
                    <X className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p>{errorMessage}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang gửi...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Send className="mr-2 h-4 w-4" />
                        Gửi đánh giá
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {/* Previous Feedback */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Các đánh giá trước đây của bạn</h2>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">TS. BS. Nguyễn Văn A</h3>
                    <p className="text-sm text-gray-500">Đánh giá vào 10/05/2025</p>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-gray-700">
                  Bác sĩ rất tận tâm và chuyên nghiệp. Tôi rất hài lòng với quá trình điều trị và kết quả đạt được.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">Thụ tinh trong ống nghiệm (IVF)</h3>
                    <p className="text-sm text-gray-500">Đánh giá vào 20/04/2025</p>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <Star className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
                <p className="mt-3 text-gray-700">
                  Dịch vụ tốt, nhân viên y tế thân thiện. Tuy nhiên, tôi nghĩ có thể cải thiện thêm về thời gian chờ đợi.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PatientFeedback;
