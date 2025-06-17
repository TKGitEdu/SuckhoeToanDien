// src/pages/RegisterPage.tsx
import Header from "../components/header"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
};

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<FormData>();

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Giả lập API call
      console.log("Registration data:", data);
      
      // Giả lập đăng ký thành công
      setTimeout(() => {
        navigate('/login');
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div>
        <Header></Header>
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Hero Image Section - Left */}
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

      {/* Registration Form - Right */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-2xl font-bold text-blue-600">FertilityCare</h1>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 mt-6">Đăng ký tài khoản</h2>
            <p className="text-gray-600 mt-2">
              Vui lòng điền thông tin để tạo tài khoản mới
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                id="fullName"
                type="text"
                className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Nguyễn Văn A"
                {...register("fullName", { 
                  required: "Họ tên là bắt buộc",
                  minLength: {
                    value: 2,
                    message: "Họ tên phải có ít nhất 2 ký tự"
                  }
                })}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="youremail@example.com"
                {...register("email", { 
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ"
                  }
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                id="phone"
                type="tel"
                className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="0912345678"
                {...register("phone", { 
                  required: "Số điện thoại là bắt buộc",
                  pattern: {
                    value: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
                    message: "Số điện thoại không hợp lệ"
                  }
                })}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="••••••••"
                  {...register("password", { 
                    required: "Mật khẩu là bắt buộc",
                    minLength: {
                      value: 8,
                      message: "Mật khẩu phải có ít nhất 8 ký tự"
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt"
                    }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="••••••••"
                  {...register("confirmPassword", { 
                    required: "Xác nhận mật khẩu là bắt buộc",
                    validate: value => value === password || "Mật khẩu không khớp"
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...register("termsAccepted", { required: "Bạn phải đồng ý với điều khoản dịch vụ" })}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  Tôi đồng ý với{" "}
                  <Link to="/terms-of-service" className="text-blue-600 hover:text-blue-500">
                    Điều khoản dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-500">
                    Chính sách bảo mật
                  </Link>
                </label>
                {errors.termsAccepted && (
                  <p className="mt-1 text-sm text-red-600">{errors.termsAccepted.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
    </div>
  )
}

export default RegisterPage
