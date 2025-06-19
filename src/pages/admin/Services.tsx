// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   FileText,
//   Search,
//   Filter,
//   Plus,
//   Edit,
//   Trash2,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   MoreHorizontal,
//   Check,
//   X,
//   Upload,
//   DollarSign,
//   Tag,
// } from "lucide-react";
// import { Button } from "../../components/ui/button";

// // Mock service data
// const servicesMockData = [
//   {
//     id: 1,
//     name: "Thụ tinh trong ống nghiệm (IVF)",
//     category: "Điều trị hiếm muộn",
//     description: "Thụ tinh ống nghiệm (IVF) là phương pháp điều trị hiếm muộn khi tinh trùng và trứng được kết hợp bên ngoài cơ thể trong môi trường phòng thí nghiệm.",
//     basePrice: "95.000.000",
//     discountPrice: "90.000.000",
//     success_rate: "65%",
//     duration: "2-3 tháng",
//     image: "https://example.com/ivf.jpg",
//     status: "active",
//     created_at: "15/01/2023",
//     updated_at: "10/03/2023"
//   },
//   {
//     id: 2,
//     name: "Thụ tinh trong tử cung (IUI)",
//     category: "Điều trị hiếm muộn",
//     description: "Thụ tinh trong tử cung (IUI) là phương pháp đưa tinh trùng đã được xử lý trực tiếp vào tử cung của người phụ nữ.",
//     basePrice: "12.000.000",
//     discountPrice: null,
//     success_rate: "25%",
//     duration: "1 tháng",
//     image: "https://example.com/iui.jpg",
//     status: "active",
//     created_at: "15/01/2023",
//     updated_at: "10/03/2023"
//   },
//   {
//     id: 3,
//     name: "Tư vấn điều trị hiếm muộn",
//     category: "Tư vấn",
//     description: "Dịch vụ tư vấn ban đầu cho các cặp vợ chồng về các vấn đề liên quan đến hiếm muộn và các phương pháp điều trị.",
//     basePrice: "500.000",
//     discountPrice: null,
//     success_rate: "N/A",
//     duration: "1 buổi",
//     image: "https://example.com/consultation.jpg",
//     status: "active",
//     created_at: "15/01/2023",
//     updated_at: "10/03/2023"
//   },
//   {
//     id: 4,
//     name: "Tiêm tinh trùng vào bào tương trứng (ICSI)",
//     category: "Điều trị hiếm muộn",
//     description: "ICSI là kỹ thuật vi phẫu tiên tiến, tiêm trực tiếp một tinh trùng vào bào tương trứng để thụ tinh.",
//     basePrice: "105.000.000",
//     discountPrice: "100.000.000",
//     success_rate: "70%",
//     duration: "2-3 tháng",
//     image: "https://example.com/icsi.jpg",
//     status: "active",
//     created_at: "20/02/2023",
//     updated_at: "15/04/2023"
//   },
//   {
//     id: 5,
//     name: "Chẩn đoán di truyền tiền làm tổ (PGT)",
//     category: "Xét nghiệm",
//     description: "PGT là phương pháp kiểm tra các phôi có được từ quá trình thụ tinh trong ống nghiệm để xác định các bất thường di truyền trước khi chuyển vào tử cung.",
//     basePrice: "35.000.000",
//     discountPrice: null,
//     success_rate: "N/A",
//     duration: "2 tuần",
//     image: "https://example.com/pgt.jpg",
//     status: "active",
//     created_at: "10/03/2023",
//     updated_at: "05/05/2023"
//   },
//   {
//     id: 6,
//     name: "Trữ đông tinh trùng",
//     category: "Bảo quản",
//     description: "Dịch vụ bảo quản tinh trùng trong nitơ lỏng ở nhiệt độ -196°C để sử dụng trong tương lai.",
//     basePrice: "5.000.000",
//     discountPrice: null,
//     success_rate: "N/A",
//     duration: "1 năm",
//     image: "https://example.com/sperm-freezing.jpg",
//     status: "active",
//     created_at: "05/04/2023",
//     updated_at: "25/05/2023"
//   },
//   {
//     id: 7,
//     name: "Trữ đông trứng",
//     category: "Bảo quản",
//     description: "Dịch vụ bảo quản trứng trong nitơ lỏng ở nhiệt độ -196°C để sử dụng trong tương lai.",
//     basePrice: "25.000.000",
//     discountPrice: null,
//     success_rate: "N/A",
//     duration: "1 năm",
//     image: "https://example.com/egg-freezing.jpg",
//     status: "active",
//     created_at: "10/04/2023",
//     updated_at: "30/05/2023"
//   },
//   {
//     id: 8,
//     name: "Xét nghiệm nội tiết",
//     category: "Xét nghiệm",
//     description: "Kiểm tra các chỉ số nội tiết tố quan trọng liên quan đến khả năng sinh sản.",
//     basePrice: "1.500.000",
//     discountPrice: null,
//     success_rate: "N/A",
//     duration: "1-2 ngày",
//     image: "https://example.com/hormonal-test.jpg",
//     status: "active",
//     created_at: "15/05/2023",
//     updated_at: "20/06/2023"
//   }
// ];

