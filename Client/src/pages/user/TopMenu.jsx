import React from "react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Tải lên CV & Mô tả công việc", path: "/cv-upload-options" },
  { label: "Phân tích kỹ năng", path: "/addCVwritejobdescription" },
  { label: "Công việc phù hợp", path: "/matchingjobs" },
  { label: "Gợi ý khóa học", path: "/suggestedcourses" },
  { label: "Theo dõi tiến độ", path: "#" },
  { label: "Đánh giá", path: "#" },
  { label: "Đăng ký gói dịch vụ", path: "#" },
];

const TopMenu = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-[#f5f9ff] border-b border-blue-200 shadow-sm">
      <ul className="flex justify-center gap-6 px-4 py-2 text-sm font-medium text-gray-800">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="cursor-pointer hover:text-blue-600 hover:underline transition-all"
            onClick={() => {
              if (item.path !== "#") navigate(item.path);
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TopMenu;
