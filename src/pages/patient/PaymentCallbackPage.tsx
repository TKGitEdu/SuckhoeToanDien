import React from 'react';

const PaymentCallbackPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Cảm ơn bạn đã thanh toán!</h1>
        <p className="text-gray-700">Giao dịch của bạn đang được xử lý.<br />Vui lòng kiểm tra lại lịch sử thanh toán hoặc liên hệ CSKH nếu cần hỗ trợ.</p>
      </div>
    </div>
  );
};

export default PaymentCallbackPage;
