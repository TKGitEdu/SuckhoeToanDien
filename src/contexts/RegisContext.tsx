// src/contexts/RegisContext.tsx
import React, { createContext, useContext, useState } from "react";
import { registerApi } from "../lib/api-axios";
import type { RegisterRequest, RegisterResponse, SimpleRegisterRequest } from "../lib/api-axios";

interface RegisContextType {
  register: (data: RegisterRequest) => Promise<RegisterResponse>;
  registerSimple: (data: SimpleRegisterRequest) => Promise<RegisterResponse>;
  loading: boolean;
  error: string | null;
}

const RegisContext = createContext<RegisContextType>({
  register: async () => {
    return { user: {} as any, token: "" };
  },
  registerSimple: async () => {
    return { user: {} as any, token: "" };
  },
  loading: false,
  error: null
});

export const RegisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
      setLoading(true);
      setError(null);
      console.log("RegisContext: Gọi API đăng ký đầy đủ");

      const response = await registerApi.register(data);
      console.log("RegisContext: Đăng ký thành công, KHÔNG lưu token");
      
      // QUAN TRỌNG: KHÔNG lưu token vào localStorage để tránh tự động đăng nhập
      return response;
    } catch (err: any) {
      console.error("RegisContext: Lỗi đăng ký:", err);
      const msg = err.response?.data?.message || "Đăng ký thất bại";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const registerSimple = async (data: SimpleRegisterRequest): Promise<RegisterResponse> => {
    try {
      setLoading(true);
      setError(null);
      console.log("RegisContext: Gọi API đăng ký đơn giản");

      const response = await registerApi.registerSimple(data);
      console.log("RegisContext: Đăng ký đơn giản thành công, KHÔNG lưu token");
      
      // QUAN TRỌNG: KHÔNG lưu token vào localStorage để tránh tự động đăng nhập
      return response;
    } catch (err: any) {
      console.error("RegisContext: Lỗi đăng ký đơn giản:", err);
      const msg = err.response?.data || err.response?.data?.message || "Đăng ký thất bại";
      setError(typeof msg === 'string' ? msg : "Đăng ký thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisContext.Provider value={{ register, registerSimple, loading, error }}>
      {children}
    </RegisContext.Provider>
  );
};

export const useRegis = () => useContext(RegisContext);
