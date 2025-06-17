import { useState, useEffect } from "react";
import { Syringe, Menu, X, User, LogOut, Calendar, ClipboardList, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

const Header: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
    window.location.href = '/';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const getDashboardLink = () => {
    switch (userRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'patient':
        return '/patient/dashboard';
      default:
        return '/';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Syringe size={24} className="text-white" />
          </div>
          <Link to="/">
            <span className="text-2xl font-bold text-gray-800">FertilityCare</span>
          </Link>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className={`${location.pathname === '/' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600 transition-colors`}>
            Trang chủ
          </Link>
          <Link to="/services" className={`${location.pathname.includes('/services') ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600 transition-colors`}>
            Dịch vụ
          </Link>
          <Link to="/doctors" className={`${location.pathname.includes('/doctors') ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600 transition-colors`}>
            Bác sĩ
          </Link>
          <Link to="/blog" className={`${location.pathname.includes('/blog') ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600 transition-colors`}>
            Blog
          </Link>
          <Link to="/booking" className={`${location.pathname === '/booking' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-600 transition-colors`}>
            Đặt lịch
          </Link>
        </nav>

        {/* Actions - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors focus:outline-none"
              >
                <User size={20} />
                <span>Tài khoản</span>
              </button>
              
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    to={getDashboardLink()}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <LayoutDashboard size={16} className="mr-2" />
                    Dashboard
                  </Link>
                  {userRole === 'patient' && (
                    <>
                      <Link
                        to="/patient/appointments"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Calendar size={16} className="mr-2" />
                        Lịch hẹn
                      </Link>
                      <Link
                        to="/patient/treatments"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <ClipboardList size={16} className="mr-2" />
                        Điều trị
                      </Link>
                    </>
                  )}
                  {userRole === 'doctor' && (
                    <>
                      <Link
                        to="/doctor/appointments"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Calendar size={16} className="mr-2" />
                        Lịch hẹn
                      </Link>
                      <Link
                        to="/doctor/patients"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <User size={16} className="mr-2" />
                        Bệnh nhân
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link to="/register">
                <Button
                  className="bg-blue-600 border-none hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                >
                  Đăng ký ngay
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-gray-500 hover:text-blue-600 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <Link to="/" className="block py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              Trang chủ
            </Link>
            <Link to="/services" className="block py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              Dịch vụ
            </Link>
            <Link to="/doctors" className="block py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              Bác sĩ
            </Link>
            <Link to="/blog" className="block py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              Blog
            </Link>
            <Link to="/booking" className="block py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              Đặt lịch
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="block py-2 text-base font-medium text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-base font-medium text-red-600 hover:text-red-800"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col space-y-3">
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Đăng ký ngay
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;