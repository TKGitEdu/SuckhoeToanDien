import { useEffect, useState } from "react";
import { servicesAPI, type Service } from "../../api/adminApi/servicesAPI";
import { Button } from "../../components/ui/button";

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState<Omit<Service, "serviceId">>({
    name: "",
    description: "",
    price: 0,
    status: "",
    category: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await servicesAPI.getAllService();
      setServices(data);
    } catch (err) {
      console.error("Lỗi khi lấy dịch vụ:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
      try {
        await servicesAPI.delete(id);
        await fetchServices();
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
      }
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setForm({
      name: service.name,
      description: service.description,
      price: service.price,
      status: service.status,
      category: service.category,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingService) {
        await servicesAPI.update(editingService.serviceId, {
          ...form,
          serviceId: editingService.serviceId,
        });
      } else {
        await servicesAPI.create({
          ...form,
          serviceId: "",
        });
      }
      setModalOpen(false);
      setEditingService(null);
      await fetchServices();
    } catch (err) {
      console.error("Lỗi khi lưu dịch vụ:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Danh sách dịch vụ</h1>
        <Button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:cursor-pointer hover:bg-blue-700 transition duration-200"
          onClick={() => {
            setForm({
              name: "",
              description: "",
              price: 0,
              status: "",
              category: "",
            });
            setEditingService(null);
            setModalOpen(true);
          }}
        >
          + Thêm dịch vụ
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-600">Đang tải...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Tên</th>
                <th className="px-4 py-3 text-left">Mô tả</th>
                <th className="px-4 py-3 text-left">Giá</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-left">Danh mục</th>
                <th className="px-4 py-3 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {services.map((s, idx) => (
                <tr
                  key={s.serviceId}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3">{s.description}</td>
                  <td className="px-4 py-3">
                    {s.price.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        s.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{s.category}</td>
                  <td className="px-4 py-3 space-x-2">
                    <Button
                      className="text-white bg-blue-500 hover:bg-blue-900 hover:cursor-pointer"
                      onClick={() => handleEdit(s)}
                    >
                      Sửa
                    </Button>
                    <Button
                      className="text-white bg-red-500 hover:bg-red-900 hover:cursor-pointer"
                      onClick={() => handleDelete(s.serviceId)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editingService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên
                </label>
                <input
                  type="text"
                  placeholder="Tên dịch vụ"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mô tả
                </label>
                <textarea
                  placeholder="Mô tả dịch vụ"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Giá
                </label>
                <input
                  type="number"
                  placeholder="Giá dịch vụ"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Trạng thái
                </label>
                <select
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Active">Hoạt động</option>
                  <option value="Inactive">Ngừng hoạt động</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Danh mục
                </label>
                <input
                  type="text"
                  placeholder="Danh mục"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:cursor-pointer hover:bg-gray-300 transition duration-200"
                  onClick={() => setModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white hover:cursor-pointer rounded-md hover:bg-blue-700 transition duration-200"
                  onClick={handleSubmit}
                >
                  {editingService ? "Lưu" : "Thêm"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
