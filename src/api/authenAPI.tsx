import axiosClient from "./axiosClient";


type LoginPayload = {
  username: string;
  password: string;
};


export interface LoginResponse {
  token: string;
  doctorId?: string | null;
  patientId?: string | null;
  user: {
    userId: string;
    fullName: string;
    username: string;
    role: {
      roleName: string;
    };
  };
}


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
    localStorage.setItem("doctorId", response.doctorId || "");
    localStorage.setItem("patientId", response.patientId || "");
    localStorage.setItem("userInfo", JSON.stringify(response.user));

    return response.user;

  },
  register: async (data: RegisterPayload) => {
    const response = await axiosClient.post("api/Auth/register", data);
    return response; 
  },

};
