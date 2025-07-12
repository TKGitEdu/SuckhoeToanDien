import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Home, Users, Settings } from "lucide-react";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg px-6 py-8 flex flex-col">
        <h2 className="text-2xl font-bold text-blue-600 mb-10">Quản trị</h2>
        <nav className="flex-1 space-y-4">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
          >
            <Home size={20} />
            Dashboard
          </Link>
          <Link
            to="/admin/services"
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
          >
            <Home size={20} />
            Dịch vụ
          </Link>
          <Link
            to="/admin/patients"
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
          >
            <Users size={20} />
            Quản lý bệnh nhân
          </Link>
          <Link
            to="/admin/doctors"
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
          >
            <Users size={20} />
            Quản lý bác sĩ
          </Link>
          <Link
            to="/admin/settings"
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
          >
            <Settings size={20} />
            Cài đặt
          </Link>
        </nav>
      </aside>

      <main className="relative flex-1 p-8">

        <span className="text-3xl font-bold text-gray-800 mb-6">
          Welcome,<h2 className="text-red-500 font-bold">{user?.fullName || "Admin"}</h2>
        </span>

        <button
          onClick={handleLogout}
          className="absolute top-8 right-8 flex items-center gap-2 text-red-500 hover:text-red-700 hover:cursor-pointer"
        >
          <LogOut size={20} />
          Đăng xuất
        </button>

        <div>{children}</div>
      </main>
    </div>
  );
}
