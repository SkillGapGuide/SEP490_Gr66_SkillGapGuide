// src/components/user/SkillPicker.jsx
import { useState } from "react";

// Danh sách kỹ năng mẫu, bạn có thể lấy từ API hoặc context ngoài thực tế
const ALL_SKILLS = [
  "Xử lý vấn đề",
  "Giải quyết các vấn đề công nghệ",
  "Coding",
  "Viết code",
  "Giao tiếp",
  "Phân tích dữ liệu",
  "UI/UX thiết kế",
  "Hỗ trợ",
  "Hiểu sâu sắc",
  "Quản lý thời gian",
  "Tiếng Anh",
];

export default function SkillPicker({ onSelect, exclude = [] }) {
  const [query, setQuery] = useState("");

  // Lọc kỹ năng không nằm trong exclude và match với input
  const filteredSkills = ALL_SKILLS.filter(
    (s) =>
      !exclude.includes(s) &&
      s.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="bg-blue-50 rounded-xl p-4 shadow-inner">
      <div className="mb-3">
        <input
          className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400"
          placeholder="Tìm kiếm kỹ năng"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {filteredSkills.length === 0 && (
          <div className="text-gray-400 italic">Không tìm thấy kỹ năng phù hợp</div>
        )}
        {filteredSkills.map((skill) => (
          <button
            key={skill}
            className="bg-blue-100 hover:bg-blue-300 text-blue-800 rounded-xl px-3 py-1 font-medium text-base transition"
            type="button"
            onClick={() => onSelect(skill)}
          >
            {skill} +
          </button>
        ))}
      </div>
    </div>
  );
}
