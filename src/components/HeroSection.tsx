import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import vaccineImage from "../assets/xxx.jpg";

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-blue-100 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            className="md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Mang lại cơ hội làm cha mẹ cho mọi gia đình
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Với đội ngũ bác sĩ chuyên môn cao và trang thiết bị hiện đại, chúng
              tôi cung cấp các giải pháp điều trị hiếm muộn hiệu quả, mang lại hạnh
              phúc trọn vẹn cho gia đình bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/booking">
                <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all">
                  Đặt lịch ngay
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" className="px-6 py-3 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                  Tìm hiểu dịch vụ
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src={vaccineImage}
              alt="Happy family"
              className="rounded-xl shadow-2xl w-full h-auto"
            />
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">5000+</p>
            <p className="text-gray-600">Bệnh nhân tin tưởng</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">1000+</p>
            <p className="text-gray-600">Ca điều trị thành công</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">20+</p>
            <p className="text-gray-600">Bác sĩ chuyên môn</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">15+</p>
            <p className="text-gray-600">Năm kinh nghiệm</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

// export default function HeroSection() {
//   return (
//     <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 px-6 md:px-20">
//       <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        
//         {/* PHẦN VĂN BẢN BÊN TRÁI */}
//         <div className="md:w-1/2 text-center md:text-left">
//           <h1 className="text-4xl md:text-5xl font-bold text-blue-800 leading-tight">
//             Hệ thống quản lý cơ sở tiêm chủng
//           </h1>
//           <p className="mt-4 text-lg text-gray-700">
//             Theo dõi lịch tiêm, quản lý mũi tiêm và hồ sơ sức khoẻ trẻ em một cách dễ dàng và chính xác.
//           </p>
//           <div className="mt-8 flex justify-center md:justify-start gap-4">
//             <a
//               href="/login"
//               className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
//             >
//               Đăng nhập hệ thống
//             </a>
//             <a
//               href="/about"
//               className="text-blue-700 hover:underline font-medium py-3 px-6"
//             >
//               Tìm hiểu thêm
//             </a>
//           </div>
//         </div>

//         {/* PHẦN HÌNH ẢNH BÊN PHẢI */}
//         <div className="md:w-1/2 flex justify-center">
//           <img
//             src={vaccineImage} 
//             alt="Vaccine illustration"
//             className="w-max h-auto "
//           />
//         </div>
//       </div>
//     </section>
//   )
// }


