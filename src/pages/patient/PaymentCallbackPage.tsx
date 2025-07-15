import React, { useEffect, useState } from 'react';
import { bookingService } from '../../api/patientApi/paymentAPI';
import type { Booking } from '../../api/patientApi/paymentAPI';

const paymentMethods = [
  { id: 'zalopay', label: 'Ví ZaloPay', icon: '/src/assets/images/logo-zalopay.svg' },
  { id: 'visa', label: 'Visa/Mastercard/JCB', icon: '/src/assets/images/gold.jpg' },
  { id: 'atm', label: 'Thẻ ATM', icon: '/src/assets/images/atm-card.gif' },// (qua ZaloPay)
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

  // Lấy label/icon cho UI
  const methodObj = paymentMethods.find(m => m.id === paymentMethod);
  const bankObj = banks.find(b => b.id === bankcode);

  const isSuccess = status === '1';
  const [processing, setProcessing] = useState(isSuccess);
  const [error, setError] = useState<string | null>(null);

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
        const paymentStatus = isSuccess ? 'pending' : 'tryAgain';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md w-full border border-gray-200">
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          ) : (
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          )}
        </div>
        <h1 className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
          {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
        </h1>
        <p className="text-gray-700 mb-4">
          {isSuccess
            ? processing
              ? 'Đang xác nhận giao dịch...'
              : error
                ? error
                : 'Cảm ơn bạn đã thanh toán. Giao dịch của bạn đã được xử lý thành công.'
            : 'Thanh toán không thành công. Vui lòng thử lại hoặc liên hệ CSKH.'}
        </p>
        <div className="bg-gray-50 rounded-xl p-5 text-left text-sm mb-4 border border-gray-200">
          <div className="mb-1"><span className="font-semibold">Mã giao dịch:</span> <span className="text-blue-700">{apptransid}</span></div>
          <div className="mb-1"><span className="font-semibold">Số tiền:</span> <span className="text-green-700">{amount ? `${Number(amount).toLocaleString('vi-VN')} đ` : ''}</span></div>
          {discountamount && <div className="mb-1"><span className="font-semibold">Khuyến mãi:</span> <span className="text-orange-700">{Number(discountamount).toLocaleString('vi-VN')} đ</span></div>}
          {bankObj && (
            <div className="mb-1 flex items-center">
              <span className="font-semibold">Ngân hàng:</span>
              <img src={bankObj.icon} alt={bankObj.name} className="w-6 h-6 mx-2 inline-block" />
              <span className="text-gray-700">{bankObj.name}</span>
            </div>
          )}
          {methodObj && (
            <div className="mb-1 flex items-center">
              <span className="font-semibold">Phương thức thanh toán:</span>
              <img src={methodObj.icon} alt={methodObj.label} className="w-6 h-6 mx-2 inline-block" />
              <span className="text-gray-700">{methodObj.label}</span>
            </div>
          )}
        </div>
        <button
          className="mt-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          onClick={() => window.location.href = '/'}
        >
          Về trang chủ
        </button>
        <div className="text-xs text-gray-500 mt-4">Nếu có vấn đề với giao dịch, vui lòng liên hệ CSKH để được hỗ trợ.</div>
      </div>
    </div>
  );
};

export default PaymentCallbackPage;