import { create } from "zustand";
import { persist } from "zustand/middleware";

const KEY = "payment-qr-store";
// TTL: sau thời gian này sẽ cho phép tạo QR mới (nếu bạn thật sự muốn “chỉ 1 lần” tuyệt đối, đặt TTL = null)
const TTL_MS = 30 * 60 * 1000; // 30 phút

export const usePaymentQrStore = create(
  persist(
    (set, get) => ({
      /**
       * sessions: {
       *   "userId:subscriptionId": { qrCodeUrl, paymentId, createdAt, status }
       * }
       */
      sessions: {},

      getSession(userId, subscriptionId) {
        const key = `${userId}:${subscriptionId}`;
        const s = get().sessions[key];
        if (!s) return null;
        // TTL check
        if (TTL_MS && Date.now() - (s.createdAt || 0) > TTL_MS) {
          // Expired → clear để cho phép tạo mới
          const n = { ...get().sessions };
          delete n[key];
          set({ sessions: n });
          return null;
        }
        return s;
      },

      setSession(userId, subscriptionId, data) {
        const key = `${userId}:${subscriptionId}`;
        set((state) => ({
          sessions: {
            ...state.sessions,
            [key]: {
              ...data,
              createdAt: Date.now(),
              status: data?.status || "PENDING",
            },
          },
        }));
      },

      markPaid(userId, subscriptionId) {
        const key = `${userId}:${subscriptionId}`;
        const s = get().sessions[key];
        if (!s) return;
        set((state) => ({
          sessions: { ...state.sessions, [key]: { ...s, status: "PAID" } },
        }));
      },

      clearSession(userId, subscriptionId) {
        const key = `${userId}:${subscriptionId}`;
        const next = { ...get().sessions };
        delete next[key];
        set({ sessions: next });
      },
      updateStatus(userId, subscriptionId, nextStatus) {
        const key = `${userId}:${subscriptionId}`;
        const s = get().sessions[key];
        if (!s) return;
        set((state) => ({
          sessions: {
            ...state.sessions,
            [key]: { ...s, status: nextStatus },
          },
        }));
      },

      clearAll() {
        set({ sessions: {} });
      },
    }),
    { name: KEY }
  )
);
