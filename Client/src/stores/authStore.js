import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      role: null,                 // "Free User" | "Pro User" | "Premium User"
      setRole: (role) => set({ role }),
    }),
    { name: "auth-store", partialize: (s) => ({ role: s.role }) }
  )
);
