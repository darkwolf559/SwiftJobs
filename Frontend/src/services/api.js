
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

// Authentication Services
export const authService = {
  // Register new user
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

  // Login user
  login: async (credentials) => {
    try {
      console.log('Logging in user:', credentials.email);
      const response = await api.post('/login', credentials);
      // Store token and user data
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
  }
};

// User Profile Services
export const userService = {
  // Get user profile
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

  // Update user profile
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

// Job Services
export const jobService = {
  // Create a new job
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

  // Get all jobs
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

  // Get jobs by category
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

  // Get job by ID
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
  // Add a bookmark
  addBookmark: async (jobId) => {
    try {
      const response = await api.post('/bookmarks', { jobId });
      return response.data;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  },
  
  // Remove a bookmark
  removeBookmark: async (jobId) => {
    try {
      // Changed to use URL parameter instead of request body
      const response = await api.delete(`/bookmarks/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  },
  
  // Get all bookmarks for the current user
  getUserBookmarks: async () => {
    try {
      const response = await api.get('/bookmarks');
      return response.data.data; // Assuming your backend returns {data: [...bookmarks]}
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      throw error;
    }
  },
  
  // Check if a job is bookmarked
  checkBookmarkStatus: async (jobId) => {
    try {
      const response = await api.get(`/bookmarks/status/${jobId}`);
      return response.data.isBookmarked; // Changed from bookmarked to isBookmarked
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

  // Get all reviews for a job
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

  // Get random testimonials for the homepage
  getRandomTestimonials: async () => {
    try {
      const response = await api.get('/reviews/testimonials');
      return response.data;
    } catch (error) {
      console.error('Error getting testimonials:', error);
      throw { message: 'Failed to load testimonials' };
    }
  },
  
  // Get all reviews (new function)
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

export default {
  authService,
  userService,
  jobService,
  bookmarkService,
  reviewService
};