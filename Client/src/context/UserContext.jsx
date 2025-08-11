import { createContext, useState, useEffect, useCallback } from "react";
import { userService } from "../services/userService";

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

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await retry(() => userService.viewProfile(), 5, 700);
        setUser(profile);
      } catch (error) {
        console.error("Không lấy được thông tin user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
