import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { UserContext } from "../context/UserContext";

function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

 useEffect(() => {
  const handleCallback = async () => {
    try {
      await new Promise(r => setTimeout(r, 100));
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) throw error || new Error("No session");

      // 1) Đổi lấy JWT từ backend
      // const { data } = await authService.sendUserToBackend(session);
      
      await authService.sendUserToBackend(session);
      // if (!data?.token) throw new Error("No JWT returned from backend");

      // 2) Lưu JWT để interceptor dùng
      // localStorage.setItem("token", data.token);

      // 3) Lấy profile (lúc này request đã có Bearer <JWT>)
      const profile = await userService.viewProfile();

      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));

      // 4) Điều hướng theo role
      switch (profile.role) {
        case "System Admin":    navigate("/admin"); break;
        case "Finance Admin":   navigate("/finance"); break;
        case "Content Manager": navigate("/content-manager"); break;
        default:                navigate("/");
      }
    } catch (e) {
      console.error("Auth callback error:", e);
      navigate("/login");
    }
  };
  handleCallback();
}, [navigate, setUser]);


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl mb-4">Đang xử lý đăng nhập...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto" />
      </div>
    </div>
  );
}

export default AuthCallback;
