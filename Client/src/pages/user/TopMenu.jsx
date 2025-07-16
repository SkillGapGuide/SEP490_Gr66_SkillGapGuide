import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
  const location = useLocation();

  return (
    <nav className="bg-[#f5f9ff] border-b border-blue-200 shadow-sm">
      <ul className="flex justify-center gap-6 px-4 py-2 text-sm font-medium text-gray-800">
        {menuItems.map((item, index) => {
          const isActive = item.path !== "#" && location.pathname === item.path;

          return (
            <li
              key={index}
              className={`cursor-pointer transition-all px-2 py-1 rounded ${
                isActive
                  ? "text-white bg-blue-600 shadow font-semibold"
                  : "hover:text-blue-600 hover:underline"
              }`}
              onClick={() => {
                if (item.path !== "#") navigate(item.path);
              }}
            >
              {item.label}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TopMenu;
