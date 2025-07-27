import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../../api/patientApi/paymentAPI';
import { motion } from 'framer-motion';

const paymentMethods = [
  { id: 'zalopay', label: 'Ví ZaloPay', icon: '/src/assets/images/logo-zalopay.svg' },
  { id: 'visa', label: 'Visa/Mastercard/JCB', icon: '/src/assets/images/gold.jpg' },
  { id: 'atm', label: 'Thẻ ATM', icon: '/src/assets/images/atm-card.gif' }, // (qua ZaloPay)
];

const banks = [
  { id: 'vietinbank', name: 'Vietinbank', icon: '/src/assets/images/bank-vtb.svg' },
  { id: 'agribank', name: 'Agribank', icon: '/src/assets/images/bank-varb.svg' },
  { id: 'vietcombank', name: 'Vietcombank', icon: '/src/assets/images/bank-vcb.svg' },
  { id: 'bidv', name: 'BIDV', icon: '/src/assets/images/bank-bidv.svg' },
  { id: 'dongabank', name: 'Đông Á Bank', icon: '/src/assets/images/bank-dab.svg' },
  { id: 'sacombank', name: 'Sacombank', icon: '/src/assets/images/bank-scb.svg' },
  { id: 'acb', name: 'ACB', icon: '/src/assets/images/bank-acb.svg' },
  { id: 'mbbank', name: 'MBBank', icon: '/src/assets/images/bank-mb.svg' },
  { id: 'techcombank', name: 'Techcombank', icon: '/src/assets/images/bank-tcb.svg' },
  { id: 'vpbank', name: 'VPBank', icon: '/src/assets/images/bank-vpb.svg' },
  { id: 'eximbank', name: 'Eximbank', icon: '/src/assets/images/bank-eib.svg' },
  { id: 'vib', name: 'VIB', icon: '/src/assets/images/bank-vib.svg' },
  { id: 'hdbank', name: 'HDBank', icon: '/src/assets/images/bank-hdb.svg' },
  { id: 'oceanbank', name: 'Oceanbank', icon: '/src/assets/images/bank-ojb.svg' },
  { id: 'shb', name: 'SHB', icon: '/src/assets/images/bank-shb.svg' },
  { id: 'msb', name: 'Maritime Bank', icon: '/src/assets/images/bank-msb.svg' },
  { id: 'seabank', name: 'SeABank', icon: '/src/assets/images/bank-seab.svg' },
  { id: 'abbank', name: 'ABBank', icon: '/src/assets/images/bank-abb.svg' },
  { id: 'tpbank', name: 'TPBank', icon: '/src/assets/images/bank-tpb.svg' },
  { id: 'sgcb', name: 'TMCP Sài Gòn', icon: '/src/assets/images/bank-sgcb.svg' },
  { id: 'lpb', name: 'Liên Việt Post Bank', icon: '/src/assets/images/bank-lpb.svg' },
  { id: 'saigonbank', name: 'SaigonBank', icon: '/src/assets/images/bank-sgb.svg' },
  { id: 'ocb', name: 'OCB', icon: '/src/assets/images/bank-ocb.svg' },
  { id: 'nambank', name: 'Nam Á Bank', icon: '/src/assets/images/bank-nab.svg' },
  { id: 'vietabank', name: 'Việt Á Bank', icon: '/src/assets/images/bank-vab.svg' },
  { id: 'baovietbank', name: 'Bảo Việt Bank', icon: '/src/assets/images/bank-bvb.svg' },
  { id: 'gpbank', name: 'GPBank', icon: '/src/assets/images/bank-gpb.svg' },
  { id: 'bacabank', name: 'Bắc Á Bank', icon: '/src/assets/images/bank-bab.svg' },
  { id: 'banviet', name: 'Ngân hàng Bản Việt', icon: '/src/assets/images/bank-vccb.svg' },
];

