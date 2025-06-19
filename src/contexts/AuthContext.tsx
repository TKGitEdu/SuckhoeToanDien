// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../lib/api-axios';

// Import các interfaces từ api-axios.ts
// Hoặc re-define chúng ở đây
interface Role {
  roleId: string | null;
  roleName: string;
}

interface User {
  userId: string;
  fullName: string;
  email: string;
  phone: string | null;
  username: string;
  roleId: string;
  address: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  role: Role;
  doctor: any | null;
  patients: any[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<{ user: User; token: string }>;
  logout: () => Promise<void>;
  refreshAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  login: async () => ({ user: {} as User, token: '' }),
  logout: async () => {},
  refreshAuthStatus: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hàm kiểm tra trạng thái xác thực
  const refreshAuthStatus = async () => {
    try {
      setLoading(true);
      
      // Kiểm tra token hiện tại có hợp lệ không
      const isValid = await authApi.checkAuth();
      
      if (isValid) {
        // Nếu token hợp lệ, lấy thông tin user từ localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser) as User;
          setUser(userData);
          setIsAuthenticated(true);
          console.log('AuthContext: Xác thực thành công');
        } else {
          // Nếu token hợp lệ nhưng không có thông tin user
          // (Trường hợp hiếm gặp, có thể xảy ra nếu localStorage bị xóa một phần)
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('token'); // Xóa token vì không có user tương ứng
          console.log('AuthContext: Token hợp lệ nhưng không có thông tin user');
        }
      } else {
        // Token không hợp lệ hoặc đã hết hạn
        setIsAuthenticated(false);
        setUser(null);
        // Xóa dữ liệu đăng nhập cũ
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        console.log('AuthContext: Token không hợp lệ hoặc đã hết hạn');
      }
      
      setError(null);
    } catch (err) {
      console.error('AuthContext: Lỗi khi kiểm tra xác thực', err);
      setIsAuthenticated(false);
      setUser(null);
      setError('Không thể kiểm tra trạng thái xác thực');
      
      // Xóa dữ liệu đăng nhập do lỗi
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra xác thực khi component mount
  useEffect(() => {
    refreshAuthStatus();
  }, []);

  // Hàm login
  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('AuthContext: Đang đăng nhập...');
      const response = await authApi.login(username, password);
      
      // Lưu thông tin vào localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('userRole', response.user.role.roleName);
      
      // Cập nhật state
      setUser(response.user);
      setIsAuthenticated(true);
      console.log('AuthContext: Đăng nhập thành công');
      
      return response;
    } catch (err: any) {
      console.error('AuthContext: Lỗi đăng nhập', err);
      const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Hàm logout
  const logout = async () => {
    try {
      setLoading(true);
      console.log('AuthContext: Đang đăng xuất...');
      
      // Xóa state trước để UI cập nhật ngay lập tức
      setIsAuthenticated(false);
      setUser(null);
      
      // Xóa dữ liệu từ localStorage
      ['token', 'user', 'userRole'].forEach(item => localStorage.removeItem(item));
      
      // Gọi API logout (không chờ response để tránh treo UI)
      await authApi.logout();
      console.log('AuthContext: Đăng xuất thành công');
    } catch (err) {
      console.error('AuthContext: Lỗi khi đăng xuất', err);
      // Không throw error vì đã xóa state và localStorage
    } finally {
      setLoading(false);
    }
  };

  // Giá trị context
  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    refreshAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);