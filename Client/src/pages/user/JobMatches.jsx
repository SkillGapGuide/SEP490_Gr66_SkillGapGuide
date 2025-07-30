import React from "react";
import { useAnalysisStore } from "../../stores/useAnalysisStore";
import TopMenu from "./TopMenu";
import { PieChart, Pie, Cell } from "recharts";
import { RiBuilding4Line, RiLinksLine } from "react-icons/ri";

// Hàm lấy màu Pie Chart theo phần trăm
const getMatchColor = (percent) => {
  if (typeof percent !== "number" || isNaN(percent)) return "#d1d5db"; // xám nhạt khi không có dữ liệu
  if (percent >= 85) return "#ef4444";      // đỏ
  if (percent >= 70) return "#f59e42";      // cam
  return "#2563eb";                         // xanh dương đậm cho nổi bật
};

const getMatchTextColor = (percent) => {
  if (typeof percent !== "number" || isNaN(percent)) return "text-gray-400";
  if (percent >= 85) return "text-red-600";
  if (percent >= 70) return "text-orange-500";
  return "text-blue-700";
};

// Component mô tả công việc (rút gọn, hover để xem full)
const JobDescription = ({ text, maxLength = 120 }) => {
  if (!text) return null;
  if (text.length <= maxLength) return <span>{text}</span>;
  return (
    <span className="relative group cursor-pointer">
      {text.slice(0, maxLength)}...
      <span className="absolute z-20 left-0 top-6 min-w-[240px] max-w-[400px] bg-white border border-blue-200 rounded-lg shadow-xl px-4 py-2 text-xs text-gray-700 hidden group-hover:block whitespace-pre-line">
        {text}
      </span>
    </span>
  );
};

const MatchingJobs = () => {
  const jobList = useAnalysisStore((s) => s.jobList);

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <TopMenu />
      </div>
      <div className="bg-white min-h-screen p-6 max-w-6xl mx-auto">
        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-blue-700 mb-1 mt-8 flex items-center gap-2 tracking-wide">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <path d="M12 5v14m7-7H5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Kết quả phân tích công việc
        </h2>
        {/* Ghi chú */}
        <div className="mb-6 text-[15px] text-gray-500 italic">
          <span className="font-medium text-blue-700">Mức độ phù hợp công việc</span> dựa vào kỹ năng và công việc bạn cung cấp.
        </div>
        {/* Header */}
        <div className="flex items-center font-semibold text-[18px] border-b border-gray-200 pb-2 mb-4">
          <span className="w-[80%] text-red-600">Công việc phù hợp</span>
          <span className="w-[20%] text-center text-red-600">Mức độ phù hợp</span>
        </div>

        {/* Danh sách công việc */}
        <div className="space-y-4">
          {(jobList || []).map((job, idx) => {
            // CHỈNH CHUẨN: matchScore luôn là số thực 0-1 hoặc % 0-100
            let percent = null;
            if (typeof job.matchScore === "number") {
              percent = job.matchScore > 1 ? Math.round(job.matchScore) : Math.round(job.matchScore * 100);
            }

            // Pie chart data
            const pieData = [
              { value: percent || 0, fill: getMatchColor(percent) },
              { value: 100 - (percent || 0), fill: "#f3f4f6" }
            ];

            return (
              <div
                key={job.jobId || idx}
                className="flex items-stretch border border-blue-200 rounded-xl px-6 py-4 bg-white shadow-sm hover:shadow-lg transition"
              >
               {/* Nội dung Job */}
<div className="w-[80%] flex flex-col gap-1 justify-center">
  {/* Tên công việc */}
  <div className="flex items-center gap-2 mb-1">
    <span className="font-medium text-slate-500 text-base min-w-[90px]">Công việc:</span>
    <h3 className="font-bold text-lg text-blue-900">{job.title}</h3>
  </div>

  {/* Công ty */}
  {job.company && (
    <div className="flex items-center gap-2 mb-1">
      <span className="font-medium text-slate-500 text-base min-w-[90px]">Công ty:</span>
      <RiBuilding4Line className="text-blue-400" />
      <span className="font-semibold text-gray-700">{job.company}</span>
    </div>
  )}

  {/* Đường link nguồn */}
  {job.sourceUrl && (
    <div className="flex items-center gap-2 mb-1">
      <span className="font-medium text-slate-500 text-base min-w-[90px]">Nguồn JD:</span>
      <RiLinksLine className="text-blue-500" />
      <a
        href={job.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-blue-700 text-blue-700 font-medium break-all"
      >
        {job.sourceUrl.replace(/^https?:\/\//, '').split('/')[0] || "Xem JD"}
      </a>
    </div>
  )}

  {/* Mô tả công việc (rút gọn, hover hiện full) */}
  <div className="flex gap-2 mt-1">
    <span className="font-medium text-slate-500 text-base min-w-[90px]">Mô tả:</span>
    <span className="text-[15px] text-gray-700">
      <JobDescription text={job.description} />
    </span>
  </div>
</div>

                {/* Pie chart mức độ phù hợp */}
                <div className="w-[20%] flex flex-col items-center justify-center min-w-[110px]">
                  <PieChart width={60} height={60}>
  <Pie
    data={pieData}
    cx={30}
    cy={30}
    innerRadius={20}
    outerRadius={28}
    startAngle={90}
    endAngle={450}
    dataKey="value"
    stroke="none"
    isAnimationActive={false}
  >
    {pieData.map((entry, i) => (
      <Cell key={i} fill={entry.fill} />
    ))}
  </Pie>
</PieChart>

                  <span className={`mt-1 text-lg font-bold ${getMatchTextColor(percent)}`}>
                    {typeof percent === "number" ? `${percent}%` : "--"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MatchingJobs;
