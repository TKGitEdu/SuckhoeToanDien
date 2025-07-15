import React, { useEffect, useState } from "react";
import { ExaminationAPI, type ExaminationResponse } from "../../api/adminApi/examinationAPI";
import { motion, AnimatePresence } from "framer-motion";

const Examination: React.FC = () => {
  const [examinations, setExaminations] = useState<ExaminationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  useEffect(() => {
    const fetchExaminations = async () => {
      try {
        const response = await ExaminationAPI.getAllExaminations();
        setExaminations(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error fetching examinations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExaminations();
  }, []);

  const handleShowBooking = (booking: any) => {
    setSelectedBooking(booking);
  };

  const handleClosePopup = () => {
    setSelectedBooking(null);
  };

  if (loading) return <p className="p-4">Đang tải danh sách khám bệnh...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Danh sách khám bệnh</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="text-left px-4 py-3">No</th>
              <th className="text-left px-4 py-3">Ngày thực hiện</th>
              <th className="text-left px-4 py-3">Mô tả </th>
              <th className="text-left px-4 py-3">Kết quả</th>
              <th className="text-left px-4 py-3">Trạng thái</th>
              <th className="text-left px-4 py-3">Ghi chú</th>
              <th className="text-left px-4 py-3">Ngày tạo</th>
              <th className="text-left px-4 py-3">Thông tin lịch hẹn</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {examinations.map((ex, idx) => (
              <tr key={ex.examinationId || idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3">{idx + 1}</td>
                <td className="px-4 py-3">{ex.examinationDate ? new Date(ex.examinationDate).toLocaleString("vi-VN") : ""}</td>
                <td className="px-4 py-3">{ex.examinationDescription}</td>
                <td className="px-4 py-3">{ex.result}</td>
                <td className="px-4 py-3">{ex.status}</td>
                <td className="px-4 py-3">{ex.note}</td>
                <td className="px-4 py-3">{ex.createAt ? new Date(ex.createAt).toLocaleString("vi-VN") : ""}</td>
                <td className="px-4 py-3">
                  {ex.booking ? (
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition hover:cursor-pointer"
                      onClick={() => handleShowBooking(ex.booking)}
                    >
                      Xem thêm
                    </button>
                  ) : <span className="text-sm text-gray-400 italic">Không có</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <AnimatePresence>
        {selectedBooking && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleClosePopup}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw] relative border border-blue-500">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                  onClick={handleClosePopup}
                  aria-label="Đóng"
                >
                  ×
                </button>
                <h2 className="text-xl font-bold mb-4 text-blue-600">Thông tin lịch hẹn</h2>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li><b>Mã lịch hẹn:</b> {selectedBooking.bookingId}</li>
                  <li><b>Ngày hẹn:</b> {selectedBooking.dateBooking ? new Date(selectedBooking.dateBooking).toLocaleString("vi-VN") : ""}</li>
                  <li><b>Mô tả:</b> {selectedBooking.description}</li>
                  <li><b>Ghi chú:</b> {selectedBooking.note}</li>
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Examination;