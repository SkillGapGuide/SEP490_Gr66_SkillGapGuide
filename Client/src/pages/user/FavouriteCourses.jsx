import React, { useState } from "react";

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

  const handleDelete = (index) => {
    const updated = [...courses];
    updated.splice(index, 1);
    setCourses(updated);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white text-gray-800 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Khóa học yêu thích của bạn</h2>
        <input
          type="text"
          placeholder="Nhập tên khóa học yêu thích"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-[250px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Course cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filtered.map((course, index) => (
          <div
            key={index}
            className="relative border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-base font-semibold text-gray-900">
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
            <p className="text-sm text-gray-600 mt-1">{course.description}</p>
            <button
              onClick={() => handleDelete(index)}
              className="absolute bottom-3 right-3 bg-red-200 text-red-800 px-3 py-1 text-sm rounded hover:bg-red-300 transition"
            >
              Xóa
            </button>
          </div>
        ))}
      </div>

      {/* Pagination (Mock) */}
      <div className="flex justify-center items-center gap-1 text-sm">
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
  );
};

export default FavoriteCourses;
