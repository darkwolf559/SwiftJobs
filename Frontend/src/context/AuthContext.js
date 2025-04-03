
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
          try {

            await userService.getProfile();
 
            setAuthToken(token);
            setCurrentUser(JSON.parse(storedUser));
          } catch (error) {
            console.log('Stored token is invalid, logging out');
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userData');
            await AsyncStorage.removeItem('refreshToken');
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