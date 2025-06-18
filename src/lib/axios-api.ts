/**
 * API service for making requests to the backend using Axios
 */

import axios from 'axios';

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: '/api', // Using relative path to leverage Vite's proxy
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`, { 
      headers: config.headers, 
      data: config.data ? '(request data)' : undefined 
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and extract tokens
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, {
      status: response.status,
      statusText: response.statusText,
    });

    // Check for authorization header which may contain the token
    const authHeader = response.headers['authorization'];
    if (authHeader) {
      console.log('Authorization header found');
      // Extract and store token if needed
      const newToken = authHeader.replace('Bearer ', '');
      const currentToken = localStorage.getItem('token');
      if (newToken && newToken !== currentToken) {
        localStorage.setItem('token', newToken);
        console.log('New token stored from Authorization header');
      }
    }

    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`API Error ${error.response.status} ${error.response.statusText}:`, {
        url: error.config?.url,
        data: error.response.data,
      });
      
      // Try to get a friendly error message
      let errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
      const data = error.response.data;
      
      if (typeof data === 'string') {
        errorMessage = data;
      } else if (data) {
        if (data.message) errorMessage = data.message;
        else if (data.error) errorMessage = data.error;
        else if (data.title) errorMessage = data.title;
      }
      
      const customError = new Error(errorMessage);
      return Promise.reject(customError);
    } else if (error.request) {
      console.error('API request made but no response received:', error.request);
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    } else {
      console.error('API request setup error:', error.message);
      return Promise.reject(error);
    }
  }
);

// Authentication-specific API methods
const authApi = {
  login: async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post('/Auth/login', { username, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (userData: any) => {
    const response = await axiosInstance.post('/Auth/register', userData);
    return response.data;
  },
  logout: () => {
    // Instead of removing individual items, clear all localStorage completely
    localStorage.clear();
    
    console.log('User logged out, all localStorage data cleared completely');
    
    // Dispatch a custom event to notify components about the logout
    window.dispatchEvent(new Event('storage'));
    
    // Optional: You can also make a server-side logout call if your backend has such an endpoint
    // return axiosInstance.post('/Auth/logout');
  }
};

// Test API connection
const testApi = {
  test: async () => {
    try {
      const response = await axiosInstance.get('/healthcheck');
      return {
        success: true,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      console.error('API connection test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
};

// Users API
const usersApi = {
  getProfile: async () => {
    const response = await axiosInstance.get('/Users/profile');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await axiosInstance.put('/Users/profile', data);
    return response.data;
  }
};

// Services API
const servicesApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/Services');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await axiosInstance.get(`/Services/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await axiosInstance.post('/Services', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await axiosInstance.put(`/Services/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/Services/${id}`);
    return response.data;
  }
};

// Doctors API
const doctorsApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/Doctors');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await axiosInstance.get(`/Doctors/${id}`);
    return response.data;
  }
};

// Appointments API
const appointmentsApi = {
  getMyAppointments: async () => {
    const response = await axiosInstance.get('/Appointments/my');
    return response.data;
  },
  create: async (data: any) => {
    const response = await axiosInstance.post('/Appointments', data);
    return response.data;
  }
};

// Treatments API
const treatmentsApi = {
  getMyTreatments: async () => {
    const response = await axiosInstance.get('/Treatments/my');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await axiosInstance.get(`/Treatments/${id}`);
    return response.data;
  }
};

// Feedback API
const feedbackApi = {
  create: async (data: any) => {
    const response = await axiosInstance.post('/Feedback', data);
    return response.data;
  },
  getMyFeedback: async () => {
    const response = await axiosInstance.get('/Feedback/my');
    return response.data;
  }
};

// Blog Posts API
const blogPostsApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/BlogPost');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await axiosInstance.get(`/BlogPost/${id}`);
    return response.data;
  }
};

// Content Pages API
const contentPagesApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/ContentPage');
    return response.data;
  },
  getBySlug: async (slug: string) => {
    const response = await axiosInstance.get(`/ContentPage/slug/${slug}`);
    return response.data;
  }
};

// Reminders API
const remindersApi = {
  getMyReminders: async () => {
    const response = await axiosInstance.get('/Reminder/my');
    return response.data;
  },
  markAsRead: async (id: string) => {
    const response = await axiosInstance.put(`/Reminder/${id}/read`);
    return response.data;
  }
};

// Ratings API
const ratingsApi = {
  getByEntityId: async (entityType: string, entityId: string) => {
    const response = await axiosInstance.get(`/Rating/${entityType}/${entityId}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await axiosInstance.post('/Rating', data);
    return response.data;
  }
};

// Export our API interface
export const axiosApi = {
  auth: authApi,
  test: testApi.test,
  users: usersApi,
  services: servicesApi,
  doctors: doctorsApi,
  appointments: appointmentsApi,
  treatments: treatmentsApi,
  feedback: feedbackApi,
  blogPosts: blogPostsApi,
  contentPages: contentPagesApi,
  reminders: remindersApi,
  ratings: ratingsApi
};

// Export the axios instance for custom requests
export { axiosInstance };
