import { Syringe, Menu, X} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "../utils/logout";

interface UserInfo {
  userId: string;
  fullName: string;
  roleId: string;
  roleName: string;
  email?: string;
}

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("doctorId");
    localStorage.removeItem("patientId");
    navigate("/");
  };

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return "/patient/dashboard";

    switch (user.roleId) {
      case "ROLE_1":
        return "/admin/dashboard";
      case "ROLE_2":
        return "/doctor/dashboard";
      case "ROLE_3":
      default:
        return "/patient/dashboard";
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link to="/">
            <span className="text-xl sm:text-2xl font-bold text-gray-800">FertilityCare</span>
          </Link>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex space-x-6 xl:space-x-8">
          <Link to="/" className={`${location.pathname === '/' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600 transition-colors`}>
            Trang chủ
          </Link>
          <Link
            to="/services"
            className={`${
              location.pathname.includes("/services")
                ? "text-blue-600 font-medium"
                : "text-gray-600"
            } hover:text-blue-600 transition-colors`}
          >
            Dịch vụ
          </Link>
          <Link
            to="/doctors"
            className={`${
              location.pathname.includes("/doctors")
                ? "text-blue-600 font-medium"
                : "text-gray-600"
            } hover:text-blue-600 transition-colors`}
          >
            Bác sĩ
          </Link>
          <Link
            to="/blog"
            className={`${
              location.pathname.includes("/blog")
                ? "text-blue-600 font-medium"
                : "text-gray-600"
            } hover:text-blue-600 transition-colors`}
          >
            Blog
          </Link>
          <Link
            to="/booking"
            className={`${
              location.pathname === "/booking"
                ? "text-blue-600 font-medium"
                : "text-gray-600"
            } hover:text-blue-600 transition-colors`}
          >
            Đặt lịch
          </Link>
        </nav>

        {/* User Section - Desktop */}
        <div className="hidden lg:flex items-center">
          {user ? (
            <div className="flex gap-2 xl:gap-4 items-center">
              <Link to={getDashboardLink()}>
                <div className="flex items-center px-2 xl:px-4 py-2 rounded-lg hover:bg-gray-50 transition-all cursor-pointer">
                  <span className="text-gray-700 text-sm xl:text-base">Welcome </span>
                  <h2 className="text-red-500 font-bold ml-1 text-sm xl:text-base truncate max-w-[120px]">{user.fullName}</h2>
                </div>
              </Link>
              <Button onClick={handleLogout} className="bg-blue-600 border-none hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all text-sm xl:text-base px-3 xl:px-4">
                Đăng xuất
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 xl:space-x-4">
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors text-sm xl:text-base">
                Đăng nhập
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 border-none hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all text-sm xl:text-base px-3 xl:px-4">
                  Đăng ký ngay
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
          <div className="px-4 py-6 space-y-4">
            {/* Navigation Links */}
            <div className="space-y-3">
              <Link 
                to="/" 
                className={`block py-2 ${location.pathname === '/' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link 
                to="/services" 
                className={`block py-2 ${location.pathname.includes('/services') ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dịch vụ
              </Link>
              <Link 
                to="/doctors" 
                className={`block py-2 ${location.pathname.includes('/doctors') ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Bác sĩ
              </Link>
              <Link 
                to="/blog" 
                className={`block py-2 ${location.pathname.includes('/blog') ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/booking" 
                className={`block py-2 ${location.pathname === '/booking' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Đặt lịch
              </Link>
            </div>

            {/* User Section - Mobile */}
            <div className="border-t border-gray-200 pt-4">
              {user ? (
                <div className="space-y-3">
                  <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)}>
                    <div className="flex items-center py-2">
                      <span className="text-gray-700">Welcome </span>
                      <h2 className="text-red-500 font-bold ml-1">{user.fullName}</h2>
                    </div>
                  </Link>
                  <Button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }} 
                    className="w-full bg-blue-600 border-none hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link 
                    to="/login" 
                    className="block text-blue-600 font-semibold hover:text-blue-800 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 border-none hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
                      Đăng ký ngay
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
