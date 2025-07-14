import React from 'react';

// Hàm parse query string thành object
function parseQuery(queryString: string) {
  const params = new URLSearchParams(queryString);
  const obj: Record<string, string> = {};
  params.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

const PaymentCallbackPage: React.FC = () => {
  // Lấy query string từ URL
  const search = window.location.search;
  const info = parseQuery(search);

  // Đặt tên hiển thị gọn cho các trường cần thiết
  const displayFields: { label: string; key: string }[] = [
    { label: 'Số tiền', key: 'amount' },
    { label: 'Mã giao dịch', key: 'apptransid' },
    { label: 'Trạng thái', key: 'status' },
    { label: 'App ID', key: 'appid' },
    { label: 'Mã giảm giá', key: 'discountamount' },
    { label: 'Ngân hàng', key: 'bankcode' },
  ];

  // Xử lý trạng thái thanh toán
  let statusText = '';
  switch (info.status) {
    case '1':
      statusText = 'Thành công';
      break;
    case '2':
      statusText = 'Thất bại';
      break;
    case '3':
      statusText = 'Đã hủy';
      break;
    default:
      statusText = 'Không xác định';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Kết quả thanh toán</h1>
        <div className="mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-white ${info.status === '1' ? 'bg-green-500' : info.status === '2' ? 'bg-red-500' : 'bg-gray-400'}`}>{statusText}</span>
        </div>
        <div className="text-left mx-auto max-w-xs">
          {displayFields.map(f => (
            <div key={f.key} className="flex justify-between py-1 border-b text-sm">
              <span className="font-medium text-gray-600">{f.label}:</span>
              <span className="text-gray-800">{info[f.key] || '-'}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-500 mt-6 text-xs">Nếu có vấn đề, vui lòng liên hệ CSKH.</p>
      </div>
    </div>
  );
};

export default PaymentCallbackPage;
