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

type RegisterPayload = {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  gender: string;
  dateOfBirth: string; 
};



export const authApi = {
  login: async (data: LoginPayload) =>{ 
   const response:LoginResponse  = await axiosClient.post("api/Auth/login", data)
    localStorage.setItem("accessToken", response.token);
    localStorage.setItem("userInfo", JSON.stringify(response.user));

    return response.user;

  },
  register: async (data: RegisterPayload) => {
    const response = await axiosClient.post("api/Auth/register", data);
    return response; 
  },

};
