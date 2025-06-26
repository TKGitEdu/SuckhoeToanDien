import axiosClient from "./axiosClient";
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

export const doctorAPI = {
   getAllDoctor: async (): Promise<Doctor[]> => {
    return await axiosClient.get("/api/Doctor"); 
  },
}
