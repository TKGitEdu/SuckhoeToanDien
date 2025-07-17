import axiosClient from "../axiosClient";


type User = {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  username: string;
  gender: string;
};

type Booking = {
  bookingId: string;
  dateBooking: string;
  description: string;
  note: string;
};

type PatientDetail = {
  patientDetailId: string;
  patientId: string;
  treatmentStatus: string;
  patient: null;
};

export type Patient = {
  patientId: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  bloodType: string;
  emergencyPhoneNumber: string;
  user: User;
  booking: Booking;
  patientDetails: PatientDetail[];
};

export type PatientUpdateRequest = {
  patientId: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  bloodType: string;
  emergencyPhoneNumber: string;
}



export const patientAPI = {
   getAllPatient: async (): Promise<Patient[]> => {
    return await axiosClient.get("/api/Patient"); 
  },
  getById: async (patientId: string): Promise<Patient> => {
    return await axiosClient.get(`/api/Patient/${patientId}`);
  },

  updatePatient: async ( patientData: Partial<PatientUpdateRequest>): Promise<void> => {
    return await axiosClient.put(`/api/Patient/Update/`, patientData);
  },

  deletePatient: async (patientId: string): Promise<void> => {
    return await axiosClient.delete(`/api/Patient/Delete/${patientId}`);
  }
}
