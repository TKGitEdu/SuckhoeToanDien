import axiosClient from "../axiosClient";

// Type definitions
export type Doctor = {
  doctorId: string;
  userId: string;
  doctorName: string;
  specialization: string;
  phone: string;
  email: string;
};

export type Patient = {
  patientId: string;
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
};

export type Payment = any; // Update if needed

export type Service = {
  serviceId: string;
  name: string;
  description: string;
  price: number;
  status: string;
  category: string;
};

export type Slot = {
  slotId: string;
  slotName: string;
  startTime: string;
  endTime: string;
};

export type BookingResponse = {
  bookingId: string;
  patientId: string;
  serviceId: string;
  paymentId: string | null;
  doctorId: string;
  slotId: string;
  dateBooking: string;
  description: string;
  note: string;
  createAt: string;
  status: string;
  doctor: Doctor;
  patient: Patient;
  payment: Payment | null;
  service: Service;
  slot: Slot;
  examinations: any[];
};

export const BookingAPI = {
  getAllBookings: async (): Promise<BookingResponse[]> => {
    return await axiosClient.get("/api/Booking/all");
  },
  getBookingById: async (bookingId: string): Promise<BookingResponse> => {
    return await axiosClient.get(`/api/Booking/details/${bookingId}`);
  },

  cancelBooking : async (bookingId: string): Promise<void> => {
    return await axiosClient.delete(`/api/Booking/cancel/${bookingId}`);
  }
}