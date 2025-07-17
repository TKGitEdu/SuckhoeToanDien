import axiosClient from "../axiosClient";

export type TreatmentMedication = {
  medicationId: string;
  treatmentPlanId: string;
  drugType: string;
  drugName: string;
  description: string;
  treatmentPlan: any | null;
};


export type TreatmentMedicationRequest = {
  medicationId: string;
  treatmentPlanId: string;
  drugType: string;
  drugName: string;
  description: string;
};

export const TreatmentMedicationAPI = {
  getAllMedications: async (): Promise<TreatmentMedication[]> => {
    return await axiosClient.get("/api/Medical/treatment-medications"); 
  },

  createMedication: async (data: TreatmentMedicationRequest): Promise<void> => {
    return await axiosClient.post("/api/Medical/treatment-medications", data);
  },

  getById : async (medicationId: string): Promise<TreatmentMedication> => {
    return await axiosClient.get(`/api/Medical/treatment-medications/${medicationId}`); 
  },

  updateMedcation: async (medicationId: string, data: Partial<TreatmentMedicationRequest>): Promise<TreatmentMedication> => {
    return await axiosClient.put(`/api/Medical/treatment-medications/${medicationId}`, data);
  },

  deleteMedication: async (medicationId: string): Promise<void> => {
    return await axiosClient.delete(`/api/Medical/treatment-medications/${medicationId}`);
  } 
}