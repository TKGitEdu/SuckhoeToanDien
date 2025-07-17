import axiosClient from "../axiosClient";

export type ExaminationBooking = {
  bookingId: string;
  dateBooking: string;
  description: string;
  note: string;
};

export type ExaminationResponse = {
  examinationId: string;
  bookingId: string;
  examinationDate: string;
  examinationDescription: string;
  result: string;
  status: string;
  note: string;
  createAt: string;
  booking: ExaminationBooking;
};

export const ExaminationAPI = {
  getAllExaminations : async (): Promise<ExaminationResponse[]> => {
    return await axiosClient.get("/api/Examination");
  },
};
