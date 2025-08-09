import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { userService } from '../services/userService';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { retry } from '../utils/retry'; // Import hàm retry từ utils
// Copy hàm retry vào đầu file hoặc import từ utils

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const finishOAuthLogin = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session?.user) {
          console.error("OAuth callback session error:", error);
          return;
        }

        // Retry lấy profile (max 6 lần, mỗi lần cách nhau 800ms)
        const profile = await retry(() => userService.viewProfile(), 6, 800);
        console.log('✅ Profile loaded:', profile);

        setUser(profile);

        // Điều hướng theo role
        if (profile.role === "System Admin") {
          navigate("/admin");
        } else if (profile.role === "Finance Admin") {
          navigate("/finance");
        } else if (profile.role === "Content Manager") {
          navigate("/content-manager");
        } else {
          navigate("/about-us");
        }
      } catch (err) {
        console.error("OAuth login finalization error:", err);
        // Thông báo UI: "Tài khoản chưa được khởi tạo, vui lòng thử lại sau!"
      }
    };

    finishOAuthLogin();
  }, [navigate, setUser]);

  return <div className="p-4 text-center text-lg">🔄 Đang xác thực đăng nhập...</div>;
}
