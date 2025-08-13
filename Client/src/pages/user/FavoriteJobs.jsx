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
      {/* Sidebar left */}
    
        <SidebarProfile />
   

      {/* Main info card */}
      <main className="flex-1 flex justify-center items-start">
        <div className="rounded-3xl shadow-2xl border-2 border-yellow-300 bg-white/95 p-10 relative w-full max-w-2xl min-h-[520px]">
          {/* Crown & badge */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="bg-gradient-to-tr from-yellow-400 to-yellow-200 rounded-full shadow-lg p-4 border-4 border-white">
              <Crown size={48} className="text-yellow-600 drop-shadow-lg" />
            </div>
            <span className="mt-2 text-lg font-extrabold text-yellow-700 tracking-wider uppercase">Premium</span>
          </div>
          <div className="mt-16 text-center">
            <div className="text-3xl font-black text-blue-900 flex justify-center items-center gap-2 mb-1">
              {subscriptionName}
              <span className="inline-flex items-center px-3 py-1 ml-2 rounded-full bg-gradient-to-r from-yellow-200 to-yellow-400 text-yellow-900 font-bold text-base shadow">
                {role}
              </span>
            </div>
            <div className="text-gray-600 text-lg flex items-center justify-center gap-2 mb-2">
              <User2 className="w-6 h-6 text-blue-400" />
              <span>{fullName}</span>
              <BadgeCheck className="w-5 h-5 text-green-400" title="Verified" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
            <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl border-2 border-blue-100 shadow flex flex-col items-center p-7">
              <CalendarDays className="text-blue-400" size={34} />
              <div className="text-gray-500 text-lg mt-3">Bắt đầu</div>
              <div className="text-blue-900 font-bold text-xl">
                {dayjs(subscriptionStart).format("DD/MM/YYYY HH:mm")}
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-white rounded-xl border-2 border-yellow-200 shadow flex flex-col items-center p-7">
              <CalendarDays className="text-yellow-400" size={34} />
              <div className="text-gray-500 text-lg mt-3">Kết thúc</div>
              <div className="text-yellow-900 font-bold text-xl">
                {dayjs(subscriptionEnd).format("DD/MM/YYYY HH:mm")}
              </div>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-green-700 font-extrabold text-xl">
              <Crown className="w-7 h-7 text-yellow-500" />
              Đặc quyền <span className="underline underline-offset-2">Premium</span>
            </div>
            <span className="text-xs text-gray-400 text-right">
              {`ID: `}
              <span className="font-bold">{fullName.replace(/\s+/g, "_").toLowerCase()}</span>
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
