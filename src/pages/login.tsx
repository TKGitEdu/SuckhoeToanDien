// src/pages/LoginPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Giả lập API call
      console.log("Login data:", data);
      
      // Giả lập đăng nhập thành công
      setTimeout(() => {
        localStorage.setItem('token', 'sample-jwt-token');
        localStorage.setItem('userRole', 'patient'); // Có thể là 'doctor' hoặc 'admin'
        navigate('/');
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
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
              <h1 className="text-3xl font-bold mb-4">Chào mừng quay trở lại</h1>
              <p className="mb-6">
                Đăng nhập để tiếp tục hành trình mang lại hạnh phúc gia đình của bạn cùng FertilityCare
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Login Form - Right */}
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
            <h2 className="text-2xl font-bold text-gray-900 mt-6">Đăng nhập</h2>
            <p className="text-gray-600 mt-2">
              Vui lòng đăng nhập để truy cập vào tài khoản của bạn
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <div>
                <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                <div className="flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6168 0 3.1013.5978 4.226 1.5788l3.2112-3.211C17.9656 1.8443 15.1623 1 12 1 7.6995 1 3.9856 3.2936 1.9304 6.6951l3.7682 2.8971C6.4958 6.8743 9.0158 5 12 5z"
                    />
                    <path
                      fill="#34A853"
                      d="M23 12c0-.8583-.0688-1.685-.2005-2.4782H12v4.7471h6.1918c-.2602 1.409-1.0518 2.6052-2.2388 3.4033l3.6096 2.7704C21.6112 18.022 23 15.2755 23 12z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6986 14.0829l-3.7682 2.897C3.0794 20.2153 7.1937 23 12 23c3.1623 0 5.8302-.8314 7.7713-2.2479l-3.6096-2.7704c-1.007.6739-2.2964 1.0717-4.1617 1.0717-3.0167 0-5.5788-2.0444-6.4788-4.7855z"
                    />
                    <path
                      fill="#4285F4"
                      d="M12 19.0535c3.0167 0 5.5788-2.0444 6.4788-4.7855.07-.2108.1324-.4265.1872-.6446H12V8.8468h11.7995C23.9312 10.315 24 11.1417 24 12c0 6.6273-5.3727 12-12 12-4.8063 0-8.9206-2.7847-10.9304-6.8201l3.7682-2.897C5.5401 17.0091 8.4833 19.0535 12 19.0535z"
                    />
                  </svg>
                  Google
                </div>
              </button>

              <button
                type="button"
                className="w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                <div className="flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#1877F2"
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                  Facebook
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
