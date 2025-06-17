import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  FileText,
  Download,
  ChevronDown,
  ChevronRight,
  Search,
  CalendarDays,
  Check,
  AlertCircle,
  Clock,
  ArrowDownUp
} from "lucide-react";
import { Button } from "../../components/ui/button";

// Define types for payments
type PaymentStatus = "completed" | "pending" | "failed";

type InvoiceItem = {
  name: string;
  description: string;
  price: number;
  quantity: number;
};

type Payment = {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  serviceType: string;
  invoiceNumber: string;
  invoiceUrl?: string;
  items: InvoiceItem[];
};

const PatientPayments = () => {
  // Mock data for payments
  const paymentsData: Payment[] = [
    {
      id: "PAY001",
      date: "15/05/2025",
      amount: 15000000,
      method: "Thẻ tín dụng",
      status: "completed",
      serviceType: "Thụ tinh trong tử cung (IUI)",
      invoiceNumber: "INV20250515001",
      invoiceUrl: "#",
      items: [
        {
          name: "Thụ tinh trong tử cung (IUI)",
          description: "Quy trình điều trị IUI cơ bản",
          price: 12000000,
          quantity: 1
        },
        {
          name: "Tư vấn bác sĩ",
          description: "Tư vấn chuyên sâu với bác sĩ chuyên khoa",
          price: 1500000,
          quantity: 2
        }
      ]
    },
    {
      id: "PAY002",
      date: "10/06/2025",
      amount: 3500000,
      method: "Chuyển khoản ngân hàng",
      status: "completed",
      serviceType: "Xét nghiệm hormone",
      invoiceNumber: "INV20250610002",
      invoiceUrl: "#",
      items: [
        {
          name: "Xét nghiệm hormone",
          description: "Xét nghiệm hormone tổng quát",
          price: 3500000,
          quantity: 1
        }
      ]
    },
    {
      id: "PAY003",
      date: "17/06/2025",
      amount: 60000000,
      method: "Thẻ tín dụng",
      status: "pending",
      serviceType: "Thụ tinh trong ống nghiệm (IVF)",
      invoiceNumber: "INV20250617003",
      items: [
        {
          name: "Thụ tinh trong ống nghiệm (IVF)",
          description: "Quy trình điều trị IVF cơ bản",
          price: 60000000,
          quantity: 1
        }
      ]
    },
    {
      id: "PAY004",
      date: "05/03/2025",
      amount: 5000000,
      method: "Tiền mặt",
      status: "completed",
      serviceType: "Tư vấn di truyền",
      invoiceNumber: "INV20250305004",
      invoiceUrl: "#",
      items: [
        {
          name: "Tư vấn di truyền",
          description: "Tư vấn di truyền trước khi điều trị",
          price: 5000000,
          quantity: 1
        }
      ]
    },
    {
      id: "PAY005",
      date: "01/04/2025",
      amount: 7500000,
      method: "Chuyển khoản ngân hàng",
      status: "failed",
      serviceType: "Xét nghiệm nâng cao",
      invoiceNumber: "INV20250401005",
      items: [
        {
          name: "Xét nghiệm nâng cao",
          description: "Xét nghiệm di truyền và sinh hóa máu",
          price: 7500000,
          quantity: 1
        }
      ]
    }
  ];
  // State
  const [payments] = useState<Payment[]>(paymentsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
  const [dateSort, setDateSort] = useState<"asc" | "desc">("desc");
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);

  // Filter and sort payments
  const filteredPayments = payments
    .filter(payment => {
      const matchesSearch = 
        payment.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.method.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      
      return dateSort === "asc" 
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });

  // Toggle payment details
  const togglePaymentDetails = (paymentId: string) => {
    if (expandedPayment === paymentId) {
      setExpandedPayment(null);
    } else {
      setExpandedPayment(paymentId);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
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
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lịch Sử Thanh Toán</h1>
            <p className="text-gray-500">Quản lý và theo dõi tất cả các giao dịch của bạn</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Tìm kiếm và lọc</h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm theo dịch vụ, số hóa đơn, phương thức thanh toán..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | "all")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="completed">Đã thanh toán</option>
                    <option value="pending">Đang xử lý</option>
                    <option value="failed">Thất bại</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp</label>
                  <button
                    onClick={() => setDateSort(dateSort === "asc" ? "desc" : "asc")}
                    className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span>Ngày {dateSort === "asc" ? "tăng dần" : "giảm dần"}</span>
                    <ArrowDownUp className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payments List */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Lịch sử giao dịch</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã giao dịch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dịch vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phương thức
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <React.Fragment key={payment.id}>
                      <tr 
                        className={`hover:bg-gray-50 cursor-pointer ${expandedPayment === payment.id ? 'bg-blue-50' : ''}`}
                        onClick={() => togglePaymentDetails(payment.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
                            {payment.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.serviceType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              payment.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : payment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {payment.status === "completed" ? (
                              <Check className="mr-1 h-3 w-3" />
                            ) : payment.status === "pending" ? (
                              <Clock className="mr-1 h-3 w-3" />
                            ) : (
                              <AlertCircle className="mr-1 h-3 w-3" />
                            )}
                            {payment.status === "completed"
                              ? "Đã thanh toán"
                              : payment.status === "pending"
                              ? "Đang xử lý"
                              : "Thất bại"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center">
                            {payment.invoiceUrl && (
                              <Button
                                variant="ghost"
                                className="text-blue-600 hover:text-blue-800"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            {expandedPayment === payment.id ? (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </td>
                      </tr>
                      {expandedPayment === payment.id && (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 bg-gray-50">
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-medium text-gray-900 mb-2">Chi tiết hóa đơn #{payment.invoiceNumber}</h3>
                                <div className="bg-white p-4 rounded border border-gray-200">
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                      <thead>
                                        <tr>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Dịch vụ
                                          </th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Chi tiết
                                          </th>
                                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Đơn giá
                                          </th>
                                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            SL
                                          </th>
                                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thành tiền
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-200">
                                        {payment.items.map((item, index) => (
                                          <tr key={index}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                              {item.name}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-500">
                                              {item.description}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                                              {formatCurrency(item.price)}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                                              {item.quantity}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-right">
                                              {formatCurrency(item.price * item.quantity)}
                                            </td>
                                          </tr>
                                        ))}
                                        <tr className="bg-gray-50">
                                          <td colSpan={4} className="px-4 py-2 text-sm font-medium text-right">
                                            Tổng cộng:
                                          </td>
                                          <td className="px-4 py-2 text-sm font-bold text-right">
                                            {formatCurrency(payment.amount)}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <div className="flex space-x-2 text-sm">
                                  <span className="text-gray-500">Phương thức thanh toán:</span>
                                  <span className="font-medium">{payment.method}</span>
                                </div>
                                
                                {payment.invoiceUrl && (
                                  <Button className="bg-blue-600 hover:bg-blue-700">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Tải hóa đơn PDF
                                  </Button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      Không tìm thấy giao dịch nào phù hợp với điều kiện tìm kiếm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Payment Summary */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Tổng thanh toán</h3>
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(
                payments
                  .filter(p => p.status === "completed")
                  .reduce((sum, p) => sum + p.amount, 0)
              )}
            </p>
            <p className="text-sm text-gray-500 mt-1">Tổng số tiền đã thanh toán</p>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Giao dịch gần nhất</h3>
              <CalendarDays className="h-5 w-5 text-green-600" />
            </div>
            {payments.length > 0 ? (
              <>
                <p className="text-lg font-medium text-gray-900">
                  {payments[0].serviceType}
                </p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatCurrency(payments[0].amount)}
                </p>
                <p className="text-sm text-gray-500 mt-1">{payments[0].date}</p>
              </>
            ) : (
              <p className="text-gray-500">Không có giao dịch nào</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Đang chờ xử lý</h3>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(
                payments
                  .filter(p => p.status === "pending")
                  .reduce((sum, p) => sum + p.amount, 0)
              )}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {payments.filter(p => p.status === "pending").length} giao dịch đang xử lý
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PatientPayments;
