// src/utils/auth.ts
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userInfo");
};
