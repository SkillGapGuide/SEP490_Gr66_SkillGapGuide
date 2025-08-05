import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChalkboardTeacher, FaTrashAlt } from "react-icons/fa";
import { FiUser, FiHeart, FiCheckCircle } from "react-icons/fi";
import { Star } from "lucide-react";
import { courService } from "../../services/courService";
import { motion } from "framer-motion";
import { showSuccess, showError, showConfirm } from "../../utils/alert";
import { UserContext } from "../../context/UserContext";
import SidebarProfile from "../../components/user/SidebarProfile";

// Trạng thái với màu & label
const statusOptions = [
  { value: "WANT_TO_LEARN", label: "Muốn học", color: "#60A5FA" },
  { value: "LEARNING", label: "Đang học", color: "#FBBF24" },
  { value: "COMPLETED", label: "Đã hoàn thành", color: "#34D399" }
];

// Badge trạng thái đẹp, nổi bật
function StatusBadge({ value }) {
  const opt = statusOptions.find(o => o.value === value);
  if (!opt) return null;
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-bold shadow"
      style={{
        background: opt.color,
        color: "#fff",
        minWidth: 90,
        display: "inline-block",
        textAlign: "center",
        letterSpacing: "0.5px",
        boxShadow: "0 1px 6px #0001"
      }}
    >
      {opt.label}
    </span>
  );
}

