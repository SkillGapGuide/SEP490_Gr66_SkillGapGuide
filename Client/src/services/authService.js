import  {supabase}  from '../config/supabase';
import axios from 'axios';
import { ENDPOINTS } from '../constants/apiEndpoints';
import { apiService } from './api';
const API_URL = import.meta.env.VITE_API_URL;

// Thêm event custom để theo dõi thay đổi auth
const authStateChange = new Event('authStateChanged');

export const authService = {
async loginWithEmail(email, password) {
    try {
      const response = await apiService.post(ENDPOINTS.auth.login, {
        email,
        password,
      });
     
      
      if (response.result && response.result.token) {
        localStorage.setItem('token', response.result.token);
        // Dispatch event khi login thành công
        window.dispatchEvent(authStateChange);
        return response.data;
      }
    } catch (error) {
      if (error.code === 'ERR_CONNECTION_REFUSED') {
        throw new Error('Unable to connect to server. Please check if the backend server is running.');
      }
      // Pass the error message from backend
      throw new Error(error.response?.message || 'Đăng nhập thất bại');
    }
  },

  async registerWithEmail(email, password,fullName,phone) {
    try {
      const response = await apiService.post(ENDPOINTS.auth.register, {
        email,
        password,
        fullName,
        phone
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

// authService.js
async loginWithGoogle() {
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes: 'email profile',
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account'
      }
    }
  });

  if (error) {
    // Chỉ log khi thực sự có error
    console.error('Supabase OAuth error:', error.message);
    throw error;
  }

  // Không log gì nếu thành công!
  return data;
}
,

  logout() {
    localStorage.clear();
    // Dispatch event khi logout
    window.dispatchEvent(authStateChange);
    return supabase.auth.signOut();
  },

  // async getCurrentUser() {
  //   const { data: { user } } = await supabase.auth.getUser();
  //   return user;
  // },

async sendUserToBackend(session) {
    if (!session) throw new Error('No Supabase session');

    const user = session.user;
    const { id, email, user_metadata } = user;
    const userData = {
     
      email,
      name: user_metadata?.full_name || user_metadata?.name || "",
      avatar: user_metadata?.avatar_url || "",
      accessToken: session.access_token,
       supabaseId: id,
    };

   try {
  const response = await axios.post(`${API_URL}/api/auth/google`, userData);
  console.log("🔐 Sending user to backend:", response);
  
  if (response.data.result.token) {
    localStorage.setItem('token', response.data.result.token);
    window.dispatchEvent(authStateChange);
  }
  // return response.data.result;
} catch (error) {
  if (error.response?.status === 409) {
    alert("Email này đã đăng ký bằng tài khoản khác. Vui lòng đăng nhập bằng đúng phương thức hoặc liên hệ hỗ trợ.");
  } else {
    alert("Có lỗi xảy ra khi xác thực Google. Vui lòng thử lại hoặc liên hệ hỗ trợ.");
  }
  throw error;
}

},

};