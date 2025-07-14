import React from 'react';

const PaymentCallbackPage: React.FC = () => {
  // Lấy các tham số từ URL
  const searchParams = new URLSearchParams(window.location.search);
  const amount = searchParams.get('amount');
  const apptransid = searchParams.get('apptransid');
  const status = searchParams.get('status');
  const discountamount = searchParams.get('discountamount');
  const bankcode = searchParams.get('bankcode');
  const pmcid = searchParams.get('pmcid');

  // Xác định trạng thái thanh toán
  const isSuccess = status === '1';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow text-center max-w-md w-full">
        <h1 className={`text-2xl font-bold mb-4 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
          {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
        </h1>
        <p className="text-gray-700 mb-4">
          {isSuccess
            ? 'Cảm ơn bạn đã thanh toán. Giao dịch của bạn đã được xử lý thành công.'
            : 'Thanh toán không thành công. Vui lòng thử lại hoặc liên hệ CSKH.'}
        </p>
        <div className="bg-gray-100 rounded p-4 text-left text-sm mb-4">
          <div><span className="font-semibold">Mã giao dịch:</span> {apptransid}</div>
          <div><span className="font-semibold">Số tiền:</span> {amount ? `${Number(amount).toLocaleString('vi-VN')} đ` : ''}</div>
          {discountamount && <div><span className="font-semibold">Khuyến mãi:</span> {Number(discountamount).toLocaleString('vi-VN')} đ</div>}
          {bankcode && bankcode !== '' && <div><span className="font-semibold">Ngân hàng:</span> {bankcode}</div>}
          {pmcid && <div><span className="font-semibold">Phương thức thanh toán:</span> {pmcid}</div>}
        </div>
        <div className="text-xs text-gray-500">Nếu có vấn đề với giao dịch, vui lòng liên hệ CSKH để được hỗ trợ.</div>
      </div>
    </div>
  );
};

export default PaymentCallbackPage;
