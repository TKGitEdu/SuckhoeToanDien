import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, HelpCircle } from "lucide-react";
import { Button } from "../components/ui/button";

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl font-bold text-blue-600">?</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Trang không tồn tại</h2>
          <p className="text-gray-600 mb-8">
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <Home size={18} />
                Về trang chủ
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-600 flex items-center gap-2">
                <Search size={18} />
                Xem dịch vụ
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Cần hỗ trợ?{" "}
              <Link to="/contact" className="text-blue-600 font-medium hover:underline inline-flex items-center">
                Liên hệ với chúng tôi <HelpCircle size={16} className="ml-1" />
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
