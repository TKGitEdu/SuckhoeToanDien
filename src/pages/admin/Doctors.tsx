import { useState, useEffect } from "react";
import { doctorAPI } from "../../api/adminApi/doctorsAPI";
import { motion, AnimatePresence } from "framer-motion";

type Booking = {
  bookingId: string;
  dateBooking: string;
  description: string;
  note: string;
};

type Doctor = {
  doctorId: string;
  doctorName: string;
  specialization: string;
  phone: string;
  email: string;
  user: {
    fullName: string;
    email: string;
    phone: string;
    gender: string;
  };
  bookings: Booking[];
};

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDoctor, setEditDoctor] = useState<Partial<Doctor> | null>(null);
  // For create mode only
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
    setEditDoctor({ ...doctor });
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditDoctor({
      doctorName: "",
      specialization: "",
      phone: "",
      email: "",
      user: {
        fullName: "",
        email: "",
        phone: "",
        gender: "",
      },
      bookings: [],
    });
    setCreateFields({ username: "", password: "", address: "" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editDoctor?.doctorId) {
        await doctorAPI.updateDoctor(editDoctor.doctorId, editDoctor);
        setSuccessMsg("Cập nhật bác sĩ thành công!");
      } else {
        // Map modal fields to CreateDoctorRequest
        const payload = {
          userId: "",
          doctorName: editDoctor?.user?.fullName || "",
          specialization: editDoctor?.specialization || "",
          phone: editDoctor?.user?.phone || "",
          email: editDoctor?.user?.email || "",
          username: createFields.username,
          password: createFields.password,
          address: createFields.address,
          gender: editDoctor?.user?.gender || "",
        };
        await doctorAPI.createDoctor(payload);
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
          <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white sticky top-0 z-10">
              <tr>
                <th className="text-left px-6 py-4 font-semibold">Họ tên</th>
                <th className="text-left px-6 py-4 font-semibold">Chuyên môn</th>
                <th className="text-left px-6 py-4 font-semibold">Email</th>
                <th className="text-left px-6 py-4 font-semibold">SĐT</th>
                <th className="text-left px-6 py-4 font-semibold">Giới tính</th>
                <th className="text-left px-6 py-4 font-semibold">Lịch hẹn</th>
                <th className="text-left px-6 py-4 font-semibold">Hành động</th>
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
                  <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                    {doctor.user.fullName}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                    {doctor.specialization}
                  </td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                    {doctor.user.email}
                  </td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap max-w-[120px]">
                    {doctor.user.phone}
                  </td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap max-w-[100px]">
                    {doctor.user.gender}
                  </td>
                  <td className="px-6 py-4">
                    {doctor.bookings.length === 0 ? (
                      <span className="text-sm text-gray-400 italic">Không có</span>
                    ) : (
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {doctor.bookings.map((booking) => (
                          <li key={booking.bookingId} className="text-gray-600">
                            <p><strong>Ngày:</strong> {new Date(booking.dateBooking).toLocaleString("vi-VN")}</p>
                            <p><strong>Mô tả:</strong> {booking.description}</p>
                            <p><strong>Ghi chú:</strong> {booking.note}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-700 transition hover:cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(doctor);
                      }}
                    >
                      Sửa
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
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Họ tên"
                    value={editDoctor?.user?.fullName || ""}
                    onChange={e => setEditDoctor({
                      ...editDoctor,
                      user: {
                        fullName: e.target.value,
                        email: editDoctor?.user?.email || "",
                        phone: editDoctor?.user?.phone || "",
                        gender: editDoctor?.user?.gender || "",
                      },
                    })}
                  />
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Chuyên môn"
                    value={editDoctor?.specialization || ""}
                    onChange={e => setEditDoctor({ ...editDoctor, specialization: e.target.value })}
                  />
                  <input
                    type="email"
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Email"
                    value={editDoctor?.user?.email || ""}
                    onChange={e => setEditDoctor({
                      ...editDoctor,
                      user: {
                        fullName: editDoctor?.user?.fullName || "",
                        email: e.target.value,
                        phone: editDoctor?.user?.phone || "",
                        gender: editDoctor?.user?.gender || "",
                      },
                    })}
                  />
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="SĐT"
                    value={editDoctor?.user?.phone || ""}
                    onChange={e => setEditDoctor({
                      ...editDoctor,
                      user: {
                        fullName: editDoctor?.user?.fullName || "",
                        email: editDoctor?.user?.email || "",
                        phone: e.target.value,
                        gender: editDoctor?.user?.gender || "",
                      },
                    })}
                  />
                  <select
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editDoctor?.user?.gender || ""}
                    onChange={e => setEditDoctor({
                      ...editDoctor,
                      user: {
                        fullName: editDoctor?.user?.fullName || "",
                        email: editDoctor?.user?.email || "",
                        phone: editDoctor?.user?.phone || "",
                        gender: e.target.value,
                      },
                    })}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                  {!editDoctor?.doctorId && (
                    <>
                      <input
                        type="text"
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Tên đăng nhập"
                        value={createFields.username}
                        onChange={e => setCreateFields(f => ({ ...f, username: e.target.value }))}
                      />
                      <input
                        type="password"
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Mật khẩu"
                        value={createFields.password}
                        onChange={e => setCreateFields(f => ({ ...f, password: e.target.value }))}
                      />
                      <input
                        type="text"
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Địa chỉ"
                        value={createFields.address}
                        onChange={e => setCreateFields(f => ({ ...f, address: e.target.value }))}
                      />
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
      </div>
    </div>
  );
}