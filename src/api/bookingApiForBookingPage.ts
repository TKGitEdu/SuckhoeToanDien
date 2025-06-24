//src/api/bookingApiForBookingPage.ts
import axios from 'axios';

// Tạo instance axios với cấu hình xác thực
const bookingAxios = axios.create({
  baseURL: 'https://localhost:7147',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Thêm interceptor để gắn token vào request
bookingAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interfaces based on API responses
export interface Service {
  serviceId: string;
  name: string;
  description: string;
  price: number;
  status: string;
  category: string;
  booking?: BookingBasic;
}

export interface Doctor {
  doctorId: string;
  userId: string;
  doctorName: string;
  specialization: string;
  phone: string;
  email: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  user?: {
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    username: string;
    gender: string;
  };
  bookings?: BookingBasic[];
}

export interface Slot {
  slotId: string;
  slotName: string;
  startTime: string;
  endTime: string;
  bookings?: BookingBasic[];
}

// Basic booking information returned in other entity responses
export interface BookingBasic {
  bookingId: string;
  dateBooking: string;
  description: string;
  note: string;
}

// Booking creation request payload
export interface BookingRequest {
  patientId: string;
  serviceId: string;
  paymentId: string;
  doctorId: string;
  slotId: string;
  dateBooking: string;
  description: string;
  note: string;
}

// Full booking response
export interface BookingResponse {
  bookingId: string;
  patientId: string;
  serviceId: string;
  paymentId: string;
  doctorId: string;
  slotId: string;
  dateBooking: string;
  description: string;
  note: string;
  createAt: string;
  doctor?: Doctor;
  service?: Service;
  slot?: Slot;
}

// Availability check response
export interface AvailabilityResponse {
  isAvailable: boolean;
  message?: string;
}

// API functions for booking page
export const bookingApiForBookingPage = {
  // Service-related functions
  getAllServices: async (): Promise<Service[]> => {
    try {
      const response = await bookingAxios.get<Service[]>('/api/Service');
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  getServiceById: async (serviceId: string): Promise<Service> => {
    try {
      const response = await bookingAxios.get<Service>(`/api/Service/${serviceId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching service with ID ${serviceId}:`, error);
      throw error;
    }
  },

  // Doctor-related functions
  getAllDoctors: async (): Promise<Doctor[]> => {
    try {
      const response = await bookingAxios.get<Doctor[]>('/api/Doctor');
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  },

  getDoctorById: async (doctorId: string): Promise<Doctor> => {
    try {
      const response = await bookingAxios.get<Doctor>(`/api/Doctor/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching doctor with ID ${doctorId}:`, error);
      throw error;
    }
  },

  // Slot-related functions
  getAllSlots: async (): Promise<Slot[]> => {
    try {
      const response = await bookingAxios.get<Slot[]>('/api/Slot');
      return response.data;
    } catch (error) {
      console.error('Error fetching slots:', error);
      throw error;
    }
  },

  getAvailableSlots: async (doctorId: string, date: string): Promise<Slot[]> => {
    try {
      const response = await bookingAxios.get<Slot[]>('/api/Slot/available', {
        params: { doctorId, date }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching available slots for doctor ${doctorId} on ${date}:`, error);
      throw error;
    }
  },

  // Booking-related functions
  createBooking: async (bookingData: BookingRequest): Promise<BookingResponse> => {
    try {
      const response = await bookingAxios.post<BookingResponse>('/api/Booking', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  checkBookingAvailability: async (doctorId: string, slotId: string, date: string): Promise<AvailabilityResponse> => {
    try {
      const response = await bookingAxios.get<AvailabilityResponse>('/api/Booking/check-availability', {
        params: { doctorId, slotId, date }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking booking availability:', error);
      throw error;
    }
  }
  
};