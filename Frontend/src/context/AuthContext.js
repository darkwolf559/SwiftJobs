
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';


const AuthContext = createContext();


export const useAuth = () => {
  return useContext(AuthContext);
};


export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);


  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const storedUser = await AsyncStorage.getItem('userData');
        
        if (token && storedUser) {
          setAuthToken(token);
          setCurrentUser(JSON.parse(storedUser));
          
          try {
            const response = await userService.getProfile();
            setCurrentUser(response);
            await AsyncStorage.setItem('userData', JSON.stringify(response));
          } catch (error) {
            console.log('Could not refresh profile, using stored data');
          }
        }
      } catch (error) {
        console.error('Error loading authentication data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredData();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      

      setAuthToken(response.token);
      setCurrentUser(response.user);
      
      return response;
    } catch (error) {
      throw error;
    }
  };


  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuthToken(null);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const isAuthenticated = () => {
    return !!authToken;
  };


  const value = {
    currentUser,
    authToken,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;