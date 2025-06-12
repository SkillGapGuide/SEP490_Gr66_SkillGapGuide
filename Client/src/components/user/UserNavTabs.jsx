import { User, Upload, BrainCircuit } from "lucide-react";

export default function UserNavTabs({ tab, onTabChange, onViewResult }) {
  return (
    <div className="flex items-center justify-between w-full bg-blue-200 rounded-xl py-2 px-3 mb-4 shadow-sm">
      <div className="flex items-center gap-2 md:gap-6">
        {/* Label không click được */}
        <div className="flex items-center gap-2 px-4 py-2 text-blue-900 font-semibold">
          <User className="w-5 h-5" />
          CV & kỹ năng
        </div>
        {/* Tab 1: Tải lên CV */}
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
            tab === "cv"
              ? "bg-white shadow text-blue-900 border border-blue-500"
              : "text-blue-800 hover:bg-blue-100"
          }`}
          onClick={() => onTabChange("cv")}
        >
          <Upload className="w-5 h-5" />
          Tải lên CV
        </button>
        {/* Tab 2: Thêm kỹ năng */}
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
            tab === "add-skill"
              ? "bg-white shadow text-blue-900 border border-blue-500"
              : "text-blue-800 hover:bg-blue-100"
          }`}
          onClick={() => onTabChange("add-skill")}
        >
          <BrainCircuit className="w-5 h-5" />
          Thêm kỹ năng
        </button>
      </div>
      <button
        className="ml-2 px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white font-semibold rounded-md transition shadow"
        onClick={onViewResult}
      >
        Xem kết quả
      </button>
    </div>
  );
}
