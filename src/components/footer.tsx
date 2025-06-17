import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-50 border-t border-blue-100">
      <div className="px-6 py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Logo & About */}
          <div className="md:col-span-1">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">FertilityCare</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              Chuyên cung cấp dịch vụ điều trị hiếm muộn chất lượng cao, với đội ngũ bác sĩ chuyên môn sâu và trang thiết bị hiện đại, mang lại cơ hội làm cha mẹ cho mọi gia đình.
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="#" className="text-blue-600 hover:text-blue-800">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Dịch vụ của chúng tôi</h3>
            <ul className="space-y-2 text-md text-gray-600">
              <li>
                <Link to="/services" className="transition-colors hover:text-blue-600">
                  Thụ tinh trong tử cung (IUI)
                </Link>
              </li>
              <li>
                <Link to="/services" className="transition-colors hover:text-blue-600">
                  Thụ tinh trong ống nghiệm (IVF)
                </Link>
              </li>
              <li>
                <Link to="/services" className="transition-colors hover:text-blue-600">
                  Bảo quản trứng và tinh trùng
                </Link>
              </li>
              <li>
                <Link to="/services" className="transition-colors hover:text-blue-600">
                  Tư vấn di truyền
                </Link>
              </li>
              <li>
                <Link to="/services" className="transition-colors hover:text-blue-600">
                  Khám và điều trị vô sinh
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Liên kết nhanh</h3>
            <ul className="space-y-2 text-md text-gray-600">
              <li>
                <Link to="/" className="transition-colors hover:text-blue-600">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="transition-colors hover:text-blue-600">
                  Đội ngũ bác sĩ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="transition-colors hover:text-blue-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/booking" className="transition-colors hover:text-blue-600">
                  Đặt lịch hẹn
                </Link>
              </li>
              <li>
                <Link to="/login" className="transition-colors hover:text-blue-600">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link to="/register" className="transition-colors hover:text-blue-600">
                  Đăng ký
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Liên hệ</h3>
            <ul className="space-y-3 text-md text-gray-600">
              <li className="flex items-start gap-2">
                <MapPin className="text-blue-600 mt-1 flex-shrink-0" size={16} />
                <span>123 Đường Sức Khỏe, Quận 10, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="text-blue-600 flex-shrink-0" size={16} />
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="text-blue-600 flex-shrink-0" size={16} />
                <span>info@fertilitycare.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-blue-200">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} FertilityCare. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex mt-4 space-x-6 md:mt-0">
              <Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-blue-600">
                Chính sách bảo mật
              </Link>
              <Link to="/terms-of-service" className="text-sm text-gray-600 hover:text-blue-600">
                Điều khoản dịch vụ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
