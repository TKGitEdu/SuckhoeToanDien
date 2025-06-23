// import axios from 'axios';

// // Tạo instance axios với cấu hình xác thực
// const doctorsAxios = axios.create({
//   baseURL: 'http://localhost:7147',
//   headers: {
//     'Content-Type': 'application/json',
//   }
// });

// // Thêm interceptor để gắn token vào request
// doctorsAxios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Định nghĩa kiểu dữ liệu cho Doctor
// export interface Doctor {
//   id: string;
//   name: string;
//   specialty: string;
//   experience: number;
//   avatar?: string;
//   description?: string;
// }

// // Export doctorsApi object với các phương thức
// export const doctorsApi = {
//   // GET: api/Doctors
//   getAllDoctors: async (): Promise<Doctor[]> => {
//     try {
//       const response = await doctorsAxios.get("api/Doctors");
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching doctors:", error);
//       throw error;
//     }
//   },

//   // GET: api/Doctors/{id}
//   getDoctorById: async (id: string): Promise<Doctor> => {
//     try {
//       const response = await doctorsAxios.get(`api/Doctors/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error fetching doctor with id ${id}:`, error);
//       throw error;
//     }
//   },

//   // GET: api/Doctors/count
//   getDoctorCount: async (): Promise<number> => {
//     try {
//       const response = await doctorsAxios.get("api/Doctors/count");
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching doctor count:", error);
//       throw error;
//     }
//   },
  
//   // GET: api/Doctors/my-doctors
//   getMyDoctors: async (): Promise<Doctor[]> => {
//     try {
//       const response = await doctorsAxios.get("api/Doctors/my-doctors");
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching my doctors:", error);
//       throw error;
//     }
//   }
// };
