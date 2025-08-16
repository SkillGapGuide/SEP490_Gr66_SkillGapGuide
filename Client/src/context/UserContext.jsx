import { createContext, useState, useEffect, useCallback } from "react";
import { userService } from "../services/userService";
import { useAuthStore } from "../stores/authStore";

export const UserContext = createContext();

// Hàm retry này bạn có thể copy dán thẳng vào file này!
async function retry(fn, maxTries = 5, delayMs = 700) {
  let lastErr;
  for (let i = 0; i < maxTries; ++i) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      // Chỉ retry nếu là 403 hoặc 404 (profile chưa kịp tạo)
      if (err?.response?.status !== 403 && err?.response?.status !== 404) throw err;
      await new Promise(res => setTimeout(res, delayMs));
    }
  }
  throw lastErr;
}
function resolveRole(u) {
  if (!u) return null;
  // tuỳ backend của bạn: role, roleName, hoặc roleId -> map
  if (u.role) return u.role;
  if (u.roleName) return u.roleName;
  if (u.roleId) {
    const map = { 4: "Free User", 5: "Pro User", 6: "Premium User" };
    return map[u.roleId] || null;
  }
  return null;
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await retry(() => userService.viewProfile(), 5, 700);
        setUser(profile);
        const r = resolveRole(profile);
       useAuthStore.getState().setRole(r);
      } catch (error) {
        console.error("Không lấy được thông tin user:", error);
        setUser(null);
        useAuthStore.getState().setRole(null);

      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
   useEffect(() => {
   const r = resolveRole(user);
   useAuthStore.getState().setRole(r);
 }, [user]);

  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