// // Mock categories
// const serviceCategories = [
//   "Tất cả",
//   "Điều trị hiếm muộn",
//   "Tư vấn",
//   "Xét nghiệm",
//   "Bảo quản"
// ];

// const AdminServices = () => {
//   const [loading, setLoading] = useState(true);
//   const [services, setServices] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("Tất cả");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [currentService, setCurrentService] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   useEffect(() => {
//     // Simulate API call
//     setTimeout(() => {
//       setServices(servicesMockData);
//       setLoading(false);
//     }, 500);
//   }, []);

//   // Filter services based on search term and category
//   const filteredServices = services.filter(service => {
//     const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesCategory = selectedCategory === "Tất cả" || service.category === selectedCategory;
    
//     return matchesSearch && matchesCategory;
//   });

//   // Pagination
//   const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
//   const paginatedServices = filteredServices.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Handlers
//   const handleCategoryChange = (category) => {
//     setSelectedCategory(category);
//     setCurrentPage(1); // Reset to first page when changing category
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1); // Reset to first page when searching
//   };

//   const handleAddService = () => {
//     setShowAddModal(true);
//   };

//   const handleEditService = (service) => {
//     setCurrentService(service);
//     setShowEditModal(true);
//   };

//   const handleDeleteService = (service) => {
//     setCurrentService(service);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = () => {
//     // In a real app, you would call an API to delete the service
//     setServices(services.filter(service => service.id !== currentService.id));
//     setShowDeleteModal(false);
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="py-20 flex justify-center items-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Quản lý dịch vụ</h1>
//             <p className="mt-1 text-gray-600">
//               Quản lý và cập nhật các dịch vụ của phòng khám
//             </p>
//           </div>
//           <div className="mt-4 md:mt-0">
//             <Button 
//               onClick={handleAddService}
//               className="flex items-center bg-blue-600 hover:bg-blue-700"
//             >
//               <Plus className="mr-1 h-5 w-5" />
//               Thêm dịch vụ mới
//             </Button>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//           className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
//         >
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-grow">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Tìm kiếm dịch vụ..."
//                 className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//               />
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {serviceCategories.map(category => (
//                 <button
//                   key={category}
//                   onClick={() => handleCategoryChange(category)}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium ${
//                     selectedCategory === category
//                       ? 'bg-blue-100 text-blue-600'
//                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                   }`}
//                 >
//                   {category}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </motion.div>

//         {/* Services Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {paginatedServices.map((service) => (
//             <motion.div
//               key={service.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
//             >
//               <div className="h-40 w-full bg-gray-200 relative overflow-hidden">
//                 <div className="absolute top-0 right-0 p-2">
//                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                     service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                   }`}>
//                     {service.status === 'active' ? 'Đang hoạt động' : 'Tạm ngưng'}
//                   </span>
//                 </div>
//                 <img 
//                   src="https://via.placeholder.com/400x200" // Using placeholder for demo
//                   alt={service.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="p-6">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="text-lg font-bold text-gray-900 mb-1">{service.name}</h3>
//                     <p className="text-sm text-gray-500 mb-2">{service.category}</p>
//                   </div>
//                   <div className="flex">
//                     <button 
//                       onClick={() => handleEditService(service)}
//                       className="p-1 text-gray-500 hover:text-blue-600"
//                     >
//                       <Edit className="h-5 w-5" />
//                     </button>
//                     <button 
//                       onClick={() => handleDeleteService(service)}
//                       className="p-1 text-gray-500 hover:text-red-600"
//                     >
//                       <Trash2 className="h-5 w-5" />
//                     </button>
//                   </div>
//                 </div>
//                 <p className="text-sm text-gray-600 line-clamp-2 mb-4">{service.description}</p>
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="text-sm text-gray-500">Giá cơ bản</p>
//                     <div className="flex items-center">
//                       <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
//                       <p className="text-lg font-semibold text-gray-900">
//                         {service.discountPrice ? (
//                           <>
//                             <span className="text-red-600">{service.discountPrice} đ</span>
//                             <span className="text-sm text-gray-500 line-through ml-2">{service.basePrice} đ</span>
//                           </>
//                         ) : (
//                           <span>{service.basePrice} đ</span>
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm text-gray-500">Tỷ lệ thành công</p>
//                     <p className="text-lg font-semibold text-gray-900">
//                       {service.success_rate !== "N/A" ? service.success_rate : "---"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center mt-8">
//             <nav className="flex items-center">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="p-2 rounded-md text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <ChevronLeft className="h-5 w-5" />
//               </button>
              
//               {[...Array(totalPages)].map((_, i) => (
//                 <button
//                   key={i + 1}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={`w-10 h-10 mx-1 rounded-md ${
//                     currentPage === i + 1 
//                       ? 'bg-blue-600 text-white' 
//                       : 'text-gray-500 hover:bg-gray-100'
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
              
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//                 className="p-2 rounded-md text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <ChevronRight className="h-5 w-5" />
//               </button>
//             </nav>
//           </div>
//         )}

//         {/* Add Service Modal */}
//         {showAddModal && (
//           <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//             <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-bold text-gray-900">Thêm dịch vụ mới</h3>
//                   <button 
//                     onClick={() => setShowAddModal(false)}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     <X className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <form className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Tên dịch vụ</label>
//                       <input 
//                         type="text" 
//                         className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                         placeholder="Nhập tên dịch vụ"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
//                       <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent">
//                         <option value="">Chọn danh mục</option>
//                         {serviceCategories.filter(c => c !== "Tất cả").map(category => (
//                           <option key={category} value={category}>{category}</option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả dịch vụ</label>
//                       <textarea 
//                         rows={4}
//                         className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                         placeholder="Nhập mô tả chi tiết về dịch vụ"
//                       ></textarea>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Giá cơ bản (VNĐ)</label>
//                       <input 
//                         type="text" 
//                         className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                         placeholder="Ví dụ: 1.000.000"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Giá khuyến mãi (VNĐ)</label>
//                       <input 
//                         type="text" 
//                         className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                         placeholder="Để trống nếu không có khuyến mãi"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Tỷ lệ thành công</label>
//                       <input 
//                         type="text" 
//                         className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                         placeholder="Ví dụ: 65%"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian điều trị</label>
//                       <input 
//                         type="text" 
//                         className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                         placeholder="Ví dụ: 2-3 tháng"
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh dịch vụ</label>
//                       <div className="flex items-center justify-center w-full">
//                         <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <Upload className="w-10 h-10 mb-3 text-gray-400" />
//                             <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Nhấp để tải lên</span> hoặc kéo và thả</p>
//                             <p className="text-xs text-gray-500">PNG, JPG hoặc JPEG (Tối đa 2MB)</p>
//                           </div>
//                           <input type="file" className="hidden" />
//                         </label>
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
//                       <div className="flex items-center space-x-6">
//                         <div className="flex items-center">
//                           <input 
//                             type="radio" 
//                             id="active-status" 
//                             name="status" 
//                             value="active"
//                             className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
//                             defaultChecked
//                           />
//                           <label htmlFor="active-status" className="ml-2 text-sm font-medium text-gray-700">Hoạt động</label>
//                         </div>
//                         <div className="flex items-center">
//                           <input 
//                             type="radio" 
//                             id="inactive-status" 
//                             name="status" 
//                             value="inactive"
//                             className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
//                           />
//                           <label htmlFor="inactive-status" className="ml-2 text-sm font-medium text-gray-700">Tạm ngưng</label>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//               <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
//                 <Button 
//                   variant="outline" 
//                   onClick={() => setShowAddModal(false)}
//                 >
//                   Hủy
//                 </Button>
//                 <Button 
//                   onClick={() => {
//                     // In a real app, you would submit the form data to your API
//                     // and add the new service to the list
//                     setShowAddModal(false);
//                   }}
//                 >
//                   Thêm dịch vụ
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Edit Service Modal */}
//         {showEditModal && currentService && (
//           <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//             <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa dịch vụ</h3>
//                   <button 
//                     onClick={() => setShowEditModal(false)}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     <X className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <form className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Tên dịch vụ</label>
//                       <input 
//                         type="text" 
//                         className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                         defaultValue={currentService.name}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
//                       <select 
//                         className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                         defaultValue={currentService.category}
//                       >
//                         {serviceCategories.filter(c => c !== "Tất cả").map(category => (
//                           <option key={category} value={category}>{category}</option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả dịch vụ</label>
//                       <textarea 
//                         rows={4}
//                         className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                         defaultValue={currentService.description}
//                       ></textarea>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Giá cơ bản (VNĐ)</label>
//                       <input 
//                         type="text" 
//                         className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                         defaultValue={currentService.basePrice}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Giá khuyến mãi (VNĐ)</label>
//                       <input 
//                         type="text" 
//                         className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                         defaultValue={currentService.discountPrice || ''}
//                         placeholder="Để trống nếu không có khuyến mãi"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Tỷ lệ thành công</label>
//                       <input 
//                         type="text" 
//                         className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                         defaultValue={currentService.success_rate}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian điều trị</label>
//                       <input 
//                         type="text" 
//                         className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
//                         defaultValue={currentService.duration}
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh dịch vụ</label>
//                       <div className="flex items-center justify-center w-full">
//                         <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <Upload className="w-10 h-10 mb-3 text-gray-400" />
//                             <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Nhấp để tải lên</span> hoặc kéo và thả</p>
//                             <p className="text-xs text-gray-500">PNG, JPG hoặc JPEG (Tối đa 2MB)</p>
//                           </div>
//                           <input type="file" className="hidden" />
//                         </label>
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
//                       <div className="flex items-center space-x-6">
//                         <div className="flex items-center">
//                           <input 
//                             type="radio" 
//                             id="edit-active-status" 
//                             name="edit-status" 
//                             value="active"
//                             className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
//                             defaultChecked={currentService.status === 'active'}
//                           />
//                           <label htmlFor="edit-active-status" className="ml-2 text-sm font-medium text-gray-700">Hoạt động</label>
//                         </div>
//                         <div className="flex items-center">
//                           <input 
//                             type="radio" 
//                             id="edit-inactive-status" 
//                             name="edit-status" 
//                             value="inactive"
//                             className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-600"
//                             defaultChecked={currentService.status !== 'active'}
//                           />
//                           <label htmlFor="edit-inactive-status" className="ml-2 text-sm font-medium text-gray-700">Tạm ngưng</label>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//               <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
//                 <Button 
//                   variant="outline" 
//                   onClick={() => setShowEditModal(false)}
//                 >
//                   Hủy
//                 </Button>
//                 <Button 
//                   onClick={() => {
//                     // In a real app, you would submit the form data to your API
//                     // and update the service in the list
//                     setShowEditModal(false);
//                   }}
//                 >
//                   Lưu thay đổi
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Delete Confirmation Modal */}
//         {showDeleteModal && currentService && (
//           <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//             <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
//               <div className="p-6">
//                 <h3 className="text-xl font-bold text-gray-900 mb-4">Xác nhận xóa</h3>
//                 <p className="text-gray-600 mb-6">
//                   Bạn có chắc chắn muốn xóa dịch vụ "{currentService.name}"? Hành động này không thể hoàn tác.
//                 </p>
//                 <div className="flex justify-end space-x-3">
//                   <Button 
//                     variant="outline" 
//                     onClick={() => setShowDeleteModal(false)}
//                   >
//                     Hủy
//                   </Button>
//                   <Button 
//                     variant="destructive"
//                     onClick={confirmDelete}
//                   >
//                     Xác nhận xóa
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminServices;
