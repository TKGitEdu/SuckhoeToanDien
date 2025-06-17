import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  ChevronDown,
  Filter,
  MessageSquare,
  Download,
  User,
  X,
  Trash2,
  Reply,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Button } from "../../components/ui/button";

// Mock data for feedback
const feedbacksMockData = [
  {
    id: 1,
    patientName: "Nguyễn Thị A",
    patientId: "PT10234",
    patientEmail: "nguyenthia@gmail.com",
    doctorName: "TS. BS. Nguyễn Văn A",
    rating: 5,
    comment: "Tôi rất hài lòng với quá trình điều trị, bác sĩ tận tình và chu đáo. Đội ngũ y tá và nhân viên cũng rất nhiệt tình hỗ trợ. Cảm ơn phòng khám rất nhiều.",
    serviceType: "Thụ tinh trong ống nghiệm (IVF)",
    date: "15/06/2023",
    status: "published",
    hasResponse: true,
    response: "Cảm ơn chị đã tin tưởng và lựa chọn phòng khám của chúng tôi. Chúng tôi rất vui khi biết chị hài lòng với dịch vụ. Chúc chị và gia đình mạnh khỏe!"
  },
  {
    id: 2,
    patientName: "Trần Văn B",
    patientId: "PT10245",
    patientEmail: "tranvanb@gmail.com",
    doctorName: "BS. CKI. Phạm Thị D",
    rating: 4,
    comment: "Dịch vụ tốt, tuy nhiên thời gian chờ đợi hơi lâu. Bác sĩ rất chuyên nghiệp và giải thích rõ ràng về quy trình điều trị.",
    serviceType: "Tư vấn ban đầu",
    date: "12/06/2023",
    status: "published",
    hasResponse: false,
    response: null
  },
  {
    id: 3,
    patientName: "Lê Thị C",
    patientId: "PT10267",
    patientEmail: "lethic@gmail.com",
    doctorName: "TS. BS. Nguyễn Văn A",
    rating: 5,
    comment: "Phòng khám có cơ sở vật chất hiện đại, sạch sẽ. Bác sĩ và nhân viên rất chuyên nghiệp, tận tâm. Tôi đã thành công sau 2 lần thử IUI. Cảm ơn rất nhiều!",
    serviceType: "Thụ tinh trong tử cung (IUI)",
    date: "10/06/2023",
    status: "published",
    hasResponse: true,
    response: "Cảm ơn chị đã chia sẻ trải nghiệm tốt đẹp. Chúng tôi rất vui mừng khi biết chị đã đạt được kết quả mong muốn. Chúc gia đình chị luôn hạnh phúc và mạnh khỏe!"
  },
  {
    id: 4,
    patientName: "Hoàng Thị E",
    patientId: "PT10302",
    patientEmail: "hoangthie@gmail.com",
    doctorName: "PGS. TS. Trần Văn B",
    rating: 5,
    comment: "Tôi rất biết ơn đội ngũ y bác sĩ tại phòng khám. Sau nhiều năm chờ đợi, cuối cùng tôi đã thành công với IVF. Bác sĩ Trần Văn B thực sự rất giỏi và tận tâm.",
    serviceType: "Thụ tinh trong ống nghiệm (IVF)",
    date: "05/06/2023",
    status: "published",
    hasResponse: true,
    response: "Cảm ơn chị đã tin tưởng chúng tôi. Đây là niềm vui và động lực rất lớn cho toàn bộ đội ngũ phòng khám. Chúc gia đình chị luôn khỏe mạnh và hạnh phúc!"
  },
  {
    id: 5,
    patientName: "Vũ Văn F",
    patientId: "PT10315",
    patientEmail: "vuvanf@gmail.com",
    doctorName: "TS. BS. Lê Thị C",
    rating: 4,
    comment: "Bác sĩ rất nhiệt tình và giỏi chuyên môn. Tuy nhiên, thủ tục hành chính hơi phức tạp và mất nhiều thời gian.",
    serviceType: "Tiêm tinh trùng vào bào tương trứng (ICSI)",
    date: "02/06/2023",
    status: "published",
    hasResponse: true,
    response: "Cảm ơn anh đã góp ý. Chúng tôi ghi nhận phản hồi và sẽ cải thiện quy trình thủ tục hành chính để phục vụ khách hàng tốt hơn. Mong anh thông cảm và tiếp tục ủng hộ phòng khám."
  },
  {
    id: 6,
    patientName: "Phạm Thị G",
    patientId: "PT10334",
    patientEmail: "phamthig@gmail.com",
    doctorName: "BS. CKI. Hoàng Văn E",
    rating: 3,
    comment: "Bác sĩ tư vấn khá tốt, nhưng chi phí điều trị cao hơn so với mức đã được báo giá ban đầu. Cần minh bạch hơn về chi phí.",
    serviceType: "Thụ tinh trong tử cung (IUI)",
    date: "28/05/2023",
    status: "pending",
    hasResponse: false,
    response: null
  },
  {
    id: 7,
    patientName: "Đặng Văn H",
    patientId: "PT10356",
    patientEmail: "dangvanh@gmail.com",
    doctorName: "TS. BS. Nguyễn Văn A",
    rating: 2,
    comment: "Tôi không hài lòng với cách phòng khám xử lý vấn đề của tôi. Tôi đã phải chờ đợi quá lâu và cảm thấy không được tôn trọng.",
    serviceType: "Thụ tinh trong ống nghiệm (IVF)",
    date: "25/05/2023",
    status: "hidden",
    hasResponse: false,
    response: null
  },
  {
    id: 8,
    patientName: "Ngô Thị I",
    patientId: "PT10378",
    patientEmail: "ngothii@gmail.com",
    doctorName: "TS. BS. Vũ Thị F",
    rating: 5,
    comment: "Tôi đã tham khảo nhiều nơi và quyết định chọn phòng khám này. Đây là quyết định đúng đắn. Bác sĩ Vũ Thị F rất chuyên nghiệp và tận tâm, luôn lắng nghe và giải đáp mọi thắc mắc của tôi.",
    serviceType: "Tiêm tinh trùng vào bào tương trứng (ICSI)",
    date: "20/05/2023",
    status: "published",
    hasResponse: false,
    response: null
  }
];

