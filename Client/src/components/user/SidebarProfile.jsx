import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiUser, FiHeart, FiCheckCircle, FiKey, FiStar, FiUploadCloud } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";

const SidebarProfile = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);

  // Ẩn "Đổi mật khẩu" nếu đăng nhập Google
  const links = [
    { label: "Thông tin tài khoản", icon: <FiUser className="text-purple-500" />, to: "/profile" },
    { label: "Khóa học yêu thích", icon: <FaChalkboardTeacher className="text-black" />, to: "/favouriteCourses" },
    { label: "Kỹ năng yêu thích", icon: <FiStar className="text-yellow-400" />, to: "/favouriteskills" },
    { label: "Công việc yêu thích", icon: <FiHeart className="text-red-500" />, to: "/favouriteJobs" },
    { label: "Trạng thái tài khoản", icon: <FiCheckCircle className="text-blue-700" />, to: "/account-status" },
    { label: "Lịch sử tải lên", icon: <FiUploadCloud className="text-green-500" />, to: "/action-history" },
    // "Đổi mật khẩu" chỉ cho user đăng nhập bằng local, không Google/Facebook/Apple...
    ...(user?.provider?.toUpperCase()?.includes("GOOGLE") ? [] : [
      { label: "Đổi mật khẩu", icon: <FiKey className="text-amber-500" />, to: "/change-password" }
    ])
  ];

  return (
    <div className="w-[230px] bg-white rounded-xl shadow-md py-6 flex flex-col text-[15px] font-medium">
      <div className="space-y-4">
        {links.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className={`flex items-center gap-2 p-3 rounded hover:bg-gray-100 transition ${
              location.pathname === item.to ? "font-bold text-indigo-700 bg-indigo-50" : "text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SidebarProfile;
