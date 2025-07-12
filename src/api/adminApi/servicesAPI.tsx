import axiosClient from "../axiosClient";
 

 
export type Service = {
  serviceId:string;
    name: string;
    description: string;
    price:number;
    status:string;
    category:string;
} 


export const servicesAPI = {
   getAllService: async (): Promise<Service[]> => {
    return await axiosClient.get("/api/Service"); 
  },

  getById: async (id: string): Promise<Service> => {
    return await axiosClient.get(`/api/Service/${id}`);
  },

   create: async (service: Service): Promise<Service> => {
    return await axiosClient.post("/api/Service", service);
  },

   update: async (id: string, updatedService: Service): Promise<Service> => {
    return await axiosClient.put(`/api/Service/${id}`, updatedService);
  },


  delete: async (id: string): Promise<void> => {
    return await axiosClient.delete(`/api/Service/${id}`);
  },

}
