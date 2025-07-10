import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

const mockCourses = [
  {
    title: "Teamwork Skills",
    description:
      "Khóa học 4 module giúp cải thiện giao tiếp nhóm, quản lý xung đột và ra quyết định tập thể",
    source: "Coursera",
    url: "https://coursera.org/",
  },
  {
    title: "Analysis for Business Systems",
    description:
      "Tìm hiểu SDLC cùng các deliverables đặc trưng trong vai trò Business Systems Analyst .",
    source: "Coursera",
    url: "https://coursera.org/",
  },
  {
    title: "Time and Task Management",
    description:
      "Khóa thực hành từ Joseph Phillips với kỹ thuật ưu tiên công việc và loại bỏ lãng phí thời gian",
    source: "Udemy",
    url: "https://udemy.com/",
  },
];

const CourseTable = () => {
  const [search, setSearch] = useState("");
  const [courses] = useState(mockCourses);
  const [page, setPage] = useState(1);
  const totalPages = 3;

  const filtered = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 font-sans">
      <h2 className="text-3xl font-bold text-indigo-900 mb-6">Danh sách khóa học</h2>

      {/* Search + Button */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Nhập tên khóa học"
            className="border border-black rounded-full px-4 py-2 pl-10 text-blue-700 font-medium focus:outline-none w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-2.5 text-black" />
        </div>
        <button className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700">
          Cập nhật dữ liệu
        </button>
        <span className="text-green-600 font-semibold">Đã cập nhật!</span>
      </div>

      {/* Table */}
      <table className="w-full border border-black text-left text-gray-700">
        <thead className="bg-white">
          <tr>
            <th className="border border-black px-3 py-2 w-1/4">Tên</th>
            <th className="border border-black px-3 py-2">Mô tả</th>
            <th className="border border-black px-3 py-2 w-1/6">Nguồn</th>
            <th className="border border-black px-3 py-2 w-[80px]"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((course, i) => (
            <tr key={i}>
              <td className="border border-black px-3 py-2">{course.title}</td>
              <td className="border border-black px-3 py-2">{course.description}</td>
              <td className="border border-black px-3 py-2">{course.source}</td>
              <td className="border border-black px-3 py-2 text-center">
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-400 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded"
                >
                  Đi đến
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-1 text-sm mt-6">
        <button
          className="px-2 py-1 border bg-white text-black rounded hover:bg-gray-100"
          onClick={() => setPage(1)}
        >
          &lt;&lt;
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? "bg-blue-700 text-white" : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-2 py-1 border bg-white text-black rounded hover:bg-gray-100"
          onClick={() => setPage(totalPages)}
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );
};

export default CourseTable;
