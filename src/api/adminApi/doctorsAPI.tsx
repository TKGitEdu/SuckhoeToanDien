import axiosClient from "../axiosClient";
type Booking = {
  bookingId: string;
  dateBooking: string;
  description: string;
  note: string;
};

type Doctor = {
  doctorId: string;
  doctorName: string;
  specialization: string;
  phone: string;
  email: string;
  user: {
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
  updateDoctor: async (doctorId: string, doctorData: Partial<Doctor>): Promise<Doctor> => {
    return await axiosClient.put(`/api/Doctor/Update/${doctorId}`, doctorData);
  }


}
