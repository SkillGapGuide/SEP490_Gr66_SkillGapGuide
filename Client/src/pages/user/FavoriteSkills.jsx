import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { FiUser, FiHeart, FiCheckCircle } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { userService } from "../../services/userService"; // Đảm bảo path đúng
import SidebarProfile from "../../components/user/SidebarProfile";

const FavoriteSkills = () => {
  const userId = 5; // hoặc lấy từ context/auth nếu có
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1); // 🟢 page bắt đầu từ 1
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await userService.getFavoriteMissingSkills(userId, page, 10);
        const apiSkills = res.result?.content || [];

        const formatted = apiSkills.map((item) => ({
          category: "Kỹ năng chuyên môn",
          title: item.skill.name,
          description: `Được thêm vào lúc ${new Date(item.createdAt).toLocaleString()}`,
        }));

        setSkills(formatted);
        setTotalPages(res.result?.totalPages || 1);
      } catch (err) {
        console.error("Lỗi khi lấy kỹ năng yêu thích bị thiếu:", err);
      }
    };

    fetchSkills();
  }, [page]);

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
      <SidebarProfile/>

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
          <button
            className="border rounded px-2 py-1 hover:bg-gray-100"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            &lt;&lt;
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded border ${
                page === i + 1 ? "bg-blue-700 text-white" : "hover:bg-gray-100"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="border rounded px-2 py-1 hover:bg-gray-100"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteSkills;
