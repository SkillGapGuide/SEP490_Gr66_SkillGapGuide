import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { FiHeart } from "react-icons/fi";
import { userService } from "../../services/userService";
import SidebarProfile from "../../components/user/SidebarProfile";
import { UserContext } from "../../context/UserContext";
import { showConfirm, showError, showSuccess } from "../../utils/alert";

const PAGE_SIZE = 10;

const FavoriteSkills = () => {
  const { user } = useContext(UserContext);
  const userId = user?.id;
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const location = useLocation();

  const fetchSkills = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await userService.getFavoriteMissingSkills(userId, page, PAGE_SIZE);
      const apiSkills = res.result?.content || [];
      const formatted = apiSkills.map((item) => ({
        id: item.skillId,
        title: item.skillName,
        category: item.categoryName || "",
        description: `Được thêm vào lúc ${new Date(item.createdAt).toLocaleString()}`,
      }));
      setSkills(formatted);
      setTotalPages(res.result?.totalPages || 1);
    } catch (err) {
      console.error("Lỗi khi lấy kỹ năng yêu thích bị thiếu:", err);
      showError("Không thể tải danh sách kỹ năng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [userId, page]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const filteredSkills = skills.filter((skill) => {
    const q = searchTerm.toLowerCase();
    return (
      skill.title.toLowerCase().includes(q) ||
      (skill.category || "").toLowerCase().includes(q)
    );
  });

  const handleDelete = async (skillId) => {
    try {
      const result = await showConfirm(
        "Bạn có chắc muốn xóa kỹ năng này không?",
        "Xác nhận"
      );
      if (result.isConfirmed) {
        setDeletingId(skillId);
        await userService.deleteFavoriteSkill(userId, skillId);
        showSuccess("Kỹ năng đã được xóa thành công!");
        await fetchSkills(); // fetch lại sau khi xóa
      }
    } catch (error) {
      showError(error?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
      {/* Sidebar */}
      <SidebarProfile />

      {/* Main content */}
      <div className="flex-1">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-xl font-bold tracking-tight">Kỹ năng yêu thích của bạn</h2>
          <input
            type="text"
            placeholder="Tìm kỹ năng theo tên hoặc nhóm..."
            className="border border-gray-200 bg-white/70 rounded-full px-4 py-2 text-sm w-full sm:w-[280px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {/* Loading skeleton */}
          {loading && (
            <>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="h-3 w-24 rounded bg-gray-200 mb-2" />
                  <div className="h-4 w-3/4 rounded bg-gray-200 mb-2" />
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                </div>
              ))}
            </>
          )}

          {/* Empty state */}
          {!loading && filteredSkills.length === 0 && (
            <div className="text-center text-gray-500 py-12 rounded-2xl border border-dashed border-gray-200 bg-white">
              <FiHeart className="mx-auto mb-3 text-4xl" />
              <p className="font-medium">Bạn chưa có kỹ năng yêu thích nào</p>
              <p className="text-sm text-gray-400 mt-1">
                Thêm kỹ năng để theo dõi nhanh những gì bạn quan tâm.
              </p>
            </div>
          )}

          {/* List */}
          {!loading &&
            filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="relative border border-gray-200 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                {skill.category && (
                  <p className="text-xs font-medium text-blue-700/90 bg-blue-50 inline-block px-2 py-1 rounded-full mb-2">
                    {skill.category}
                  </p>
                )}

                <h3 className="text-base font-semibold text-gray-900 mb-1">
                 Kĩ năng : {skill.title}
                </h3>
                <p className="text-sm text-gray-600">{skill.description}</p>

                <button
                  onClick={() => handleDelete(skill.id)}
                  disabled={deletingId === skill.id}
                  className={`absolute top-4 right-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition
                    ${deletingId === skill.id
                      ? "bg-red-100 text-red-400 cursor-not-allowed"
                      : "text-red-600 hover:bg-red-50 border border-red-200"
                    }`}
                  title="Xóa kỹ năng"
                >
                  <AiOutlineDelete className="w-4 h-4" />
                  {deletingId === skill.id ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-1 text-sm mt-8">
          <button
            className="border rounded px-2 py-1 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => setPage(1)}
            disabled={page === 1 || loading}
            aria-label="Trang đầu"
          >
            «
          </button>
          <button
            className="border rounded px-2 py-1 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            aria-label="Trang trước"
          >
            ‹
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const p = i + 1;
            const isActive = page === p;
            return (
              <button
                key={p}
                className={`px-3 py-1 rounded border transition ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setPage(p)}
                disabled={loading}
              >
                {p}
              </button>
            );
          })}

          <button
            className="border rounded px-2 py-1 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            aria-label="Trang sau"
          >
            ›
          </button>
          <button
            className="border rounded px-2 py-1 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages || loading}
            aria-label="Trang cuối"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteSkills;
