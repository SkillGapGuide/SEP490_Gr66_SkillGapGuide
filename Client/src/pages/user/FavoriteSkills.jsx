import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { FiUser, FiHeart, FiCheckCircle } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";

const initialSkills = [
  {
    category: "Sales bất động sản",
    title: "Làm việc nhóm",
    description: "Hợp tác hiệu quả với người khác để đạt mục tiêu chung.",
  },
  {
    category: "Sales bất động sản",
    title: "Quản lý thời gian",
    description: "Sắp xếp công việc hợp lý để hoàn thành đúng hạn.",
  },
  {
    category: "Kỹ thuật công nghệ",
    title: "Phân tích hệ thống",
    description: "Hiểu và đánh giá hệ thống để đưa ra giải pháp tối ưu.",
  },
];

const FavoriteSkills = () => {
  const [skills, setSkills] = useState(initialSkills);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  const sidebarLinks = [
    {
      label: "Thông tin tài khoản",
      icon: <FiUser className="text-purple-500" />,
      to: "/profile",
    },
    {
      label: "Khóa học yêu thích",
      icon: <FaChalkboardTeacher className="text-black" />,
      to: "/favouriteCourses",
    },
    {
      label: "Kỹ năng yêu thích",
      icon: <FiHeart className="text-sky-500" />,
      to: "/favouriteskills",
    },
    {
      label: "Trạng thái tài khoản",
      icon: <FiCheckCircle className="text-blue-700" />,
      to: "/account-status",
    },
  ];

  const filteredSkills = skills.filter(
    (skill) =>
      skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (index) => {
    const updated = [...skills];
    updated.splice(index, 1);
    setSkills(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
      {/* Sidebar */}
      <div className="w-[230px] bg-white rounded-xl shadow-md py-6 flex flex-col justify-between text-[15px] font-medium">
        <div className="space-y-4">
          {sidebarLinks.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className={`flex items-center gap-2 p-3 rounded hover:bg-gray-100 transition ${
                location.pathname === item.to
                  ? "font-bold text-indigo-700 bg-indigo-50"
                  : "text-gray-700"
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

      {/* Main content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Kỹ năng yêu thích của bạn</h2>
          <input
            type="text"
            placeholder="Nhập tên kỹ năng yêu thích"
            className="border border-gray-300 rounded-full px-4 py-2 text-sm w-[250px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* List of skills */}
        <div className="space-y-4">
          {filteredSkills.map((skill, index) => (
            <div
              key={index}
              className="relative border border-gray-200 bg-white rounded-xl p-4 shadow-sm hover:shadow transition"
            >
              <p className="text-sm text-blue-600 font-semibold mb-1">
                {skill.category}
              </p>
              <h3 className="text-base font-medium text-gray-900 mb-1">
                {skill.title}
              </h3>
              <p className="text-sm text-gray-600">{skill.description}</p>
              <button
                onClick={() => handleDelete(index)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                title="Xóa kỹ năng"
              >
                <AiOutlineDelete className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-1 text-sm mt-8">
          <button className="border border-gray-300 rounded px-2 py-1 hover:bg-gray-100">
            &lt;&lt;
          </button>
          <button className="bg-blue-700 text-white rounded px-3 py-1">1</button>
          <button className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100">
            2
          </button>
          <button className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100">
            3
          </button>
          <button className="border border-gray-300 rounded px-2 py-1 hover:bg-gray-100">
            &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteSkills;
