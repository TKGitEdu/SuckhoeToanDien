import axiosClient from "../axiosClient";

// Define interface for patient details
export interface PatientDetails {
  patientId: string;
  name: string;
  age: number;
  gender: string;
  medicalHistory: string[];
  appointmentReason: string;
}

// Define interface for booking details
export interface BookingDetails {
  bookingId: string;
  patientId: string;
  doctorId: string;
  serviceId: string;
  serviceName: string;
  patientName: string;
  status: string;
  date: string;
  time: string;
}

// Define interface for examination data
export interface ExaminationData {
  bookingId: string;
  patientId: string;
  doctorId: string;
  description: string;
  result: string;
  status: string;
}

// Define interface for treatment plan data
export interface TreatmentPlanData {
  patientId: string;
  doctorId: string;
  method: string;
  status: string;
  description: string;
}

// Define interface for treatment process data
export interface TreatmentProcesses {
  doctorId: string;
  patientId: string;
  treatmentPlanId: string;
  processDate: string;
  result: string;
  status: string;
}

// Get booking details by ID
export const getBookingById = async (bookingId: string): Promise<BookingDetails> => {
  try {
    const response = await axiosClient.get(`/api/DoctorPatients/bookings/${bookingId}`);
    return response.data || response;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    throw error;
  }
};

// Get patient details by ID
export const getPatientDetailsById = async (patientId: string): Promise<PatientDetails> => {
  try {
    const response = await axiosClient.get(`/api/DoctorPatients/patients/${patientId}`);
    return response.data || response;
  } catch (error) {
    console.error("Error fetching patient details:", error);
    throw error;
  }
};

// Create new examination record
export const createExamination = async (data: ExaminationData): Promise<any> => {
  try {
    const response = await axiosClient.post('/api/DoctorPatients/examinations', data);
    return response;
  } catch (error) {
    console.error("Error creating examination record:", error);
    throw error;
  }
};
// get all treatment plans 
export const getAllTreatmentPlans = async (): Promise<TreatmentPlanData[]> => {
  try {
    const response = await axiosClient.get('/api/DoctorPatients/treatment-plans');
    return response.data || response;
  } catch (error) {
    console.error("Error fetching treatment plans:", error);
    throw error;
  }
};

// Create new treatment plan
export const createTreatmentPlan = async (data: TreatmentPlanData): Promise<any> => {
  try {
    const response = await axiosClient.post('/api/DoctorPatients/treatment-plans', data);
    return response;
  } catch (error) {
    console.error("Error creating treatment plan:", error);
    throw error;
  }
};

// Add new treatment process
export const addNewTreatmentProcesses = async (record: TreatmentProcesses): Promise<TreatmentProcesses> => {
  try {
    const response = await axiosClient.post('/api/DoctorPatients/treatment-record', record);
    return response.data || response;
  } catch (error) {
    console.error("Error adding treatment process:", error);
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId: string, status: string): Promise<any> => {
  try {
    const response = await axiosClient.put(`/api/DoctorPatients/bookings/${bookingId}/status`, { status });
    return response;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
};
