import React, { useEffect, useMemo, useState } from "react";
import { dashboardService } from "../../services/dashboardService"; // chỉnh path nếu khác
// Chart.js + react wrapper
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from "chart.js";
import { Chart as ReactChart, Line, Bar, Doughnut } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import dayjs from "dayjs";

// Đăng ký các thành phần Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

const COLORS = {
  amountLine: "#0ea5e9", // sky-500
  amountFill: "rgba(14,165,233,0.15)",
  usersBar: "#10b981",   // emerald-500
  doughnut: ["#f59e0b", "#6366f1", "#94a3b8"], // amber-500, indigo-500, slate-400
};

const fmtVND = (n) =>
  typeof n === "number"
    ? n.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 })
    : n;

const AdminDashboard = () => {
  // ======= States KPI =======
  const [totals7, setTotals7] = useState({ totalAmount: 0, totalUsers: 0 });
  const [lifetime, setLifetime] = useState(0);

  // ======= States charts =======
  const [weekSeries, setWeekSeries] = useState([]);   // [{date,totalAmount,totalUsers}]
  const [monthSeries, setMonthSeries] = useState([]); // [{date,totalAmount,totalUsers}]
  const [subDist, setSubDist] = useState({ Free: 0, Pro: 0, Premium: 0 });

  // UI states
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [monthMode, setMonthMode] = useState("daily"); // 'daily' | 'cumulative'

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const [
          res7Totals,
          resWeek,
          resMonth,
          resSubs,
          resLifetime,
        ] = await Promise.all([
          dashboardService.getTotalMoneyAndUserForLast7Days(),
          dashboardService.getChartForLastWeek(),
          dashboardService.getChartForLastMonth(),
          dashboardService.getNumberUserSubscription(),
          dashboardService.getTotalMoney(),
        ]);

        const getPayload = (r) => r?.data ?? r;
        const p7 = getPayload(res7Totals)?.result ?? {};
        const pW = getPayload(resWeek)?.result ?? [];
        const pM = getPayload(resMonth)?.result ?? [];
        const pS = getPayload(resSubs)?.result ?? {};
        const pL = getPayload(resLifetime)?.result ?? 0;

        if (!mounted) return;

        setTotals7({
          totalAmount: Number(p7?.totalAmount || 0),
          totalUsers: Number(p7?.totalUsers || 0),
        });
        setWeekSeries(
          (Array.isArray(pW) ? pW : []).map((d) => ({
            date: d.date, // "YYYY-MM-DD"
            totalAmount: Number(d.totalAmount || 0),
            totalUsers: Number(d.totalUsers || 0),
          }))
        );
        setMonthSeries(
          (Array.isArray(pM) ? pM : []).map((d) => ({
            date: d.date,
            totalAmount: Number(d.totalAmount || 0),
            totalUsers: Number(d.totalUsers || 0),
          }))
        );
        setSubDist({
          Free: Number(pS?.Free || 0),
          Pro: Number(pS?.Pro || 0),
          Premium: Number(pS?.Premium || 0),
        });
        setLifetime(Number(pL || 0));
      } catch (e) {
        setErr(e?.response?.data?.message || e?.message || "Không tải được dữ liệu dashboard.");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ======= Derived for month cumulative =======
  const monthCumulative = useMemo(() => {
    let cum = 0;
    return monthSeries.map((d) => {
      cum += d.totalAmount || 0;
      return { ...d, cumAmount: cum };
    });
  }, [monthSeries]);

  // ======= Shared options for mixed charts =======
  const makeMixedOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.dataset.label || "";
            const val = ctx.parsed.y ?? 0;
            if (ctx.dataset.yAxisID === "yAmount") {
              return ` ${label}: ${fmtVND(val)}`;
            }
            return ` ${label}: ${val.toLocaleString("vi-VN")}`;
          },
          title: (items) => {
            // items[0].parsed.x là timestamp, nhưng ta dùng time scale -> format bằng dayjs
            const x = items?.[0]?.parsed?.x;
            return x ? dayjs(x).format("DD/MM/YYYY") : "";
          },
        },
      },
      title: { display: !!title, text: title },
    },
    scales: {
      x: {
        type: "time",
        time: { unit: "day", tooltipFormat: "DD/MM/YYYY" },
        grid: { display: false },
        ticks: { color: "#6b7280" },
      },
      yUsers: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        grid: { drawOnChartArea: true },
        ticks: { color: "#6b7280" },
        title: { display: true, text: "Users", color: "#6b7280" },
      },
      yAmount: {
        type: "linear",
        position: "right",
        beginAtZero: true,
        grid: { drawOnChartArea: false },
        ticks: {
          color: "#6b7280",
          callback: (v) => (typeof v === "number" ? v.toLocaleString("vi-VN") : v),
        },
        title: { display: true, text: "VND", color: "#6b7280" },
      },
    },
    elements: {
      line: { tension: 0.35 },
      point: { radius: 2, hoverRadius: 5 },
      bar: { borderRadius: 6 },
    },
    animation: { duration: 250 },
  });

  // ======= Datasets: 7 ngày =======
  const dataWeekMixed = useMemo(() => {
    const points = weekSeries.map((d) => ({
      x: d.date, // time scale auto parse "YYYY-MM-DD"
      amount: d.totalAmount,
      users: d.totalUsers,
    }));
    return {
      datasets: [
        {
          type: "bar",
          label: "Người mua",
          data: points.map((p) => ({ x: p.x, y: p.users })),
          backgroundColor: COLORS.usersBar,
          yAxisID: "yUsers",
          order: 2,
        },
        {
          type: "line",
          label: "Doanh thu (VND)",
          data: points.map((p) => ({ x: p.x, y: p.amount })),
          borderColor: COLORS.amountLine,
          backgroundColor: COLORS.amountFill,
          fill: true,
          yAxisID: "yAmount",
          order: 1,
        },
      ],
    };
  }, [weekSeries]);

  // ======= Datasets: 30 ngày (daily / cumulative) =======
  const dataMonthMixed = useMemo(() => {
    const src = monthMode === "cumulative" ? monthCumulative : monthSeries;
    const points = src.map((d) => ({
      x: d.date,
      amount: monthMode === "cumulative" ? d.cumAmount : d.totalAmount,
      users: d.totalUsers,
    }));
    return {
      datasets: [
        {
          type: "bar",
          label: monthMode === "cumulative" ? "Người mua (theo ngày)" : "Người mua",
          data: points.map((p) => ({ x: p.x, y: p.users })),
          backgroundColor: COLORS.usersBar,
          yAxisID: "yUsers",
          order: 2,
        },
        {
          type: "line",
          label: monthMode === "cumulative" ? "Doanh thu lũy kế (VND)" : "Doanh thu (VND)",
          data: points.map((p) => ({ x: p.x, y: p.amount })),
          borderColor: COLORS.amountLine,
          backgroundColor: COLORS.amountFill,
          fill: true,
          yAxisID: "yAmount",
          order: 1,
        },
      ],
    };
  }, [monthSeries, monthCumulative, monthMode]);

  // ======= Doughnut Subscription =======
  const dataDoughnut = useMemo(() => {
    const labels = ["Free", "Pro", "Premium"];
    const values = [subDist.Free, subDist.Pro, subDist.Premium];
    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: COLORS.doughnut,
          hoverOffset: 6,
          borderWidth: 2,
        },
      ],
    };
  }, [subDist]);

  const optionsDoughnut = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "bottom" },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.label || "";
            const v = ctx.parsed || 0;
            const sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = sum ? ((v / sum) * 100).toFixed(1) : 0;
            return ` ${label}: ${v.toLocaleString("vi-VN")} (${pct}%)`;
          },
        },
      },
      title: { display: true, text: "Phân bổ gói người dùng" },
    },
    cutout: "60%",
  };

  // ======= Render =======
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Bảng thông kê</h1>
        <p className="text-sm text-gray-500">Tổng quan doanh thu & người dùng</p>
      </div>

      {err && (
        <div className="mb-4 p-3 rounded-lg border bg-red-50 text-red-700">
          {err}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-gray-100 bg-white/70 backdrop-blur p-4 shadow-sm">
          <p className="text-xs text-gray-500">Doanh thu 7 ngày</p>
          <p className="text-2xl font-semibold">{loading ? "…" : fmtVND(totals7.totalAmount)}</p>
          
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white/70 backdrop-blur p-4 shadow-sm">
          <p className="text-xs text-gray-500">Người mua 7 ngày</p>
          <p className="text-2xl font-semibold">{loading ? "…" : totals7.totalUsers.toLocaleString("vi-VN")}</p>
         
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white/70 backdrop-blur p-4 shadow-sm">
          <p className="text-xs text-gray-500">Tổng doanh thu (lịch sử)</p>
          <p className="text-2xl font-semibold">{loading ? "…" : fmtVND(lifetime)}</p>
         
        </div>
      </div>

      {/* Mixed chart: 7 ngày */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">7 ngày gần nhất</h3>
          <span className="text-xs text-gray-500">Doanh thu (line) & Người mua (bar)</span>
        </div>
        <div className="h-[320px]">
          {loading ? (
            <div className="h-full grid place-items-center text-gray-400 text-sm">Đang tải…</div>
          ) : (
            <ReactChart type="bar" data={dataWeekMixed} options={makeMixedOptions()} />
          )}
        </div>
      </div>

      {/* Mixed chart: 30 ngày */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">30 ngày gần nhất</h3>
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setMonthMode("daily")}
              className={`px-3 py-1 rounded-lg border ${monthMode === "daily" ? "bg-blue-500 text-white border-blue-500" : "hover:bg-gray-50"}`}
            >
              Daily
            </button>
            <button
              onClick={() => setMonthMode("cumulative")}
              className={`px-3 py-1 rounded-lg border ${monthMode === "cumulative" ? "bg-blue-500 text-white border-blue-500" : "hover:bg-gray-50"}`}
            >
              Cumulative
            </button>
          </div>
        </div>
        <div className="h-[320px]">
          {loading ? (
            <div className="h-full grid place-items-center text-gray-400 text-sm">Đang tải…</div>
          ) : (
            <ReactChart type="bar" data={dataMonthMixed} options={makeMixedOptions(monthMode === "cumulative" ? "Doanh thu lũy kế" : "")} />
          )}
        </div>
      </div>

      {/* Doughnut: Subscription Distribution */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">Cơ cấu gói (Free/Pro/Premium)</h3>
          <span className="text-xs text-gray-500">Nguồn: getNumberUserSubscription</span>
        </div>
        <div className="h-[260px]">
          {loading ? (
            <div className="h-full grid place-items-center text-gray-400 text-sm">Đang tải…</div>
          ) : (
            <Doughnut data={dataDoughnut} options={optionsDoughnut} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
