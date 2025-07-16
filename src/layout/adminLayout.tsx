import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Home, Users, Settings,Beaker,List , BriefcaseMedicalIcon,CalendarDays } from "lucide-react";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Define sidebar links with their paths and labels
  const sidebarLinks = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/admin/services", label: "Dịch vụ", icon: <List size={20} /> },
    { path: "/admin/patients", label: "Quản lý bệnh nhân", icon: <Users size={20} /> },
    { path: "/admin/doctors", label: "Quản lý bác sĩ", icon: <Users size={20} /> },
    { path: "/admin/bookings", label: "Quản lý lịch hẹn", icon: <CalendarDays size={20} /> },
    { path: "/admin/examinations", label: "Xét nghiệm", icon: <Beaker size={20} /> },
    { path: "/admin/medicines", label: "Quản lí thuốc", icon: <BriefcaseMedicalIcon size={20} /> },
    { path: "/admin/settings", label: "Cài đặt", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg px-6 py-8 flex flex-col">
        <h2 className="text-2xl font-bold text-blue-600 mb-10">Quản trị</h2>
        <nav className="flex-1 space-y-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
                location.pathname === link.path
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="relative  flex-1 p-8">
        <span className="text-3xl  font-bold text-gray-800 mb-6">
          Welcome, <span className="text-red-500 font-bold">{user?.fullName || "Admin"}</span>
        </span>

        <button
          onClick={handleLogout}
          className="absolute top-8 hover:cursor-pointer   right-8 flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors duration-200"
        >
          <LogOut size={20} />
          Đăng xuất
        </button>

        <div>{children}</div>
      </main>
    </div>
  );
}