import React, { useState } from "react";
import { FaUser, FaHeart, FaCheckCircle, FaMusic } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FiUser, FiHeart, FiCheckCircle } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";

const initialCourses = [
  {
    title: "Teamwork Skills",
    platform: "Coursera",
    link: "https://coursera.org/",
    description:
      "Khóa học 4 module giúp cải thiện giao tiếp nhóm, quản lý xung đột và ra quyết định tập thể",
  },
  {
    title: "Time and Task Management",
    platform: "Udemy",
    link: "https://udemy.com/",
    description:
      "Khóa thực hành từ Joseph Phillips với kỹ thuật ưu tiên công việc và loại bỏ lãng phí thời gian",
  },
];

const FavoriteCourses = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState("");

  const filtered = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.platform.toLowerCase().includes(search.toLowerCase())
  );
  const sidebarLinks = [
      { label: "Thông tin tài khoản", icon: <FiUser className="text-purple-500" />, to: "/profile" },
      { label: "Khóa học yêu thích", icon: <FaChalkboardTeacher className="text-black" />, to: "/favouriteCourses" },
      { label: "Kỹ năng yêu thích", icon: <FiHeart className="text-sky-500" />, to: "/favouriteskills" },
      { label: "Trạng thái tài khoản", icon: <FiCheckCircle className="text-blue-700" />, to: "/account-status" }
    ];
  

  const handleDelete = (index) => {
    const updated = [...courses];
    updated.splice(index, 1);
    setCourses(updated);
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
                className={`flex items-center gap-2 p-3 rounded hover:bg-gray-100 transition ${location.pathname === item.to ? "font-bold text-indigo-700 bg-indigo-50" : "text-gray-700"
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
          <h2 className="text-lg font-bold">Khóa học yêu thích của bạn</h2>
          <input
            type="text"
            placeholder="Nhập tên khóa học yêu thích"
            className="border border-gray-300 rounded-full px-4 py-2 text-sm w-[250px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* List of courses */}
        <div className="space-y-4">
          {filtered.map((course, index) => (
            <div
              key={index}
              className="relative border border-gray-200 bg-white rounded-xl p-4 shadow-sm hover:shadow transition"
            >
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {course.title}
                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-500 text-sm hover:underline float-right"
                >
                  → {course.platform}
                </a>
              </h3>
              <p className="text-sm text-gray-600">{course.description}</p>
              <button
                onClick={() => handleDelete(index)}
                className="absolute bottom-3 right-3 bg-red-200 text-red-800 px-3 py-1 text-sm rounded hover:bg-red-300 transition"
              >
                Xóa
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

export default FavoriteCourses;
