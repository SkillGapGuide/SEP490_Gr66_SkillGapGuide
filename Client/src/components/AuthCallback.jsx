import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { authService } from '../services/authService';

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Wait a brief moment to ensure session is properly set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          // Send user data to backend and get JWT
          const response = await authService.sendUserToBackend(session);
          
         if (response.status === 200 && response.result?.token) {
            localStorage.setItem('token', response.result.token);
            window.dispatchEvent(new Event('authStateChanged'));
            console.log('Google login successful');
            navigate('/profile');
          } else {
            throw new Error('Invalid response format from server');
          }
        }  else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl mb-4">Đang xử lý đăng nhập...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
}

export default AuthCallback;