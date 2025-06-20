import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { register as registerUser } from '../lib/api-resgister';
import type { RegisterRequest } from '../lib/api-resgister';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

// Interface for the form data
type RegisterFormData = RegisterRequest & {
  confirmPassword: string;
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch 
  } = useForm<RegisterFormData>();
  
  const password = watch("password");
  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      // Chuyển đổi ngày sang ISO string nếu có
      const formattedData: RegisterRequest = {
        username: data.username,
        password: data.password,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : undefined,
        bloodType: data.bloodType,
        emergencyPhoneNumber: data.emergencyPhoneNumber
      };
      
      // Gọi API đăng ký
      await registerUser(formattedData);
      
      // Hiển thị thông báo thành công
      alert("Đăng ký tài khoản thành công! Vui lòng đăng nhập để tiếp tục.");
      
      // Chuyển hướng đến trang đăng nhập
      navigate("/login");
    } catch (error) {
      // Xử lý lỗi
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra khi đăng ký";
        setError(errorMessage);
      } else {
        setError("Đã có lỗi xảy ra khi đăng ký");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side image */}
      <div className="hidden md:block md:w-1/2 bg-blue-600">
        <div className="h-full w-full bg-[url('/src/assets/vvv.webp')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-blue-900/40 flex flex-col justify-center items-center text-white p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-md text-center"
            >
              <h1 className="text-3xl font-bold mb-4">Bắt đầu hành trình của bạn</h1>
              <p className="mb-6">
                Đăng ký tài khoản bệnh nhân để nhận được sự hỗ trợ tốt nhất từ đội ngũ bác sĩ của chúng tôi
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right side form */}
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
            <h2 className="text-2xl font-bold text-gray-900 mt-6">Đăng ký tài khoản bệnh nhân</h2>
            <p className="text-gray-600 mt-2">
              Vui lòng điền đầy đủ thông tin để tạo tài khoản mới
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="text-red-500 mr-3 h-5 w-5 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Họ và tên */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Nhập họ và tên"                {...register("fullName", { 
                required: "Họ và tên là bắt buộc",
                validate: value => (value && value !== 'string' && value.trim() !== '') || "Vui lòng nhập họ và tên"
              })}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="example@email.com"
                {...register("email", { 
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Địa chỉ email không hợp lệ"
                  },
                  validate: value => (value && value !== 'string' && value.trim() !== '') || "Vui lòng nhập email hợp lệ"
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Tên đăng nhập */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                className={`w-full px-4 py-3 rounded-lg border ${errors.username ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Nhập tên đăng nhập"
                {...register("username", { 
                  required: "Tên đăng nhập là bắt buộc",
                  minLength: {
                    value: 4,
                    message: "Tên đăng nhập phải có ít nhất 4 ký tự"
                  },
                  validate: value => (value && value !== 'string' && value.trim() !== '') || "Vui lòng nhập tên đăng nhập hợp lệ"
                })}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Mật khẩu */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
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

            {/* Xác nhận mật khẩu */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Vui lòng xác nhận mật khẩu",
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

            {/* Số điện thoại */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>              <input
                id="phone"
                type="tel"
                className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="0xxxxxxxxx"
                {...register("phone", { 
                  required: "Số điện thoại là bắt buộc",
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: "Số điện thoại không hợp lệ"
                  },
                  validate: value => (value && value !== 'string' && value.trim() !== '') || "Vui lòng nhập số điện thoại hợp lệ"
                })}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Địa chỉ */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <input
                id="address"
                type="text"
                className={`w-full px-4 py-3 rounded-lg border ${errors.address ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Nhập địa chỉ"
                {...register("address", { required: "Địa chỉ là bắt buộc" })}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            {/* Giới tính */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới tính <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Male"
                    className="h-4 w-4 text-blue-600 border-gray-300"
                    {...register("gender", { required: "Vui lòng chọn giới tính" })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Nam</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Female"
                    className="h-4 w-4 text-blue-600 border-gray-300"
                    {...register("gender", { required: "Vui lòng chọn giới tính" })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Nữ</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Other"
                    className="h-4 w-4 text-blue-600 border-gray-300"
                    {...register("gender", { required: "Vui lòng chọn giới tính" })}
                  />
                  <span className="ml-2 text-sm text-gray-700">Khác</span>
                </label>
              </div>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
              )}
            </div>

            {/* Ngày sinh */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <input
                id="dateOfBirth"
                type="date"
                className={`w-full px-4 py-3 rounded-lg border ${errors.dateOfBirth ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register("dateOfBirth", { required: "Ngày sinh là bắt buộc" })}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
              )}
            </div>

            {/* Số điện thoại khẩn cấp */}
            <div>
              <label htmlFor="emergencyPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại khẩn cấp
              </label>
              <input
                id="emergencyPhoneNumber"
                type="tel"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0xxxxxxxxx"
                {...register("emergencyPhoneNumber", {
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: "Số điện thoại không hợp lệ"
                  }
                })}
              />
              {errors.emergencyPhoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.emergencyPhoneNumber.message}</p>
              )}
            </div>

            {/* Nhóm máu */}
            <div>
              <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                Nhóm máu
              </label>
              <select
                id="bloodType"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("bloodType")}
              >
                <option value="">Chọn nhóm máu</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
              <div className="text-sm text-blue-700">
                <p className="font-medium">Lưu ý:</p>
                <p>Đây là trang đăng ký dành cho bệnh nhân. Tài khoản của bạn sẽ được tự động cấp vai trò Bệnh nhân trong hệ thống.</p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;