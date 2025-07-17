import axiosClient from "../axiosClient";

export type PaymentBooking = {
  bookingId: string;
  dateBooking: string;
};

export type Payment = {
  paymentId: string;
  bookingId: string;
  totalAmount: number;
  status: string;
  method: string;
  confirmed: boolean;
  booking: PaymentBooking;
};

export type GetAllPaymentResponse = {
  success: boolean;
  payments: Payment[];
};

export const paymentAPI = {
  getAllPayment: async (): Promise<Payment[]> => {
    const res: GetAllPaymentResponse = await axiosClient.get("/api/Payment");
    return res.payments;
  },
};
