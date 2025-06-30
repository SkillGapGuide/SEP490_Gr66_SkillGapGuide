import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

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
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans text-gray-800 bg-white">
      {/* Title */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Kỹ năng yêu thích của bạn</h2>
        <input
          type="text"
          placeholder="Nhập tên kỹ năng yêu thích"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-[250px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredSkills.map((skill, index) => (
          <div
            key={index}
            className="relative border border-gray-200 rounded-xl shadow-sm bg-white p-4 hover:shadow-md transition"
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
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              title="Xóa kỹ năng"
            >
              <AiOutlineDelete className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Pagination (Giả lập) */}
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

export default FavoriteSkills;
