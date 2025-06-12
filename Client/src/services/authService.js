import { supabase } from '../config/supabase';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  async loginWithEmail(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Get session token and store it
      const session = data.session;
      if (session?.access_token) {
        localStorage.setItem('token', session.access_token);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  async registerWithEmail(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      
      if (data.session?.access_token) {
        localStorage.setItem('token', data.session.access_token);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  async loginWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`,
        }
      });
      
      if (error) throw error;
      
      // Get session after redirect
      const session = await supabase.auth.getSession();
      const idToken = session?.data?.session?.provider_token;
      
      if (!idToken) throw new Error('No ID token found');
      console.log('idToken:', idToken);

      // Send to backend
      const response = await axios.post(`${API_URL}/api/auth/google`, { idToken });
      const { token } = response.data;
      
      // Store JWT
     
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    return supabase.auth.signOut();
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

async sendUserToBackend(session) {
    if (!session) throw new Error('No Supabase session');

    const user = session.user;
    const { id, email, user_metadata, app_metadata } = user;
    const userData = {
      supabaseId: id,
      email,
      name: user_metadata?.full_name || user_metadata?.name || "",
      avatar: user_metadata?.avatar_url || "",
      provider: app_metadata?.provider || "google",
      access_token: session.access_token,
    };

    // Gửi lên backend
    const response = await axios.post(`${API_URL}/api/auth/supabase-google`, userData);

    // Lưu JWT backend
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

};