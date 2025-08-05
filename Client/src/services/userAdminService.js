import { apiService } from './api';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const userAdminService = {
  getAllUsers: async (params = { searchText: "", role: "", status: "", pageNo: 0, pageSize: 5 }) => {
    const response = await apiService.get(`${ENDPOINTS.admin.getAllUsers}?${new URLSearchParams(params)}`);
    return response.result;
  },
  
  getUserByEmail: async (email) => {
    const response = await apiService.get(ENDPOINTS.admin.getUserByEmail(email));
    return response.result;
  },
  
  enableUser: async (email) => {
    return await apiService.post(ENDPOINTS.admin.enableUser(email));
  },
  
  disableUser: async (email) => {
    return await apiService.post(ENDPOINTS.admin.disableUser(email));
  },
  createAdminAccount: async (data) => {
    const {email, password, phone,fullName,roleId} = data;
    return await apiService.post(ENDPOINTS.systemAdmin.createAccount,{email, password, phone, fullName, roleId});
  }
  ,changeRole : async (userId, newRoleId) => {
    return await apiService.post(ENDPOINTS.systemAdmin.changeRole(userId, newRoleId));
  }
};