import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "./ui/button";

const RegisterSuccess = () => {

  
const location = useLocation();
  const message = location.state?.message;
       return(
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:block md:w-1/2 bg-blue-600">
        <div className="h-full w-full bg-[url('/src/assets/xxx.jpg')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-blue-900/40 flex flex-col justify-center items-center text-white p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-md text-center"
            >
              <h1 className="text-3xl font-bold mb-4">Bắt đầu hành trình làm cha mẹ</h1>
              <p className="mb-6">
                Tạo tài khoản để tiếp cận các dịch vụ điều trị hiếm muộn chuyên nghiệp từ FertilityCare
              </p>
            </motion.div>
          </div>
        </div>
      </div>
       <div className="flex-1 flex items-center justify-center p-8">
<div className=" items-center justify-center p-8">
  <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-2xl font-bold text-blue-600">
                FertilityCare
              </h1>
            </Link>
            <p className="text-gray-600 text-md mt-2">
              Chúc mừng bạn đã đăng kí vào FertilityCare thành công.
            </p>
          </div>
  <div className="flex flex-col items-center bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full">

    <Check size={100} className="text-green-500 mb-4" />
    {message && <div> 
   <p className="text-green-600 text-3xl mt-4 mb-8">{message}</p>
   </div>}
    <Link to="/login" className="w-full">
      <Button className="w-full bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl">
        Đăng nhập
      </Button>
    </Link>
  </div>
</div>

      </div>
    </div>
       )
};
export default RegisterSuccess;