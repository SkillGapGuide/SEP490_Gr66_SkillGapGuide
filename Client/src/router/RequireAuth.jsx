import { Navigate, useLocation } from "react-router-dom";

// Giả sử bạn lưu role vào localStorage hoặc context, ở đây demo đơn giản:
const getUserRole = () => {
  // Lấy role từ context/store hoặc localStorage (ví dụ)
  return localStorage.getItem("role"); // "admin" hoặc "user"
};

export default function RequireAuth({ allowedRoles, children }) {
  const location = useLocation();
  const role = getUserRole();

  if (!role) {
    // Chưa đăng nhập → về trang login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!allowedRoles.includes(role)) {
    // Không đủ quyền → về home hoặc báo lỗi
    return <Navigate to="/" replace />;
  }
  // Có quyền → render layout/route con
  return children;
}
