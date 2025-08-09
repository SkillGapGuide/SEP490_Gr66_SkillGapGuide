// src/pages/FavoriteJobs.jsx

import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FaTrashAlt } from "react-icons/fa";
import { FiUser, FiHeart, FiCheckCircle } from "react-icons/fi";
import { Star } from "lucide-react";
import SidebarProfile from "../../components/user/SidebarProfile";
import { jobService } from "../../services/jobService";
import { showSuccess, showError, showConfirm } from "../../utils/alert";
import { UserContext } from "../../context/UserContext";
import { RiBuilding4Line, RiLinksLine } from "react-icons/ri";

const PAGE_SIZE = 5;

const FavoriteJobs = () => {
  const { user } = useContext(UserContext);
  const userId = user?.id;
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch danh sách công việc yêu thích
  const fetchJobs = async () => {
    try {
      const res = await jobService.getFavouriteJobs();
      // Dữ liệu trả về: res.result là mảng công việc
      const data = Array.isArray(res.result) ? res.result : [];
      setJobs(data);
      setTotalPages(Math.max(1, Math.ceil(data.length / PAGE_SIZE)));
    } catch (err) {
      showError(err.message || "Lỗi khi tải danh sách công việc yêu thích.");
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, [page]);

  // Xóa một công việc khỏi danh sách yêu thích
  const handleDelete = async (jobId) => {
    const confirm = await showConfirm("Bạn có chắc muốn xóa công việc này khỏi danh sách yêu thích?");
    if (!confirm.isConfirmed) return;
    try {
      await jobService.removeFavouriteJob(jobId);
      showSuccess("Đã xóa công việc khỏi danh sách yêu thích.");
      fetchJobs();
    } catch (err) {
      showError("Xóa công việc thất bại.");
    }
  };

  // Tìm kiếm theo tên công việc hoặc tên công ty
  const filtered = jobs.filter(
    (j) =>
      (j.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (j.company || "").toLowerCase().includes(search.toLowerCase())
  );

  // Lấy dữ liệu theo page (do API trả về toàn bộ, cần slice thủ công)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // --------- UI ----------
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
      {/* Sidebar */}
      <SidebarProfile />

      {/* Main content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <h2 className="text-lg font-bold">Công việc yêu thích của bạn</h2>
          <input
            type="text"
            placeholder="Tìm kiếm công việc..."
            className="border border-gray-300 rounded-full px-4 py-2 text-sm w-[250px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Xóa tất cả nếu muốn (có thể tắt đi) */}
        {/* <div className="text-right mb-4">
          <button
            onClick={handleDeleteAll}
            className="text-red-500 text-sm flex items-center gap-2 hover:text-red-700"
          >
            <FaTrashAlt /> Xóa tất cả công việc yêu thích
          </button>
        </div> */}

        {/* Job List */}
        <div className="space-y-4">
          {paginated.length === 0 ? (
            <div className="text-center text-gray-400 py-16 text-base">
              Không có công việc yêu thích nào.
            </div>
          ) : (
            paginated.map((job) => (
              <motion.div
                key={job.jobId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="relative border border-gray-200 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Trái: Thông tin công việc */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FiHeart className="text-red-400" />
                      <span className="text-lg font-bold text-gray-900 truncate max-w-[340px]">
                        {job.title}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 pl-7 italic truncate max-w-[260px] flex items-center gap-1">
                      <RiBuilding4Line className="text-blue-400" />
                      <span>Công ty: {job.company}</span>
                    </div>
                  </div>
                  {/* Phải: Action */}
                  <div className="flex items-center gap-4 mt-4 md:mt-0 flex-wrap">
                    {/* Link JD */}
                    {job.sourceUrl && (
                      <a
                        href={job.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-4 py-2 rounded-full bg-green-50 text-green-700 font-semibold text-xs shadow hover:bg-green-100 transition focus:ring-2 focus:ring-green-300"
                        style={{ minWidth: 120, justifyContent: "center" }}
                        title="Xem JD ngoài"
                      >
                        <RiLinksLine /> Xem JD
                      </a>
                    )}
                    {/* Xem chi tiết */}
                    <button
                      className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs shadow hover:bg-blue-100 transition focus:ring-2 focus:ring-blue-300"
                      style={{ minWidth: 108 }}
                      onClick={() => setSelectedJob(job)}
                    >
                      Xem chi tiết
                    </button>
                    {/* Xóa */}
                    <button
                      onClick={() => handleDelete(job.jobId)}
                      className="px-4 py-2 rounded-full bg-red-50 text-red-600 font-semibold text-xs shadow hover:bg-red-100 hover:text-red-700 transition focus:ring-2 focus:ring-red-300"
                      style={{ minWidth: 68 }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
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
        )}
      </div>

      {/* Modal chi tiết công việc */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/30"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-4 text-2xl font-bold text-gray-400 hover:text-red-500"
              onClick={() => setSelectedJob(null)}
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-3 text-blue-700 flex items-center gap-2">
              <FiHeart className="text-red-400" /> {selectedJob.title}
            </h3>
            <div className="mb-2 text-sm">
              <span className="font-semibold text-blue-900">Công ty:</span>{" "}
              <span className="text-gray-800">{selectedJob.company}</span>
            </div>
            <div className="mb-2 text-sm">
              <span className="font-semibold text-blue-900">Ngày lưu:</span>{" "}
              <span className="text-gray-600">
                {new Date(selectedJob.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="mb-3 text-sm">
              <span className="font-semibold text-blue-900">Mô tả:</span>{" "}
              <span
                className="block max-h-[250px] overflow-auto text-gray-700 mt-1"
                dangerouslySetInnerHTML={{ __html: selectedJob.description }}
              />
            </div>
            {selectedJob.sourceUrl && (
              <div className="mt-4">
                <a
                  href={selectedJob.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline font-semibold hover:text-blue-900"
                >
                  Đến trang JD gốc
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteJobs;
