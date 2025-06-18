export const ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register'
  },
  users: {
    getAll: '/users',
    getById: (id) => `/users/${id}`,
    create: '/users',
    update: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`,
    forgetPassword: '/api/user/forgot-password',
    resetPassword: '/api/user/reset-password',
    updateProfile: '/api/user/update-profile'   ,
    changePassword: '/api/user/changePassword'            
    
  }
};
