import React, { useEffect, useMemo, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopMenu from "./TopMenu";
import { showInfo, showError, showSuccess } from "../../utils/alert";
import { userService } from "../../services/userService";
import { UserContext } from "../../context/UserContext";

export default function PaymentResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const alertedRef = useRef(false);
  const listenersReadyRef = useRef(false);
  const refreshedRef = useRef(false);

  const { setUser } = useContext(UserContext);

  const toStr = (v) => (typeof v === "string" ? v : v == null ? "" : String(v));
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const status = (toStr(params.get("status")).toLowerCase() || "error").trim();
  const transactionCode = toStr(params.get("transactionCode") || params.get("vnp_TransactionNo")).trim();
  const paymentId = toStr(params.get("paymentId")).trim();
  const rawMsg = toStr(params.get("message"));

  const decodedMsg = useMemo(() => {
    try {
      return rawMsg ? decodeURIComponent(rawMsg) : "";
    } catch {
      return rawMsg;
    }
  }, [rawMsg]);

  // Config UI theo trạng thái
  const meta = useMemo(() => {
    if (status === "success") {
      return {
        title: "Thanh toán thành công",
        subtitle: "Giao dịch của bạn đã được xác nhận. Quyền truy cập gói đã được cập nhật.",
        tone: "success",
        ring: "ring-green-300/60",
        bgSoft: "from-emerald-50 to-white",
        badge: "text-emerald-700 bg-emerald-100",
        iconStroke: "stroke-emerald-600",
        gradient: "bg-gradient-to-b from-emerald-500/20 to-transparent",
        buttonLabel: "Bắt đầu sử dụng",
        onPrimary: () => navigate("/analyze"),
      };
    }
    if (status === "failed") {
      return {
        title: "Thanh toán thất bại",
        subtitle: "Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức khác.",
        tone: "failed",
        ring: "ring-red-300/60",
        bgSoft: "from-rose-50 to-white",
        badge: "text-rose-700 bg-rose-100",
        iconStroke: "stroke-rose-600",
        gradient: "bg-gradient-to-b from-rose-500/20 to-transparent",
        buttonLabel: "Thử lại",
        onPrimary: () => navigate("/servicepayment"),
      };
    }
    return {
      title: "Có lỗi xảy ra",
      subtitle: decodedMsg || "Đã có lỗi trong quá trình xử lý. Vui lòng thử lại.",
      tone: "error",
      ring: "ring-amber-300/60",
      bgSoft: "from-amber-50 to-white",
      badge: "text-amber-800 bg-amber-100",
      iconStroke: "stroke-amber-700",
      gradient: "bg-gradient-to-b from-amber-500/20 to-transparent",
      buttonLabel: "Quay lại trang gói",
      onPrimary: () => navigate("/service-payment"),
    };
  }, [status, decodedMsg, navigate]);

  // Listeners debug (an toàn)
  useEffect(() => {
    if (listenersReadyRef.current) return;
    listenersReadyRef.current = true;

    const onWinError = (e) => console.log("window.error", e, e?.error);
    const onUnhandled = (e) => console.log("unhandledrejection", e, e?.reason);

    window.addEventListener("error", onWinError);
    window.addEventListener("unhandledrejection", onUnhandled);
    return () => {
      window.removeEventListener("error", onWinError);
      window.removeEventListener("unhandledrejection", onUnhandled);
    };
  }, []);

  // Toast thông báo 1 lần
  useEffect(() => {
    if (alertedRef.current) return;
    alertedRef.current = true;
    try {
      const msg = toStr(meta.title);
      if (!msg) return;
      if (meta.tone === "success") showSuccess(msg);
      else if (meta.tone === "failed") showError(msg);
      else showInfo(msg);
    } catch (e) {
      console.error("notify error", e?.message || String(e));
    }
  }, [meta]);

  // Sanitize profile trước khi setUser
  const sanitizeProfile = (profile) => {
    try {
      const json = JSON.stringify(profile, (_k, v) => {
        if (typeof v === "bigint") return v.toString();
        if (typeof v === "function") return undefined;
        if (typeof v === "symbol") return String(v);
        return v;
      });
      return JSON.parse(json);
    } catch {
      const { id, userId, name, fullName, email, roleId, subscriptionId, ...rest } = profile || {};
      return {
        id: id ?? userId ?? null,
        name: name ?? fullName ?? "",
        email: email ?? "",
        roleId: roleId ?? null,
        subscriptionId: subscriptionId ?? null,
        ...rest,
      };
    }
  };

  // Refresh user sau khi thanh toán thành công
  useEffect(() => {
    if (status !== "success" || refreshedRef.current) return;
    refreshedRef.current = true;

    (async () => {
      try {
        const profile = await userService.viewProfile();
        const safe = sanitizeProfile(profile);
        setUser(profile);
      } catch (e) {
        console.error("Refresh profile after payment failed:", e?.message || String(e));
      }
    })();
  }, [status, setUser]);

  // Icon trạng thái lớn (SVG inline)
  const StatusIcon = () => {
    if (meta.tone === "success") {
      return (
        <svg viewBox="0 0 24 24" className={`w-16 h-16 ${meta.iconStroke}`} fill="none">
          <circle cx="12" cy="12" r="9" strokeWidth="1.5" className="opacity-40" />
          <path d="M8 12.5l2.5 2.5L16 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (meta.tone === "failed") {
      return (
        <svg viewBox="0 0 24 24" className={`w-16 h-16 ${meta.iconStroke}`} fill="none">
          <circle cx="12" cy="12" r="9" strokeWidth="1.5" className="opacity-40" />
          <path d="M9 9l6 6m0-6l-6 6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" className={`w-16 h-16 ${meta.iconStroke}`} fill="none">
        <circle cx="12" cy="12" r="9" strokeWidth="1.5" className="opacity-40" />
        <path d="M12 7v6m0 4h.01" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  };

  // Bóng bay/confetti nhẹ cho success
  const Confetti = () =>
    meta.tone === "success" ? (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float-slow absolute -top-8 -left-8 w-40 h-40 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="animate-float-slower absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-emerald-300/20 blur-3xl" />
      </div>
    ) : null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto">
       
      </div>

      <main className="relative">
        <div className="mx-auto max-w-3xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
          {/* Card */}
          <div
            className={`
              relative overflow-hidden rounded-3xl border bg-white/80 backdrop-blur
              shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] ring-1 ${meta.ring}
            `}
          >
            {/* soft gradient by status */}
            <div className={`absolute inset-x-0 -top-32 h-56 ${meta.gradient} blur-2xl`} />

            {/* Confetti for success */}
            <Confetti />

            <div className="relative p-8 sm:p-10 lg:p-12">
              {/* Header */}
              <div className="flex items-center gap-6">
                <div
                  className={`
                    flex h-20 w-20 items-center justify-center rounded-2xl bg-white/70 ring-1 ${meta.ring}
                    shadow-sm
                  `}
                >
                  <StatusIcon />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                    {toStr(meta.title)}
                  </h1>
                  <p className="mt-2 text-base sm:text-lg text-slate-600">
                    {toStr(meta.subtitle)}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {transactionCode && (
                  <div className="group rounded-xl border bg-white/70 p-4 shadow-sm hover:shadow-md transition">
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Mã giao dịch</div>
                    <div className="mt-1 font-semibold text-slate-900 break-all">
                      <span className="rounded-md bg-slate-900/5 px-2 py-1 font-mono text-sm">
                        {transactionCode}
                      </span>
                    </div>
                  </div>
                )}
                {paymentId && (
                  <div className="group rounded-xl border bg-white/70 p-4 shadow-sm hover:shadow-md transition">
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Mã thanh toán</div>
                    <div className="mt-1 font-semibold text-slate-900">
                      <span className="rounded-md bg-slate-900/5 px-2 py-1 font-mono text-sm">
                        {paymentId}
                      </span>
                    </div>
                  </div>
                )}
                {status && (
                  <div className="group rounded-xl border bg-white/70 p-4 shadow-sm hover:shadow-md transition">
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Trạng thái</div>
                    <div className="mt-1 inline-flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}>
                        {status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
                {decodedMsg && meta.tone !== "success" && (
                  <div className="group rounded-xl border bg-white/70 p-4 shadow-sm hover:shadow-md transition sm:col-span-2">
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Thông báo hệ thống</div>
                    <div className="mt-1 text-slate-800">{decodedMsg}</div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex h-12 items-center justify-center rounded-xl border px-5 font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
                >
                  Về trang chủ
                </button>

                <button
                  onClick={() => navigate("/servicepayment")}
                  className="inline-flex h-12 items-center justify-center rounded-xl border px-5 font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
                >
                  Quản lý gói dịch vụ
                </button>

                <button
                  onClick={typeof meta.onPrimary === "function" ? meta.onPrimary : undefined}
                  className={`
                    inline-flex h-12 items-center justify-center rounded-xl px-6 font-semibold text-white
                    shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition
                    ${meta.tone === "success" ? "bg-emerald-600 hover:bg-emerald-700"
                      : meta.tone === "failed" ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-amber-600 hover:bg-amber-700"}
                  `}
                >
                  {toStr(meta.buttonLabel)}
                </button>
              </div>
            </div>
          </div>

          {/* Tip nhỏ */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Nếu thông tin chưa cập nhật, vui lòng tải lại trang hoặc kiểm tra mục <span className="font-medium">Quản lý gói dịch vụ</span>.
          </p>
        </div>
      </main>

      {/* Keyframes nhỏ cho hiệu ứng bóng bay */}
      <style>{`
        @keyframes floatSlow { 
          0% { transform: translateY(0px); } 
          50% { transform: translateY(-10px); } 
          100% { transform: translateY(0px); } 
        }
        .animate-float-slow { animation: floatSlow 8s ease-in-out infinite; }
        .animate-float-slower { animation: floatSlow 12s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