// Button Group chọn trạng thái
function StatusButtonGroup({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {statusOptions.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          style={{
            background: value === opt.value ? opt.color : "#f3f4f6",
            color: value === opt.value ? "#fff" : "#222",
            fontWeight: value === opt.value ? 700 : 500,
            borderRadius: 999,
            padding: "6px 15px",
            border: value === opt.value ? `2px solid ${opt.color}` : "2px solid #e5e7eb",
            transition: "all 0.16s",
            fontSize: "13px",
            cursor: "pointer",
            minWidth: 90
          }}
          className="focus:outline-none"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// Số phần tử/trang
const PAGE_SIZE = 5;

const FavoriteCourses = () => {
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { user } = useContext(UserContext);
  const userId = user?.id;

  const fetchCourses = async () => {
    try {
      const res = await courService.findAllFavoriteCourses(userId, page, PAGE_SIZE);
      const rawCourses = res.result?.content || [];
      const formatted = rawCourses.map((item) => ({
        id: item.id,
        title: item.course.title,
        platform: item.course.provider,
        link: item.course.url,
        description: item.course.description,
        rating: item.course.rating,
        difficulty: item.course.difficulty,
        status: item.status,
        createdAt: item.createdAt,
        courseId: item.course.courseId,
      }));
      setCourses(formatted);
      setTotalPages(res.result?.totalPages || 1);
    } catch (err) {
      showError(err.message || "Lỗi khi tải khóa học yêu thích.");
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, [page]);

  const handleDelete = async (courseId) => {
    const confirm = await showConfirm("Bạn có chắc muốn xóa khóa học này không?");
    if (!confirm.isConfirmed) return;
    try {
      await courService.deleteFavoriteCourse(userId, courseId);
      showSuccess("Đã xóa khóa học khỏi danh sách yêu thích.");
      fetchCourses();
    } catch (err) {
      showError("Xóa khóa học thất bại.");
    }
  };

  const handleDeleteAll = async () => {
    const confirm = await showConfirm("Bạn có chắc muốn xóa TẤT CẢ khóa học yêu thích không?");
    if (!confirm.isConfirmed) return;
    try {
      await courService.deleteAllFavoriteCourse(userId);
      showSuccess("Đã xóa tất cả khóa học yêu thích.");
      fetchCourses();
    } catch (err) {
      showError("Xóa tất cả khóa học thất bại.");
    }
  };

  const handleChangeStatus = async (courseId, newStatus) => {
    try {
      await courService.changeFavoriteCourseStatus(courseId, userId, newStatus);
      showSuccess("Đã cập nhật trạng thái khóa học.");
      fetchCourses();
    } catch (err) {
      showError("Cập nhật trạng thái thất bại.");
    }
  };

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.platform.toLowerCase().includes(search.toLowerCase())
  );

 

  return (
  <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
    {/* Sidebar */}
   <SidebarProfile />

    {/* Main content */}
    <div className="flex-1">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h2 className="text-lg font-bold">Khóa học yêu thích của bạn</h2>
        <input
          type="text"
          placeholder="Tìm kiếm khóa học..."
          className="border border-gray-300 rounded-full px-4 py-2 text-sm w-[250px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Delete All */}
      <div className="text-right mb-4">
        <button
          onClick={handleDeleteAll}
          className="text-red-500 text-sm flex items-center gap-2 hover:text-red-700"
        >
          <FaTrashAlt /> Xóa tất cả khóa học yêu thích
        </button>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 py-16 text-base">
            Không có khóa học yêu thích nào.
          </div>
        )}
        {filtered.map((course) => (
          <motion.div
            key={course.courseId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="relative border border-gray-200 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Trái: tên, provider */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Star size={20} className="text-yellow-400" />
                  <span className="text-lg font-bold text-gray-900 truncate max-w-[340px]">
                    Tên khoá học: {course.title}
                  </span>
                </div>
                <div className="text-xs text-gray-500 pl-7 italic truncate max-w-[260px]">
                  Tác giả : {course.platform}
                </div>
              </div>
              {/* Phải: trạng thái, action */}
              <div className="flex items-center gap-4 mt-4 md:mt-0 flex-wrap">
                <div className="flex flex-col items-center mr-2">
                  <StatusButtonGroup
                    value={course.status}
                    onChange={val => handleChangeStatus(course.courseId, val)}
                  />
                </div>
                <span className="flex items-center gap-1 text-gray-700 text-sm font-medium">
                  <Star size={16} className="text-yellow-400" /> Đánh giá: {course.rating}
                </span>

                {/* ==== 3 BUTTON ACTION ==== */}
                <div className="flex items-center gap-2">
                  {course.link && (
                    <a
                      href={course.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-4 py-2 rounded-full bg-green-50 text-green-700 font-semibold text-xs shadow hover:bg-green-100 transition focus:ring-2 focus:ring-green-300"
                      style={{ minWidth: 120, justifyContent: "center" }}
                      title="Mở trang khóa học ngoài"
                    >
                      Đi đến khoá học
                    </a>
                  )}
                  <button
                    className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs shadow hover:bg-blue-100 transition focus:ring-2 focus:ring-blue-300"
                    style={{ minWidth: 108 }}
                    onClick={() => setSelectedCourse(course)}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => handleDelete(course.courseId)}
                    className="px-4 py-2 rounded-full bg-red-50 text-red-600 font-semibold text-xs shadow hover:bg-red-100 hover:text-red-700 transition focus:ring-2 focus:ring-red-300"
                    style={{ minWidth: 68 }}
                  >
                    Xóa
                  </button>
                </div>
                {/* ==== END 3 BUTTON ==== */}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-1 text-sm mt-8">
        <button
          className="border border-gray-300 rounded px-2 py-1 hover:bg-gray-100"
          onClick={() => setPage(1)}
          disabled={page === 1}
        >
          &lt;&lt;
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              page === i + 1 ? "bg-blue-700 text-white" : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="border border-gray-300 rounded px-2 py-1 hover:bg-gray-100"
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
        >
          &gt;&gt;
        </button>
      </div>
    </div>

    {/* Modal chi tiết */}
    {selectedCourse && (
      <div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/30"
        onClick={() => setSelectedCourse(null)}
      >
        <div
          className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative animate-fade-in"
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-3 right-4 text-2xl font-bold text-gray-400 hover:text-red-500"
            onClick={() => setSelectedCourse(null)}
          >
            ×
          </button>
          <h3 className="text-xl font-bold mb-3 text-blue-700 flex items-center gap-2">
            <Star className="text-yellow-400" /> {selectedCourse.title}
          </h3>
          <div className="mb-2 text-sm">
            <span className="font-semibold text-blue-900">Đánh giá:</span>{" "}
            <span className="text-yellow-600">{selectedCourse.rating}</span>
          </div>
          <div className="mb-2 text-sm">
            <span className="font-semibold text-blue-900">Độ khó:</span>{" "}
            <span>{selectedCourse.difficulty}</span>
          </div>
          <div className="mb-2 text-sm">
            <span className="font-semibold text-blue-900">Nhà cung cấp:</span>{" "}
            <span>{selectedCourse.platform}</span>
          </div>
          <div className="mb-3 text-sm">
            <span className="font-semibold text-blue-900">Miêu tả:</span>{" "}
            <span>{selectedCourse.description}</span>
          </div>
          <div className="mt-4">
            <a
              href={selectedCourse.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline font-semibold hover:text-blue-900"
            >
              Đến trang khóa học
            </a>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default FavoriteCourses;
