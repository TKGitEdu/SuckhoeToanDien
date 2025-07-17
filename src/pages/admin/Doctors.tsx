import { useState, useEffect } from "react";
import { doctorAPI, type Doctor, type UpdateDoctorRequest, type CreateDoctorRequest } from "../../api/adminApi/doctorsAPI";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [editDoctor, setEditDoctor] = useState<UpdateDoctorRequest | null>(null);
  const [createFields, setCreateFields] = useState({
    username: "",
    password: "",
    address: "",
  });
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorAPI.getAllDoctor();
        setDoctors(response);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bác sĩ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleEdit = (doctor: Doctor) => {
    setEditDoctor({
      doctorId: doctor.doctorId,
      userId: doctor.userId,
      doctorName: doctor.doctorName,
      specialization: doctor.specialization,
      phone: doctor.phone,
      email: doctor.email,
      address: doctor.address,
      gender: doctor.gender,
      dateOfBirth: doctor.dateOfBirth,
    });
    setModalOpen(true);
  };

  const handleViewDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDetailsModalOpen(true);
  };

  const handleCreate = () => {
    setEditDoctor({
      doctorId: "",
      userId: "",
      doctorName: "",
      specialization: "",
      phone: "",
      email: "",
      address: "",
      gender: "",
      dateOfBirth: "",
    });
    setCreateFields({ username: "", password: "", address: "" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editDoctor?.doctorId) {
        // Update doctor
        const updatePayload: UpdateDoctorRequest = {
          doctorId: editDoctor.doctorId,
          userId: editDoctor.userId || "",
          doctorName: editDoctor.doctorName || "",
          specialization: editDoctor.specialization || "",
          phone: editDoctor.phone || "",
          email: editDoctor.email || "",
          address: editDoctor.address || createFields.address || "",
          gender: editDoctor.gender || "",
          dateOfBirth: editDoctor.dateOfBirth || "",
        };
        await doctorAPI.updateDoctor(updatePayload);
        setSuccessMsg("Cập nhật bác sĩ thành công!");
      } else {
        // Create doctor
        const createPayload: CreateDoctorRequest = {
          userId: editDoctor?.userId || "",
          doctorName: editDoctor?.doctorName || "",
          specialization: editDoctor?.specialization || "",
          phone: editDoctor?.phone || "",
          email: editDoctor?.email || "",
          username: createFields.username,
          password: createFields.password,
          address: createFields.address,
          gender: editDoctor?.gender || "",
        };
        await doctorAPI.createDoctor(createPayload);
        setSuccessMsg("Tạo bác sĩ thành công!");
      }
      setModalOpen(false);
      setTimeout(() => setSuccessMsg(""), 2000);
      // Refresh
      const response = await doctorAPI.getAllDoctor();
      setDoctors(response);
    } catch (err) {
      alert("Thao tác thất bại!");
    }
  };

  // Helper function to format ISO date to YYYY-MM-DD for input type="date"
  const formatDateForInput = (isoDate: string | undefined): string => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
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
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600">
            Danh sách bác sĩ
          </h1>
          <button
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition hover:cursor-pointer"
            onClick={handleCreate}
          >
            + Tạo bác sĩ
          </button>
        </div>

        {successMsg && (
          <div className="fixed top-6 right-6 z-[100] bg-green-500 text-white px-4 py-2 rounded shadow-md transition">
            {successMsg}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg table-fixed">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white sticky top-0 z-10">
              <tr>
                <th className="text-left px-6 py-4 font-semibold w-[150px]">Họ tên</th>
                <th className="text-left px-6 py-4 font-semibold w-[150px]">Email</th>
                <th className="text-left px-6 py-4 font-semibold w-[100px]">Giới tính</th>
                <th className="text-left px-6 py-4 font-semibold w-[120px]">SĐT</th>
                <th className="text-left px-6 py-4 font-semibold w-[150px]">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {doctors.map((doctor, index) => (
                <motion.tr
                  key={doctor.doctorId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.1)", scale: 1.02 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                    {doctor.doctorName}
                  </td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                    {doctor.email}
                  </td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                    {doctor.gender}
                  </td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                    {doctor.phone}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-700 transition hover:cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(doctor);
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 transition hover:cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(doctor);
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6 min-w-[320px] max-w-[90vw] relative"
              >
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  onClick={() => setModalOpen(false)}
                  aria-label="Đóng"
                >
                  ×
                </button>
                <h2 className="text-xl font-bold mb-5 text-indigo-700">{editDoctor?.doctorId ? "Cập nhật bác sĩ" : "Tạo bác sĩ"}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nhập họ tên"
                      value={editDoctor?.doctorName || ""}
                      onChange={(e) => setEditDoctor({ ...editDoctor, doctorName: e.target.value } as UpdateDoctorRequest)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên môn</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nhập chuyên môn"
                      value={editDoctor?.specialization || ""}
                      onChange={(e) => setEditDoctor({ ...editDoctor, specialization: e.target.value } as UpdateDoctorRequest)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nhập email"
                      value={editDoctor?.email || ""}
                      onChange={(e) => setEditDoctor({ ...editDoctor, email: e.target.value } as UpdateDoctorRequest)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nhập số điện thoại"
                      value={editDoctor?.phone || ""}
                      onChange={(e) => setEditDoctor({ ...editDoctor, phone: e.target.value } as UpdateDoctorRequest)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                    <select
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editDoctor?.gender || ""}
                      onChange={(e) => setEditDoctor({ ...editDoctor, gender: e.target.value } as UpdateDoctorRequest)}
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nhập địa chỉ"
                      value={editDoctor?.address || createFields.address}
                      onChange={(e) =>
                        editDoctor?.doctorId
                          ? setEditDoctor({ ...editDoctor, address: e.target.value } as UpdateDoctorRequest)
                          : setCreateFields({ ...createFields, address: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formatDateForInput(editDoctor?.dateOfBirth)}
                      onChange={(e) => setEditDoctor({ ...editDoctor, dateOfBirth: e.target.value ? new Date(e.target.value).toISOString() : "" } as UpdateDoctorRequest)}
                    />
                  </div>
                  {!editDoctor?.doctorId && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Nhập tên đăng nhập"
                          value={createFields.username}
                          onChange={(e) => setCreateFields({ ...createFields, username: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                        <input
                          type="password"
                          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Nhập mật khẩu"
                          value={createFields.password}
                          onChange={(e) => setCreateFields({ ...createFields, password: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                  <div className="flex justify-end gap-2 mt-5">
                    <button
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition hover:cursor-pointer"
                      onClick={() => setModalOpen(false)}
                    >
                      Hủy
                    </button>
                    <button
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition hover:cursor-pointer"
                      onClick={handleSave}
                    >
                      {editDoctor?.doctorId ? "Lưu" : "Tạo"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {detailsModalOpen && selectedDoctor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6 min-w-[320px] max-w-[90vw] relative"
              >
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  onClick={() => setDetailsModalOpen(false)}
                  aria-label="Đóng"
                >
                  ×
                </button>
                <h2 className="text-xl font-bold mb-5 text-indigo-700">Chi tiết bác sĩ</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                    <p className="text-gray-800">{selectedDoctor.doctorName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên môn</label>
                    <p className="text-gray-800">{selectedDoctor.specialization}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-800">{selectedDoctor.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <p className="text-gray-800">{selectedDoctor.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                    <p className="text-gray-800">{selectedDoctor.gender}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <p className="text-gray-800">{selectedDoctor.address || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                    <p className="text-gray-800">
                      {selectedDoctor.dateOfBirth 
                        ? new Date(selectedDoctor.dateOfBirth).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          }).replace(/\//g, "-")
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lịch hẹn</label>
                    {(selectedDoctor as any).bookings?.length === 0 ? (
                      <p className="text-gray-400 italic">Không có</p>
                    ) : (
                      <div className="max-h-48 overflow-y-auto">
                        <ul className="list-disc list-inside text-sm space-y-2">
                          {(selectedDoctor as any).bookings?.map((booking: any) => (
                            <li key={booking.bookingId} className="text-gray-600">
                              <p><strong>Ngày:</strong> {new Date(booking.dateBooking).toLocaleString("vi-VN")}</p>
                              <p><strong>Mô tả:</strong> {booking.description}</p>
                              <p><strong>Ghi chú:</strong> {booking.note}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end mt-5">
                    <button
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition hover:cursor-pointer"
                      onClick={() => setDetailsModalOpen(false)}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}