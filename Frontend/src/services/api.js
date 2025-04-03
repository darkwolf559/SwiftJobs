
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../config/constants';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
    
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      
      console.error('No response received:', error.request);
    } else {
      
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (userData) => {
    try {
      console.log('Registering user:', userData);
      const response = await api.post('/signup', userData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        throw error.response.data;
      } else if (error.request) {
        throw { message: 'No response from server. Check your connection.' };
      } else {
        throw { message: 'Network error occurred' };
      }
    }
  },

  login: async (credentials) => {
    try {
      console.log('Logging in user:', credentials.email);
      const response = await api.post('/login', credentials);
      if (response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        throw error.response.data;
      } else if (error.request) {
        throw { message: 'No response from server. Check your connection.' };
      } else {
        throw { message: 'Network error occurred' };
      }
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      return { success: true };
    } catch (error) {
      throw { message: 'Error logging out' };
    }
  },

  isLoggedIn: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      return false;
    }
  },
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/reset-password/request', { email });
      return response.data;
    } catch (error) {
      console.error('Request password reset error:', error);
      if (error.response) {
        throw error.response.data;
      } else if (error.request) {
        throw { message: 'No response from server. Check your connection.' };
      } else {
        throw { message: 'Network error occurred' };
      }
    }
  },

  resetPassword: async (data) => {
    try {
      const response = await api.post('/reset-password/reset', data);
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      if (error.response) {
        throw error.response.data;
      } else if (error.request) {
        throw { message: 'No response from server. Check your connection.' };
      } else {
        throw { message: 'Network error occurred' };
      }
    }
  }
};

export const userService = {
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Network error occurred' };
      }
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/profile', profileData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Network error occurred' };
      }
    }
  }
};


export const jobService = {
  createJob: async (jobData) => {
    try {
      const response = await api.post('/jobs/create', jobData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Network error occurred' };
      }
    }
  },

  getAllJobs: async () => {
    try {
      const response = await api.get('/jobs');
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Network error occurred' };
      }
    }
  },

  getJobsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/jobs/category/${categoryId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Network error occurred' };
      }
    }
  },

  getJobById: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Network error occurred' };
      }
    }
  }
};

export const bookmarkService = {

  addBookmark: async (jobId) => {
    try {
      const response = await api.post('/bookmarks', { jobId });
      return response.data;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  },

  removeBookmark: async (jobId) => {
    try {
      const response = await api.delete(`/bookmarks/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  },
  

  getUserBookmarks: async () => {
    try {
      const response = await api.get('/bookmarks');
      return response.data.data; 
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      throw error;
    }
  },
  
  checkBookmarkStatus: async (jobId) => {
    try {
      const response = await api.get(`/bookmarks/status/${jobId}`);
      return response.data.isBookmarked; 
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return false; 
    }
  }
};
export const reviewService = {
  
  addReview: async (jobId, rating, comment) => {
    try {
      const response = await api.post('/reviews', {
        jobId,
        rating,
        comment
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Network error occurred' };
      }
    }
  },

  getJobReviews: async (jobId) => {
    try {
      const response = await api.get(`/reviews/job/${jobId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Network error occurred' };
      }
    }
  },

  getRandomTestimonials: async () => {
    try {
      const response = await api.get('/reviews/testimonials');
      return response.data;
    } catch (error) {
      console.error('Error getting testimonials:', error);
      throw { message: 'Failed to load testimonials' };
    }
  },
  
  getAllReviews: async () => {
    try {
      const response = await api.get('/reviews');
      return response.data;
    } catch (error) {
      console.error('Error getting all reviews:', error);
      throw { message: 'Failed to load all reviews' };
    }
  }
};


export const chatService = {
  getOrCreateChat: async (applicationId) => {
    try {
      const response = await api.get(`/chats/application/${applicationId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Network error occurred' };
      }
    }
  },

  getUserChats: async () => {
    try {
      const response = await api.get('/chats');
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Network error occurred' };
      }
    }
  },

  getChatMessages: async (chatId) => {
    try {
      const response = await api.get(`/chats/${chatId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Network error occurred' };
      }
    }
  },

  sendMessage: async (chatId, content) => {
    try {
      const response = await api.post(`/chats/${chatId}/messages`, { content });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Network error occurred' };
      }
    }
  },

  markMessagesAsRead: async (chatId) => {
    try {
      const response = await api.put(`/chats/${chatId}/read`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'Network error occurred' };
      }
    }
  }
}
export default {
  authService,
  userService,
  jobService,
  bookmarkService,
  reviewService,
  chatService
};