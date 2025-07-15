import axiosClient from "../axiosClient";

export type TreatmentMedication = {
  medicationId: string;
  treatmentPlanId: string;
  drugType: string;
  drugName: string;
  description: string;
  treatmentPlan: any | null;
};

export const TreatmentMedicationAPI = {
  getAllMedications: async (): Promise<TreatmentMedication[]> => {
    return await axiosClient.get("/api/Medical/treatment-medications"); 
  },
}