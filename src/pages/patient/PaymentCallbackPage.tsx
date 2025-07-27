import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../api/patientApi/paymentAPI';
import type { Booking } from '../../api/patientApi/paymentAPI';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const paymentMethods = [
  { id: 'zalopay', label: 'Ví ZaloPay', icon: '/src/assets/images/logo-zalopay.svg' },
  { id: 'visa', label: 'Visa/Mastercard/JCB', icon: '/src/assets/images/gold.jpg' },
  { id: 'atm', label: 'Thẻ ATM', icon: '/src/assets/images/atm-card.gif' },
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

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

const PaymentCallbackPage: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const amount = searchParams.get('amount');
  const apptransid = searchParams.get('apptransid');
  const status = searchParams.get('status');
  const discountamount = searchParams.get('discountamount');
  const methodFromCookie = getCookie('paymentMethod');
  const bankcodeFromCookie = getCookie('bankCode');
  const bankcode = bankcodeFromCookie || searchParams.get('bankcode');
  const pmcid = searchParams.get('pmcid');
  const paymentMethod = methodFromCookie || (pmcid === '38' ? 'zalopay' : pmcid);

  const methodObj = paymentMethods.find(m => m.id === paymentMethod);
  const bankObj = banks.find(b => b.id === bankcode);

  const isSuccess = status === '1';
  const [processing, setProcessing] = useState(isSuccess);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const bookingId = getCookie('bookingId');
    if (!bookingId) {
      setError('Không tìm thấy bookingId!');
      setProcessing(false);
      return;
    }

    (async () => {
      try {
        const booking: Booking = await bookingService.getBookingDetails(bookingId);
        if (!booking) {
          setError('Không tìm thấy thông tin booking!');
          setProcessing(false);
          return;
        }

        const totalAmount = Number(amount) || booking.service?.price || 0;
        const method = paymentMethod || 'zalopay';
        const paymentStatus = isSuccess ? 'done' : 'tryAgain';

        if (!booking.payment) {
          await bookingService.CreatePayment({
            bookingId: booking.bookingId,
            totalAmount,
            status: paymentStatus,
            method,
            confirmed: false,
          });
        } else {
          await bookingService.updatePayment(booking.payment.paymentId, {
            paymentId: booking.payment.paymentId,
            bookingId: booking.bookingId,
            totalAmount,
            status: paymentStatus,
            method,
            confirmed: false,
          });
        }
      } catch (err: any) {
        setError('Có lỗi khi xác nhận thanh toán!');
      } finally {
        setProcessing(false);
      }
    })();
  }, [isSuccess, amount, paymentMethod, bankcode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100"
      >
        <div className="flex justify-center mb-6">
          {isSuccess ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100"
            >
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.span>
          ) : (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100"
            >
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.span>
          )}
        </div>
        <h1 className={`text-2xl font-bold mb-4 text-center ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
          {isSuccess ? 'Thanh Toán Thành Công!' : 'Thanh Toán Thất Bại'}
        </h1>
        <p className="text-gray-600 mb-6 text-center text-sm">
          {isSuccess
            ? processing
              ? 'Đang xác nhận giao dịch...'
              : error
                ? error
                : 'Cảm ơn bạn đã thanh toán. Giao dịch của bạn đã được xử lý thành công.'
            : 'Thanh toán không thành công. Vui lòng thử lại hoặc liên hệ tổng đài hỗ trợ.'}
        </p>
        <div className="bg-gray-50 rounded-lg p-6 text-left text-sm mb-6 border border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="w-1/3 font-medium text-gray-700">Mã giao dịch:</span>
              <span className="w-2/3 text-blue-600">{apptransid}</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/3 font-medium text-gray-700">Số tiền:</span>
              <span className="w-2/3 text-green-600">
                {amount ? `${Number(amount).toLocaleString('vi-VN')} đ` : ''}
              </span>
            </div>
            {discountamount && (
              <div className="flex items-center">
                <span className="w-1/3 font-medium text-gray-700">Khuyến mãi:</span>
                <span className="w-2/3 text-orange-600">
                  {Number(discountamount).toLocaleString('vi-VN')} đ
                </span>
              </div>
            )}
            {bankObj && (
              <div className="flex items-center">
                <span className="w-1/3 font-medium text-gray-700">Ngân hàng:</span>
                <div className="w-2/3 flex items-center">
                  <img src={bankObj.icon} alt={bankObj.name} className="w-6 h-6 mr-2" />
                  <span className="text-gray-800">{bankObj.name}</span>
                </div>
              </div>
            )}
            {methodObj && (
              <div className="flex items-center">
                <span className="w-1/3 font-medium text-gray-700">Phương thức thanh toán:</span>
                <div className="w-2/3 flex items-center">
                  <img src={methodObj.icon} alt={methodObj.label} className="w-6 h-6 mr-2" />
                  <span className="text-gray-800">{methodObj.label}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <motion.button
          className="w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          onClick={() => {
            const bookingId = getCookie('bookingId');
            if (bookingId) {
              navigate(`/patient/appointments/${bookingId}`);
            } else {
              navigate('/patient/dashboard');
            }
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Xem chi tiết lịch hẹn
        </motion.button>
        <div className="text-xs text-gray-500 mt-4 text-center">
          Nếu có vấn đề với giao dịch, vui lòng liên hệ tổng đài hỗ trợ.
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentCallbackPage;