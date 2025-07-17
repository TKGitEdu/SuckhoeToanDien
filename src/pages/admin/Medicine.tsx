import React, { useState, useEffect } from 'react';
import { type TreatmentMedication, TreatmentMedicationAPI } from '../../api/adminApi/treatmentMedicationAPI';
import { motion, AnimatePresence } from "framer-motion";

const TreatmentMedications: React.FC = () => {
  const [medications, setMedications] = useState<TreatmentMedication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State cho modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editMedication, setEditMedication] = useState<TreatmentMedication | null>(null);
  const [form, setForm] = useState({
    medicationId: "",
    treatmentPlanId: "",
    drugType: "",
    drugName: "",
    description: "",
  });

  useEffect(() => {
    fetchMedications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMedications = async () => {
    setLoading(true);
    try {
      const data = await TreatmentMedicationAPI.getAllMedications();
      setMedications(data);
    } catch (err) {
      setError('Failed to fetch medications');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditMedication(null);
    setForm({
      medicationId: "",
      treatmentPlanId: "",
      drugType: "",
      drugName: "",
      description: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (med: TreatmentMedication) => {
    setEditMedication(med);
    setForm({
      medicationId: med.medicationId,
      treatmentPlanId: med.treatmentPlanId,
      drugType: med.drugType,
      drugName: med.drugName,
      description: med.description,
    });
    setModalOpen(true);
  };

  const handleDelete = async (medicationId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa thuốc này?")) return;
    try {
      if (typeof TreatmentMedicationAPI.deleteMedication === "function") {
        await TreatmentMedicationAPI.deleteMedication(medicationId);
        setMedications((prev) => prev.filter((m) => m.medicationId !== medicationId));
      } else {
        alert("API xóa chưa được cài đặt!");
      }
    } catch {
      alert("Xóa thất bại!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMedication) {
        if (typeof TreatmentMedicationAPI.updateMedcation === "function") {
          await TreatmentMedicationAPI.updateMedcation(editMedication.medicationId, form);
        } else {
          alert("API cập nhật chưa được cài đặt!");
          return;
        }
      } else {
        if (typeof TreatmentMedicationAPI.createMedication === "function") {
          await TreatmentMedicationAPI.createMedication(form);
        } else {
          alert("API tạo mới chưa được cài đặt!");
          return;
        }
      }
      setModalOpen(false);
      fetchMedications();
    } catch {
      alert("Lưu thất bại!");
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

  if (error) return (
    <div className="flex justify-center items-center h-screen text-red-600 font-medium bg-white shadow-md rounded-lg mx-auto max-w-md">
      {error}
    </div>
  );

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-200 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600">
            Treatment Medications
          </h1>
          <button
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition hover:cursor-pointer"
            onClick={handleOpenCreate}
          >
            + Thêm thuốc
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white sticky top-0 z-10">
              <tr>
                <th className="text-left px-6 py-4 font-semibold">No.</th>
                <th className="text-left px-6 py-4 font-semibold">Loại thuốc</th>
                <th className="text-left px-6 py-4 font-semibold">Tên</th>
                <th className="text-left px-6 py-4 font-semibold">Mô tả</th>
                <th className="text-left px-6 py-4 font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {medications.map((medication, index) => (
                <motion.tr
                  key={medication.medicationId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.1)", scale: 1.02 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{index + 1}</td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                    {medication.drugType}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                    {medication.drugName}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                    {medication.description}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      className="bg-indigo-500 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition hover:cursor-pointer"
                      onClick={() => handleOpenEdit(medication)}
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition hover:cursor-pointer"
                      onClick={() => handleDelete(medication.medicationId)}
                    >
                      Xóa
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
                <h2 className="text-xl font-bold mb-5 text-indigo-700">
                  {editMedication ? "Chỉnh sửa thuốc" : "Thêm thuốc mới"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại thuốc</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={form.drugType}
                      onChange={e => setForm({ ...form, drugType: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên thuốc</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={form.drugName}
                      onChange={e => setForm({ ...form, drugName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-5">
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition hover:cursor-pointer"
                      onClick={() => setModalOpen(false)}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition hover:cursor-pointer"
                    >
                      {editMedication ? "Lưu" : "Thêm"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TreatmentMedications;