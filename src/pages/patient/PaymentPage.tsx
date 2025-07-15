
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../../api/patientApi/paymentAPI';

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
    document.cookie = `bookingId=${booking.bookingId}; path=/; max-age=600`;// 10 phút
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

  if (loading) return <div className="p-8 text-center">Đang tải thông tin...</div>;
  if (!booking) return <div className="p-8 text-center text-red-600">Không tìm thấy booking!</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Thanh toán dịch vụ</h1>
      <div className="mb-6 space-y-2">
        <div><b>Bệnh nhân:</b> {booking.patient?.name}</div>
        <div><b>Dịch vụ:</b> {booking.service?.name}</div>
        <div><b>Bác sĩ:</b> {booking.doctor?.doctorName}</div>
        <div><b>Số tiền cần thanh toán:</b> <span className="text-lg text-blue-600 font-bold">{(booking.payment?.totalAmount || booking.service?.price || 0).toLocaleString('vi-VN')} VNĐ</span></div>
      </div>

      <div className="mb-6">
        <p className="mb-2 font-semibold">Vui lòng chọn hình thức thanh toán:</p>
        <div className="flex flex-wrap gap-4">
          {paymentMethods.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`flex items-center border-2 rounded-lg px-4 py-2 transition-all ${selectedMethod === m.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
              onClick={() => setSelectedMethod(m.id)}
            >
              <img src={m.icon} alt={m.label} className="w-8 h-8 mr-2" />
              <span>{m.label}</span>
              {selectedMethod === m.id && (
                <svg className="w-5 h-5 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {selectedMethod === 'atm' && (
        <div className="mb-6">
          <p className="mb-2 font-semibold">Chọn ngân hàng:</p>
          <div className="flex flex-wrap gap-3 bank-group">
            {banks.map((bank) => (
              <button
                key={bank.id}
                type="button"
                className={`bank-item flex items-center border-2 rounded-lg px-3 py-2 transition-all ${selectedBank === bank.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                onClick={() => setSelectedBank(bank.id)}
              >
                <img src={bank.icon} alt={bank.name} className="w-8 h-8 mr-2" />
                <span>{bank.name}</span>
                {selectedBank === bank.id && (
                  <svg className="w-5 h-5 ml-2 text-green-600 checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={processing || (selectedMethod === 'atm' && !selectedBank)}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-60"
      >
        {processing ? 'Đang chuyển hướng...' : 'Thanh toán ngay'}
      </button>
    </div>
  );
};

export default PaymentPage;
