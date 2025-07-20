import { Syringe, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const getDashboardLink = () =>
    user
      ? user.roleId === "ROLE_1"
        ? "/admin/dashboard"
        : user.roleId === "ROLE_2"
        ? "/doctor/dashboard"
        : "/patient/dashboard"
      : "/patient/dashboard";

  // Generate avatar placeholder from user's fullName
  const getAvatarInitial = () =>
    user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U";

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="group">
            <div className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Syringe className="w-7 h-7 text-white" />
            </div>
          </Link>
          <Link to="/">
            <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight group-hover:text-blue-700 transition-colors">
              FertilityCare
            </span>
          </Link>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex space-x-8">
          {["/", "/services", "/doctors", "/blog", "/booking"].map((path, index) => (
            <Link
              key={index}
              to={path}
              className={`relative text-base font-medium ${
                location.pathname === path || (path !== "/" && location.pathname.includes(path))
                  ? "text-blue-700"
                  : "text-gray-600"
              } hover:text-blue-700 transition-colors duration-200`}
            >
              {path === "/" ? "Trang chủ" :
               path === "/services" ? "Dịch vụ" :
               path === "/doctors" ? "Bác sĩ" :
               path === "/blog" ? "Blog" : "Đặt lịch"}
              <span className={`absolute left-0 bottom-0 w-full h-0.5 bg-blue-700 transform ${
                location.pathname === path || (path !== "/" && location.pathname.includes(path))
                  ? "scale-x-100"
                  : "scale-x-0"
              } origin-left transition-transform duration-200 group-hover:scale-x-100`}></span>
            </Link>
          ))}
        </nav>

        {/* User Section - Desktop */}
        <div className="hidden lg:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to={getDashboardLink()}>
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                    {getAvatarInitial()}
                  </div>
                  <span className="text-gray-700 text-sm truncate max-w-[100px]">{user.fullName}</span>
                </div>
              </Link>
              <Button
                onClick={handleLogout}
                className="bg-blue-600 hover:bg-blue-700 text-sm px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Đăng xuất
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-blue-700 font-semibold text-sm hover:text-blue-800 transition-colors duration-200"
              >
                Đăng nhập
              </Link>
              <Link to="/register">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-sm px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Đăng ký ngay
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-6">
              {/* Navigation Links */}
              <div className="space-y-2">
                {["/", "/services", "/doctors", "/blog", "/booking"].map((path, index) => (
                  <Link
                    key={index}
                    to={path}
                    className={`block py-3 px-4 text-base font-medium border-l-4 ${
                      location.pathname === path || (path !== "/" && location.pathname.includes(path))
                        ? "text-blue-700 border-blue-700 bg-blue-50"
                        : "text-gray-600 border-transparent hover:bg-gray-50"
                    } transition-all duration-200`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {path === "/" ? "Trang chủ" :
                     path === "/services" ? "Dịch vụ" :
                     path === "/doctors" ? "Bác sĩ" :
                     path === "/blog" ? "Blog" : "Đặt lịch"}
                  </Link>
                ))}
              </div>

              {/* User Section - Mobile */}
              <div className="border-t border-gray-200 pt-4">
                {user ? (
                  <div className="space-y-4">
                    <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)}>
                      <div className="flex items-center py-3 px-4 bg-blue-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium mr-2">
                          {getAvatarInitial()}
                        </div>
                        <span className="text-gray-700 font-medium truncate">{user.fullName}</span>
                      </div>
                    </Link>
                    <Button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-base py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Đăng xuất
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Link
                      to="/login"
                      className="block py-3 px-4 text-base font-semibold text-blue-700 hover:bg-blue-50 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-base py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        Đăng ký ngay
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;