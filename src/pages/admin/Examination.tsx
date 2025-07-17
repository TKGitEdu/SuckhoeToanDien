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

    if (loading) return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-4 border-t-indigo-500 border-b-purple-500 rounded-full"
        ></motion.div>
      </div>
    );

    return (
      <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-200 min-h-screen font-sans">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 mb-10">
            Danh sách khám bệnh
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white sticky top-0 z-10">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold">No</th>
                  <th className="text-left px-6 py-4 font-semibold">Ngày thực hiện</th>
                  <th className="text-left px-6 py-4 font-semibold">Mô tả</th>
                  <th className="text-left px-6 py-4 font-semibold">Kết quả</th>
                  <th className="text-left px-6 py-4 font-semibold">Trạng thái</th>
                  <th className="text-left px-6 py-4 font-semibold">Ghi chú</th>
                  <th className="text-left px-6 py-4 font-semibold">Ngày tạo</th>
                  <th className="text-left px-6 py-4 font-semibold">Thông tin lịch hẹn</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 divide-y divide-gray-100">
                {examinations.map((ex, idx) => (
                  <motion.tr
                    key={ex.examinationId || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.1)", scale: 1.02 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="cursor-pointer"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">{idx + 1}</td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap max-w-[150px]">
                      {ex.examinationDate ? new Date(ex.examinationDate).toLocaleString("vi-VN") : ""}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                      {ex.examinationDescription || ""}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                      {ex.result || ""}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap max-w-[120px]">
                      {ex.status || ""}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                      {ex.note || ""}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap max-w-[150px]">
                      {ex.createAt ? new Date(ex.createAt).toLocaleString("vi-VN") : ""}
                    </td>
                    <td className="px-6 py-4">
                      {ex.booking ? (
                        <button
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition hover:cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowBooking(ex.booking);
                          }}
                        >
                          Xem thêm
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Không có</span>
                      )}
                    </td>
                  </motion.tr>
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
                  <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6 min-w-[320px] max-w-[90vw] relative border border-indigo-500">
                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                      onClick={handleClosePopup}
                      aria-label="Đóng"
                    >
                      ×
                    </button>
                    <h2 className="text-xl font-bold mb-5 text-indigo-700">Thông tin lịch hẹn</h2>
                    <ul className="list-disc list-inside text-sm space-y-3 text-gray-600">
                      <li><strong>Mã lịch hẹn:</strong> {selectedBooking.bookingId}</li>
                      <li><strong>Ngày hẹn:</strong> {selectedBooking.dateBooking ? new Date(selectedBooking.dateBooking).toLocaleString("vi-VN") : ""}</li>
                      <li><strong>Mô tả:</strong> {selectedBooking.description || ""}</li>
                      <li><strong>Ghi chú:</strong> {selectedBooking.note || ""}</li>
                    </ul>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  export default Examination;