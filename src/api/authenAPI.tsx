import axiosClient from "./axiosClient";


type LoginPayload = {
  username: string;
  password: string;
};

type User = {
  userId: string;
  fullName: string;
  email: string;
  username: string;
  roleId: string;
  role: {
    roleName: string;
  };
};

type LoginResponse = {
  token: string;
  user: User;
};

export const authApi = {
  login: async (data: LoginPayload) =>{ 
   const response:LoginResponse  = await axiosClient.post("api/Auth/login", data)
    localStorage.setItem("accessToken", response.token);
    localStorage.setItem("userInfo", JSON.stringify(response.user));

    return response.user;

  }
//   register: (data: any) => axiosClient.post("/auth/register", data),
//   logout: () => axiosClient.post("/auth/logout")
};
