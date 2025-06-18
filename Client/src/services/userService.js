import { apiService } from './api';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const userService = {
  getAllUsers: () => apiService.get(ENDPOINTS.users.getAll),
  
  getUserById: (id) => apiService.get(ENDPOINTS.users.getById(id)),
  
  createUser: (userData) => apiService.post(ENDPOINTS.users.create, userData),
  
  updateUser: (id, userData) => apiService.put(ENDPOINTS.users.update(id), userData),
  
  deleteUser: (id) => apiService.delete(ENDPOINTS.users.delete(id)),

  forgotPassword: async (email) => {
    return await apiService.post(ENDPOINTS.users.forgetPassword, { email });
  },

  resetPassword: async (token, newPassword) => {
    return await apiService.get(ENDPOINTS.users.resetPassword, { 
      token,
      newPassword 
    });
  },
  changePassword: async (currentPassword, newPassword) => {
    return await apiService.post(ENDPOINTS.users.changePassword, { 
      oldPassword: currentPassword, 
      newPassword 
    });
  }} ;

