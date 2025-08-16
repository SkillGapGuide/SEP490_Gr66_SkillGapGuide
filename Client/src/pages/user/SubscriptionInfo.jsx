import React, { useEffect, useState } from "react";
import { Loader2, Crown, CalendarDays, User2, BadgeCheck } from "lucide-react";
import { userService } from "../../services/userService";
import dayjs from "dayjs";
import SidebarProfile from "../../components/user/SidebarProfile";

export default function SubscriptionInfo() {
  const [sub, setSub] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await userService.viewSubscription();
      setSub(data);
    })();
  }, []);

  if (!sub) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="animate-spin text-yellow-500" size={48} />
      </div>
    );
  }

  const {
    fullName,
    role,
    subscriptionStart,
    subscriptionEnd,
    subscriptionName,
  } = sub;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
      {/* Sidebar */}
      <SidebarProfile />

      {/* Main content */}
      <div className="flex-1">
        <div className="max-w-xl w-full mx-auto bg-white border border-yellow-200 shadow rounded-2xl p-7 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-full border-2 border-yellow-300 p-3 shadow">
            <Crown size={44} className="text-yellow-500" />
          </div>
          <div className="text-center mt-6 mb-2">
            <div className="text-xs font-bold text-yellow-600 uppercase tracking-wider">
              Premium
            </div>
            <div className="text-2xl font-bold text-blue-900 flex items-center justify-center gap-3 mt-1">
              {subscriptionName}
              <span className="bg-yellow-100 text-yellow-700 text-sm rounded px-3 py-1 font-bold">
                {role}
              </span>
            </div>
            <div className="flex justify-center items-center text-gray-700 mt-1 gap-1">
              <User2 className="w-5 h-5 text-blue-400" />
              {fullName}
              <BadgeCheck className="w-5 h-5 text-green-400" title="Verified" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 my-7">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center flex flex-col items-center">
              <CalendarDays className="text-blue-500 mb-1" size={28} />
              <div className="text-xs text-gray-400">Bắt đầu</div>
              <div className="text-base font-bold text-blue-900">
                {subscriptionStart ? (
                  dayjs(subscriptionStart).format("DD/MM/YYYY HH:mm")
                ) : (
                  <span className="italic text-gray-400">Không áp dụng</span>
                )}
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-center flex flex-col items-center">
              <CalendarDays className="text-yellow-500 mb-1" size={28} />
              <div className="text-xs text-gray-400">Kết thúc</div>
              <div className="text-base font-bold text-yellow-900">
                {subscriptionEnd ? (
                  dayjs(subscriptionEnd).format("DD/MM/YYYY HH:mm")
                ) : (
                  <span className="italic text-gray-400">Không áp dụng</span>
                )}
              </div>
            </div>
          </div>

         <div className="mt-6 flex items-center justify-between">
  {role === "Premium User" ? (
    <div className="text-green-700 font-bold text-base flex items-center gap-2">
      <Crown className="w-5 h-5 text-yellow-500" />
      Đặc quyền <span className="underline underline-offset-2">Premium</span>
    </div>
  ) : (
    <a
      href="/servicepayment"
      className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-semibold px-6 py-2 rounded-full shadow transition"
    >
      <Crown className="w-5 h-5" />
      Nâng cấp Premium
    </a>
  )}
  <span className="text-xs text-gray-400">
    {`ID người dùng: ${fullName.replace(/\s+/g, "_").toLowerCase()}`}
  </span>
</div>

        </div>
      </div>
    </div>
  );
}