// Status options
const statusOptions = [
  "Tất cả",
  "Đã xuất bản",
  "Đang chờ duyệt",
  "Đã ẩn"
];

// Rating options
const ratingOptions = [
  "Tất cả",
  "5 sao",
  "4 sao",
  "3 sao",
  "2 sao",
  "1 sao"
];

// Service type options
const serviceTypes = [
  "Tất cả",
  "Tư vấn ban đầu",
  "Thụ tinh trong tử cung (IUI)",
  "Thụ tinh trong ống nghiệm (IVF)",
  "Tiêm tinh trùng vào bào tương trứng (ICSI)"
];

const AdminFeedbacks = () => {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [selectedRating, setSelectedRating] = useState("Tất cả");
  const [selectedServiceType, setSelectedServiceType] = useState("Tất cả");
  const [showFilters, setShowFilters] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<any>(null);
  const [responseText, setResponseText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFeedbacks(feedbacksMockData);
      setLoading(false);
    }, 500);
  }, []);

  // Filter feedbacks based on search term, status, rating and service type
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = 
      feedback.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === "Tất cả" || 
      (selectedStatus === "Đã xuất bản" && feedback.status === "published") ||
      (selectedStatus === "Đang chờ duyệt" && feedback.status === "pending") ||
      (selectedStatus === "Đã ẩn" && feedback.status === "hidden");
    
    const matchesRating = 
      selectedRating === "Tất cả" || 
      (selectedRating === "5 sao" && feedback.rating === 5) ||
      (selectedRating === "4 sao" && feedback.rating === 4) ||
      (selectedRating === "3 sao" && feedback.rating === 3) ||
      (selectedRating === "2 sao" && feedback.rating === 2) ||
      (selectedRating === "1 sao" && feedback.rating === 1);
    
    const matchesServiceType = selectedServiceType === "Tất cả" || feedback.serviceType === selectedServiceType;
    
    return matchesSearch && matchesStatus && matchesRating && matchesServiceType;
  });

  // Sort feedbacks by date (newest first)
  const sortedFeedbacks = [...filteredFeedbacks].sort((a, b) => {
    const dateA = new Date(a.date.split('/').reverse().join('-'));
    const dateB = new Date(b.date.split('/').reverse().join('-'));
    return dateB.getTime() - dateA.getTime();
  });

  // Pagination
  const totalPages = Math.ceil(sortedFeedbacks.length / itemsPerPage);
  const paginatedFeedbacks = sortedFeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleRatingChange = (rating: string) => {
    setSelectedRating(rating);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleServiceTypeChange = (type: string) => {
    setSelectedServiceType(type);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRespondToFeedback = (feedback: any) => {
    setCurrentFeedback(feedback);
    setResponseText(feedback.response || "");
    setShowResponseModal(true);
  };

  const handleDeleteFeedback = (feedback: any) => {
    setCurrentFeedback(feedback);
    setShowDeleteModal(true);
  };

  const handleStatusChange2 = (feedback: any, newStatus: string) => {
    // In a real app, you would call an API to update the feedback status
    const updatedFeedbacks = feedbacks.map(f => 
      f.id === feedback.id ? { ...f, status: newStatus } : f
    );
    setFeedbacks(updatedFeedbacks);
  };

  const confirmResponse = () => {
    if (currentFeedback) {
      // In a real app, you would call an API to update the response
      const updatedFeedbacks = feedbacks.map(feedback => 
        feedback.id === currentFeedback.id 
          ? { ...feedback, response: responseText, hasResponse: true } 
          : feedback
      );
      setFeedbacks(updatedFeedbacks);
      setShowResponseModal(false);
    }
  };

  const confirmDelete = () => {
    // In a real app, you would call an API to delete the feedback
    if (currentFeedback) {
      setFeedbacks(feedbacks.filter(feedback => feedback.id !== currentFeedback.id));
      setShowDeleteModal(false);
    }
  };

  // Calculate stats
  const feedbackStats = {
    total: feedbacks.length,
    published: feedbacks.filter(f => f.status === "published").length,
    pending: feedbacks.filter(f => f.status === "pending").length,
    hidden: feedbacks.filter(f => f.status === "hidden").length,
    avgRating: feedbacks.length ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1) : 0,
    fiveStar: feedbacks.filter(f => f.rating === 5).length,
    fourStar: feedbacks.filter(f => f.rating === 4).length,
    threeStar: feedbacks.filter(f => f.rating === 3).length,
    twoStar: feedbacks.filter(f => f.rating === 2).length,
    oneStar: feedbacks.filter(f => f.rating === 1).length
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý đánh giá & phản hồi</h1>
            <p className="mt-1 text-gray-600">
              Xem và phản hồi các đánh giá từ khách hàng
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="mr-1 h-5 w-5" />
              Bộ lọc
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              className="flex items-center"
            >
              <Download className="mr-1 h-5 w-5" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng số đánh giá</p>
                <p className="text-2xl font-bold text-gray-900">{feedbackStats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Đánh giá trung bình</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-900 mr-2">{feedbackStats.avgRating}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.round(Number(feedbackStats.avgRating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Đã xuất bản</p>
                <p className="text-2xl font-bold text-gray-900">{feedbackStats.published}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((feedbackStats.published / feedbackStats.total) * 100)}% tổng số đánh giá
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <ThumbsUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Chờ xử lý</p>
                <p className="text-2xl font-bold text-gray-900">{feedbackStats.pending}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((feedbackStats.pending / feedbackStats.total) * 100)}% tổng số đánh giá
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <div className="relative flex-grow mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm đánh giá theo tên, ID, bác sĩ hoặc nội dung..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                  value={selectedRating}
                  onChange={(e) => handleRatingChange(e.target.value)}
                >
                  {ratingOptions.map(rating => (
                    <option key={rating} value={rating}>{rating}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loại dịch vụ</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                  value={selectedServiceType}
                  onChange={(e) => handleServiceTypeChange(e.target.value)}
                >
                  {serviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </motion.div>

        {/* Rating Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Phân bố đánh giá</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-16 text-sm text-gray-600 flex items-center">
                <span>5</span>
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 ml-1" />
              </div>
              <div className="flex-grow mx-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-400 h-2.5 rounded-full" 
                    style={{ width: `${(feedbackStats.fiveStar / feedbackStats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm font-medium text-gray-900 text-right">
                {feedbackStats.fiveStar} ({Math.round((feedbackStats.fiveStar / feedbackStats.total) * 100)}%)
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-16 text-sm text-gray-600 flex items-center">
                <span>4</span>
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 ml-1" />
              </div>
              <div className="flex-grow mx-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-400 h-2.5 rounded-full" 
                    style={{ width: `${(feedbackStats.fourStar / feedbackStats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm font-medium text-gray-900 text-right">
                {feedbackStats.fourStar} ({Math.round((feedbackStats.fourStar / feedbackStats.total) * 100)}%)
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-16 text-sm text-gray-600 flex items-center">
                <span>3</span>
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 ml-1" />
              </div>
              <div className="flex-grow mx-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-400 h-2.5 rounded-full" 
                    style={{ width: `${(feedbackStats.threeStar / feedbackStats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm font-medium text-gray-900 text-right">
                {feedbackStats.threeStar} ({Math.round((feedbackStats.threeStar / feedbackStats.total) * 100)}%)
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-16 text-sm text-gray-600 flex items-center">
                <span>2</span>
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 ml-1" />
              </div>
              <div className="flex-grow mx-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-400 h-2.5 rounded-full" 
                    style={{ width: `${(feedbackStats.twoStar / feedbackStats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm font-medium text-gray-900 text-right">
                {feedbackStats.twoStar} ({Math.round((feedbackStats.twoStar / feedbackStats.total) * 100)}%)
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-16 text-sm text-gray-600 flex items-center">
                <span>1</span>
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 ml-1" />
              </div>
              <div className="flex-grow mx-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-400 h-2.5 rounded-full" 
                    style={{ width: `${(feedbackStats.oneStar / feedbackStats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm font-medium text-gray-900 text-right">
                {feedbackStats.oneStar} ({Math.round((feedbackStats.oneStar / feedbackStats.total) * 100)}%)
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feedbacks List */}
        <div className="space-y-6 mb-8">
          {paginatedFeedbacks.map((feedback) => (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{feedback.patientName}</h3>
                      <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1">
                        <span>ID: {feedback.patientId}</span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {feedback.patientEmail}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0 flex items-center">
                    <div className="flex mr-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < feedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      feedback.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : feedback.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {feedback.status === 'published' 
                        ? 'Đã xuất bản' 
                        : feedback.status === 'pending'
                        ? 'Đang chờ duyệt'
                        : 'Đã ẩn'}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{feedback.date}</span>
                    <span className="mx-2">•</span>
                    <span>Dịch vụ: {feedback.serviceType}</span>
                    <span className="mx-2">•</span>
                    <span>Bác sĩ: {feedback.doctorName}</span>
                  </div>
                  <p className="text-gray-700">{feedback.comment}</p>
                </div>
                
                {feedback.hasResponse && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex items-start">
                      <Reply className="h-4 w-4 text-blue-600 mr-2 mt-1 transform rotate-180" />
                      <div>
                        <p className="text-sm font-medium text-blue-600 mb-1">Phản hồi từ phòng khám</p>
                        <p className="text-sm text-gray-700">{feedback.response}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {feedback.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => handleStatusChange2(feedback, 'published')}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Xuất bản
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center text-gray-600 border-gray-200 hover:bg-gray-50"
                          onClick={() => handleStatusChange2(feedback, 'hidden')}
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Ẩn
                        </Button>
                      </>
                    )}
                    {feedback.status === 'published' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center text-gray-600 border-gray-200 hover:bg-gray-50"
                        onClick={() => handleStatusChange2(feedback, 'hidden')}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Ẩn
                      </Button>
                    )}
                    {feedback.status === 'hidden' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => handleStatusChange2(feedback, 'published')}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Xuất bản
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => handleRespondToFeedback(feedback)}
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      {feedback.hasResponse ? 'Sửa phản hồi' : 'Phản hồi'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDeleteFeedback(feedback)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {paginatedFeedbacks.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Không tìm thấy đánh giá</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Không có đánh giá nào phù hợp với điều kiện tìm kiếm của bạn. Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 mx-1 rounded-md ${
                    currentPage === i + 1 
                      ? 'bg-yellow-500 text-white' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        )}

        {/* Response Modal */}
        {showResponseModal && currentFeedback && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Phản hồi đánh giá</h3>
                  <button 
                    onClick={() => setShowResponseModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Đánh giá từ khách hàng</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < currentFeedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-700">từ {currentFeedback.patientName}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{currentFeedback.comment}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phản hồi của bạn</label>
                  <textarea
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                    placeholder="Nhập phản hồi của bạn đối với đánh giá này..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="text-sm text-gray-500 mb-6">
                  <p>Lưu ý:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Phản hồi sẽ được hiển thị công khai dưới đánh giá của khách hàng.</li>
                    <li>Hãy giữ giọng điệu chuyên nghiệp và lịch sự.</li>
                    <li>Cảm ơn khách hàng đã dành thời gian đánh giá và đóng góp ý kiến.</li>
                  </ul>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowResponseModal(false)}
                >
                  Hủy
                </Button>
                <Button 
                  className="bg-yellow-500 hover:bg-yellow-600"
                  onClick={confirmResponse}
                  disabled={!responseText.trim()}
                >
                  {currentFeedback.hasResponse ? 'Cập nhật phản hồi' : 'Gửi phản hồi'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && currentFeedback && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Xác nhận xóa</h3>
                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn xóa đánh giá này từ "{currentFeedback.patientName}"? Hành động này không thể hoàn tác.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Hủy
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={confirmDelete}
                  >
                    Xác nhận xóa
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedbacks;
