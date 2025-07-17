import { useEffect, useState } from "react";
import { patientAPI, type Patient, type PatientUpdateRequest } from "../../api/adminApi/patientAPI";
import { BookingAPI, type BookingResponse } from "../../api/adminApi/bookingsAPI";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingInfo, setBookingInfo] = useState<BookingResponse | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  // State cho popup chỉnh sửa
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<PatientUpdateRequest>>({});
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await patientAPI.getAllPatient();
        setPatients(response);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bệnh nhân:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // Hàm xem thông tin booking của patient
  const handleViewBooking = async (bookingId: string) => {
    try {
      const booking = await BookingAPI.getBookingById(bookingId);
      setBookingInfo(booking);
      setShowBooking(true);
    } catch (err) {
      alert("Không thể lấy thông tin lịch hẹn!");
    }
  };

  // Hàm mở popup chỉnh sửa
  const handleEditPatient = (patient: Patient) => {
    setEditForm({
      patientId: patient.patientId,
      userId: patient.userId,
      name: patient.name,
      phone: patient.phone,
      email: patient.email,
      dateOfBirth: patient.dateOfBirth,
      address: patient.address,
      gender: patient.gender,
      bloodType: patient.bloodType,
      emergencyPhoneNumber: patient.emergencyPhoneNumber,
    });
    setEditModal(true);
  };

  // Hàm lưu cập nhật
  const handleSavePatient = async () => {
    try {
      await patientAPI.updatePatient(editForm);
      setEditModal(false);
      setSuccessMsg("Cập nhật bệnh nhân thành công!");
      setTimeout(() => setSuccessMsg(""), 2000);
      // Refresh lại danh sách
      const response = await patientAPI.getAllPatient();
      setPatients(response);
    } catch (err) {
      alert("Cập nhật thất bại!");
    }
  };

  if (loading)
    return (
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
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600">
            Quản lý bệnh nhân
          </h1>
        </div>

        {/* Thông báo nhỏ */}
        {successMsg && (
          <div className="fixed top-6 right-6 z-[100] bg-green-500 text-white px-4 py-2 rounded shadow transition">
            {successMsg}
          </div>
        )}

        <div className="overflow-x-hidden">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white sticky top-0 z-10">
              <tr>
                <th className="text-left px-6 py-4 font-semibold">Họ tên</th>
                <th className="text-left px-6 py-4 font-semibold">Địa chỉ</th>
                <th className="text-left px-6 py-4 font-semibold">Ngày sinh</th>
                <th className="text-left px-6 py-4 font-semibold">SĐT</th>
                <th className="text-left px-6 py-4 font-semibold">Email</th>
                <th className="text-left px-6 py-4 font-semibold">Tình trạng</th>
                <th className="text-left px-6 py-4 font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {patients.map((patient, idx) => (
                <motion.tr
                  key={patient.patientId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.1)", scale: 1.02 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                    {patient.user.fullName}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                    {patient.address}
                  </td>
                  <td className="px-6 py-4 text-gray-800 whitespace-nowrap max-w-[120px]">
                    {new Date(patient.dateOfBirth).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap max-w-[120px]">
                    {patient.phone}
                  </td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                    {patient.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-lg font-medium ${
                        patient.patientDetails.length > 0
                          ? {
                              "Active": "text-green-700 bg-green-100",
                              "Inactive": "text-red-700 bg-red-100",
                              "Pending": "text-yellow-700 bg-yellow-100",
                              "Completed": "text-blue-700 bg-blue-100"
                            }[patient.patientDetails[0].treatmentStatus] || "text-gray-700 bg-gray-100"
                          : "text-gray-700 bg-gray-100"
                      }`}
                    >
                      {patient.patientDetails.length > 0
                        ? {
                            "Active": "Hoạt động",
                            "Inactive": "Ngưng hoạt động",
                            "Pending": "Đang xử lý",
                            "Completed": "Đã hoàn thành"
                          }[patient.patientDetails[0].treatmentStatus] || patient.patientDetails[0].treatmentStatus || "Chưa xác định"
                        : "Chưa cập nhật"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-700 transition hover:cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn chặn sự kiện click lan ra hàng
                        handleEditPatient(patient);
                      }}
                    >
                      Sửa
                    </button>
                    {patient.booking?.bookingId && (
                      <button
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded hover:from-indigo-700 hover:to-purple-700 transition hover:cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn chặn sự kiện click lan ra hàng
                          handleViewBooking(patient.booking.bookingId);
                        }}
                      >
                        Xem lịch hẹn
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Popup chỉnh sửa bệnh nhân */}
        <AnimatePresence>
          {editModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] max-w-md w-full relative"
              >
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  onClick={() => setEditModal(false)}
                  aria-label="Đóng"
                >
                  ×
                </button>
                <h2 className="text-xl font-bold mb-5 text-indigo-700">Cập nhật bệnh nhân</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 p-2 rounded"
                      value={editForm.name || ""}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SĐT</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 p-2 rounded"
                      value={editForm.phone || ""}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full border border-gray-200 p-2 rounded"
                      value={editForm.email || ""}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 p-2 rounded"
                      value={editForm.address || ""}
                      onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                    <input
                      type="date"
                      className="w-full border border-gray-200 p-2 rounded"
                      value={editForm.dateOfBirth ? editForm.dateOfBirth.slice(0, 10) : ""}
                      onChange={e => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition hover:cursor-pointer"
                      onClick={() => setEditModal(false)}
                    >
                      Hủy
                    </button>
                    <button
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition hover:cursor-pointer"
                      onClick={handleSavePatient}
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Popup xem booking */}
        <AnimatePresence>
          {showBooking && bookingInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] max-w-md w-full relative"
              >
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  onClick={() => setShowBooking(false)}
                  aria-label="Đóng"
                >
                  ×
                </button>
                <h2 className="text-xl font-bold mb-5 text-indigo-700">Thông tin lịch hẹn</h2>
                <ul className="list-disc list-inside text-sm space-y-4">
                  <li className="flex items-center"><b className="mr-3 text-gray-800">Ngày hẹn:</b> <span className="text-gray-600">{bookingInfo.dateBooking ? new Date(bookingInfo.dateBooking).toLocaleString("vi-VN") : "Chưa có"}</span></li>
                  <li className="flex items-center"><b className="mr-3 text-gray-800">Dịch vụ:</b> <span className="text-gray-600">{bookingInfo.service?.name || "Chưa có"}</span></li>
                  <li className="flex items-center"><b className="mr-3 text-gray-800">Bác sĩ:</b> <span className="text-gray-600">{bookingInfo.doctor?.doctorName || "Chưa có"}</span></li>
                  <li className="flex items-center"><b className="mr-3 text-gray-800">Khung giờ:</b> <span className="text-gray-600">{bookingInfo.slot?.slotName || "Chưa có"}</span></li>
                  <li className="flex items-center"><b className="mr-3 text-gray-800">Trạng thái:</b> <span className={bookingInfo.status === "Confirmed" ? "text-green-600" : "text-yellow-600"}>{bookingInfo.status || "Chưa cập nhật"}</span></li>
                  <li className="flex items-center"><b className="mr-3 text-gray-800">Ghi chú:</b> <span className="text-gray-600">{bookingInfo.note || "Không có"}</span></li>
                </ul>
                <div className="mt-6 text-right">
                  <button
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:cursor-pointer"
                    onClick={() => setShowBooking(false)}
                  >
                    Đóng
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}