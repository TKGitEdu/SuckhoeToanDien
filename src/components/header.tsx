import { useState } from "react";
import { Syringe, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

const Header: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
          <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
            Đăng nhập
          </Link>
          <Link to="/register">
            <Button className="bg-blue-600 border-none hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
              Đăng ký ngay
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-gray-500 hover:text-blue-600 focus:outline-none">
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
