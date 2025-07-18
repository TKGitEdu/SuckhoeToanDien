import axiosClient from "../axiosClient";
type Booking = {
  bookingId: string;
  dateBooking: string;
  description: string;
  note: string;
};

 export type Doctor = {
  doctorId: string;
  userId: string;
  doctorName: string;
  specialization: string;
  phone: string;
  email: string;
   address: string;
   gender: string;
  dateOfBirth: string;
  user: {
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
  };
  bookings: Booking[];
};

export type BookingResponse ={
  doctorId: string;
  userId: string;
  doctorName: string;
  specialization: string;
  phone: string;
  email: string;
  gender: string;
  dateofBirth: string;
}


export type CreateDoctorRequest = {
   userId: string;
  doctorName: string;
  specialization: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  address: string;
  gender: string;
}

export type UpdateDoctorRequest = {
  doctorId:string;
   userId: string;
  doctorName: string;
  specialization: string;
  phone: string;
  email: string;
  address: string;
  gender: string;
  dateOfBirth: string;
}




export const doctorAPI = {
   getAllDoctor: async (): Promise<Doctor[]> => {
    return await axiosClient.get("/api/Doctor"); 
  },
  getById: async (doctorId: string): Promise<Doctor> => {
    return await axiosClient.get(`/api/Doctor/${doctorId}`);
  },
  deleteDoctor: async (doctorId: string): Promise<void> => {
    return await axiosClient.delete(`/api/Doctor/Delete/${doctorId}`);
  },
  updateDoctor: async ( doctorData: UpdateDoctorRequest): Promise<void> => {
    return await axiosClient.put(`/api/Doctor/Update`, doctorData);
  },

  createDoctor: async (doctorData: CreateDoctorRequest): Promise<void> => {
    return await axiosClient.post("/api/Doctor/Create", doctorData);
  }

}