const PaymentPage: React.FC = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('zalopay');
  const [selectedBank, setSelectedBank] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await bookingService.getBookingDetails(bookingId!);
        setBooking(res);
      } catch (err) {
        alert('Không lấy được thông tin booking!');
        navigate('/patient/dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (bookingId) fetchBooking();
  }, [bookingId, navigate]);

  const handlePayment = async () => {
    if (!booking) return;
    setProcessing(true);
    try {
      // Lưu bookingId vào cookie để callback page xử lý tiếp
      document.cookie = `bookingId=${booking.bookingId}; path=/; max-age=1200`; // 20 phút
      document.cookie = `paymentMethod=${selectedMethod}; path=/; max-age=600`;

      if (selectedMethod === 'atm' && selectedBank) {
        document.cookie = `bankCode=${selectedBank}; path=/; max-age=600`;
      }

      const payload: any = {
        appUser: booking.patient?.name || 'guest',
        amount: booking.payment?.totalAmount || booking.service?.price || 0,
        description: `Thanh toán dịch vụ ${booking.service?.name || ''} cho bệnh nhân ${booking.patient?.name || ''}`,
      };
      if (selectedMethod === 'atm' && selectedBank) {
        payload.bank_code = selectedBank;
      }
      const result = await bookingService.createZaloPayOrder(payload);
      if (result && result.orderUrl) {
        window.location.href = result.orderUrl;
      } else {
        alert(result?.message || 'Không tạo được đơn hàng ZaloPay!');
      }
    } catch (err) {
      alert('Có lỗi khi tạo đơn thanh toán!');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm">
          Không tìm thấy booking!
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-300 pb-4">
          Thanh Toán Dịch Vụ
        </h1>
        <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin thanh toán</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center">
              <span className="w-1/3 font-medium text-gray-700">Bệnh nhân:</span>
              <span className="w-2/3 text-gray-900">{booking.patient?.name}</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 font-medium text-gray-700">Dịch vụ:</span>
              <span className="w-2/3 text-gray-900">{booking.service?.name}</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 font-medium text-gray-700">Bác sĩ:</span>
              <span className="w-2/3 text-gray-900">{booking.doctor?.doctorName}</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 font-medium text-gray-700">Số tiền cần thanh toán:</span>
              <span className="w-2/3 text-lg font-bold text-blue-600">
                {(booking.payment?.totalAmount || booking.service?.price || 0).toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
            Chọn phương thức thanh toán
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {paymentMethods.map((m) => (
              <motion.button
                key={m.id}
                type="button"
                className={`flex items-center p-4 border-2 rounded-lg transition-all duration-200 ${
                  selectedMethod === m.id
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
                onClick={() => setSelectedMethod(m.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img src={m.icon} alt={m.label} className="w-10 h-10 mr-3" />
                <span className="text-sm font-medium text-gray-800">{m.label}</span>
                {selectedMethod === m.id && (
                  <svg className="w-5 h-5 ml-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {selectedMethod === 'atm' && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
              Chọn ngân hàng
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {banks.map((bank) => (
                <motion.button
                  key={bank.id}
                  type="button"
                  className={`flex items-center p-4 border-2 rounded-lg transition-all duration-200 ${
                    selectedBank === bank.id
                      ? 'border-green-600 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                  onClick={() => setSelectedBank(bank.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img src={bank.icon} alt={bank.name} className="w-10 h-10 mr-3" />
                  <span className="text-sm font-medium text-gray-800">{bank.name}</span>
                  {selectedBank === bank.id && (
                    <svg className="w-5 h-5 ml-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <motion.button
          onClick={handlePayment}
          disabled={processing || (selectedMethod === 'atm' && !selectedBank)}
          className={`w-full py-3 rounded-lg font-semibold text-lg text-white ${
            processing || (selectedMethod === 'atm' && !selectedBank)
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
          } transition-all duration-200`}
          whileHover={{ scale: processing || (selectedMethod === 'atm' && !selectedBank) ? 1 : 1.02 }}
          whileTap={{ scale: processing || (selectedMethod === 'atm' && !selectedBank) ? 1 : 0.98 }}
        >
          {processing ? 'Đang chuyển hướng...' : 'Thanh toán ngay'}
        </motion.button>
      </motion.div>
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Vui lòng kiểm tra kỹ thông tin trước khi thanh toán. Nếu có thắc mắc, liên hệ tổng đài hỗ trợ.</p>
      </div>
    </div>
  );
};

export default PaymentPage;