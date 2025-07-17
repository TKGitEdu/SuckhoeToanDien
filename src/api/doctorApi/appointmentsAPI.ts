// File: src/api/doctorApi/appointmentsAPI.ts
import axios from "axios";
import type { Booking } from "../patientApi/bookingAPI";

// Axios instance for doctor appointments API
const appointmentsAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
appointmentsAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interface for the booking confirmation data
interface BookingConfirmationData {
  doctorId: string;
  serviceId: string;
  slotId: string;
  dateBooking: string;
  description: string;
  note: string;
  status: string;
}

/**
 * Confirm a booking by updating its status to "confirmed"
 * IMPORTANT: This function preserves all original booking details (date, time, service, slot)
 * and only updates the status field to "confirmed"
 * 
 * @param bookingId The ID of the booking to confirm
 * @param bookingData The original booking data (only status will be modified)
 * @returns The updated booking information
 */
export const confirmBooking = async (bookingId: string, bookingData: BookingConfirmationData): Promise<Booking> => {
  try {
    // Log the confirmation data to verify we're not changing date/time/service/slot
    console.log("Sending confirmation with preserved original data:", {
      bookingId,
      dateBooking: bookingData.dateBooking,
      serviceId: bookingData.serviceId,
      slotId: bookingData.slotId,
      newStatus: "confirmed"
    });
    
    // Make the API request, ensuring we send all original data with only status modified
    const response = await appointmentsAxios.put(
      `/api/DoctorDashBoard/booking/${bookingId}`,
      {
        ...bookingData,  // Keep all original booking data
        status: "confirmed"  // Only update the status field
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xác nhận lịch hẹn ${bookingId}:`, error);
    throw error;
  }
};

// Interface for changing appointment status (cancel or reschedule)
interface BookingStatusChangeData {
  doctorId: string;
  status: "cancelled" | "rescheduled";
  note: string;
  newDate?: string;
  newSlotId?: string;
}

/**
 * Cancel a booking by updating its status to "cancelled"
 * 
 * @param bookingId The ID of the booking to cancel
 * @param doctorId The ID of the doctor cancelling the booking
 * @param note Optional note about why the appointment was cancelled
 * @returns The result of the cancellation operation
 */
export const cancelBooking = async (
  bookingId: string, 
  doctorId: string, 
  note: string = "Lịch hẹn đã bị hủy bởi bác sĩ"
): Promise<any> => {
  try {
    console.log("Sending cancellation request:", {
      bookingId,
      doctorId,
      status: "cancelled",
      note
    });
    
    const cancelData: BookingStatusChangeData = {
      doctorId,
      status: "cancelled",
      note
    };
    
    const response = await appointmentsAxios.put(
      `/api/DoctorDashBoard/booking/${bookingId}/change-status`,
      cancelData
    );
    
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi hủy lịch hẹn ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Reschedule a booking by updating its status to "rescheduled" and providing new date and slot
 * 
 * @param bookingId The ID of the booking to reschedule
 * @param doctorId The ID of the doctor rescheduling the booking
 * @param newDate The new date for the appointment (ISO string format)
 * @param newSlotId The ID of the new time slot
 * @param note Optional note about why the appointment was rescheduled
 * @returns The result of the rescheduling operation
 */
export const rescheduleBooking = async (
  bookingId: string,
  doctorId: string,
  newDate: string,
  newSlotId: string,
  note: string = "Lịch hẹn đã được lên lịch lại bởi bác sĩ"
): Promise<any> => {
  try {
    console.log("Sending reschedule request:", {
      bookingId,
      doctorId,
      status: "rescheduled",
      newDate,
      newSlotId,
      note
    });
    
    const rescheduleData: BookingStatusChangeData = {
      doctorId,
      status: "rescheduled",
      note,
      newDate,
      newSlotId
    };
    
    const response = await appointmentsAxios.put(
      `/api/DoctorDashBoard/booking/${bookingId}/change-status`,
      rescheduleData
    );
    
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi đổi lịch hẹn ${bookingId}:`, error);
    throw error;
  }
};
// các hàm nằm ở line < 165 đã đúng yêu cầu không chỉnh sửa.

/**
 * Interface for Booking inside a Slot
 */
interface SlotBooking {
  bookingId: string;
  dateBooking: string;
  description: string;
  note: string;
}

/**
 * Interface for Slot data
 */
export interface Slot {
  slotId: string;
  slotName: string;
  startTime: string;
  endTime: string;
  bookings: SlotBooking[];
}

/**
 * Get all available slots and their associated bookings
 * @returns An array of slot objects
 */
export const getAllSlots = async (): Promise<Slot[]> => {
  try {
    const response = await appointmentsAxios.get('/api/Slot');
    console.log('Fetched slots data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách slot:', error);
    throw error;
  }
};