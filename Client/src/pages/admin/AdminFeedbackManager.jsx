import { useState, useEffect } from "react";
import { Eye, Search, Star, X } from "lucide-react";
import { feedbackService } from "../../services/feedbackService";

// Trả về mảng các sao vàng
function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, idx) => (
        <Star
          key={idx}
          size={16}
          className={`${idx < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

const pageSizeOptions = [5, 10, 15];

export default function AdminFeedbackManager() {
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState(0);
  const [feedbacks, setFeedbacks] = useState({ content: [], totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // Changed to 0-based for API
  const [pageSize, setPageSize] = useState(5);
  const [selected, setSelected] = useState(null);

  // Add filtered data state
  const [filteredData, setFilteredData] = useState([]);

  // Fetch feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const data = await feedbackService.getAllFeedbacks({
          star: filterRating,
          pageNo: page,
          pageSize: pageSize // Use pageSize from state
        });
        setFeedbacks(data.result);
        console.log("Fetched feedbacks:", data.result);
        
        // Filter data locally
        const filtered = data.result.content.filter(f => 
          !search || 
          f.email.toLowerCase().includes(search.toLowerCase()) ||
          f.content.toLowerCase().includes(search.toLowerCase())
        );
        
        // Update filtered data
        setFilteredData(filtered);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
      setLoading(false);
    };
    fetchFeedbacks();
  }, [filterRating, page, pageSize]); // Remove search from dependencies

  // Add effect for handling search
  useEffect(() => {
    if (feedbacks.content) {
      const filtered = feedbacks.content.filter(f => 
        !search || 
        f.email.toLowerCase().includes(search.toLowerCase()) ||
        f.content.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [search, feedbacks.content]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Quản lý Feedback</h2>
        <div className="text-sm text-gray-500">
          Tổng số: {feedbacks.totalElements} feedback
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm theo email hoặc nội dung..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
          value={filterRating}
          onChange={e => { setFilterRating(Number(e.target.value)); setPage(0); }}
        >
          <option value={0}>Tất cả đánh giá</option>
          {[5, 4, 3, 2, 1].map(rating => (
            <option key={rating} value={rating}>
              {rating} sao
            </option>
          ))}
        </select>

        {/* Add pageSize selector */}
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
          value={pageSize}
          onChange={e => { 
            setPageSize(Number(e.target.value));
            setPage(0);
          }}
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size} dòng/trang
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đánh giá</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">Đang tải...</td>
              </tr>
            ) : filteredData.map((f,index) => (
              <tr key= {index}  className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{f.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">{f.content}</td>
                <td className="px-6 py-4"><StarRating rating={f.star} /></td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelected(f)}
                    className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded-full hover:bg-blue-50"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {!loading && filteredData.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-400 py-8">
                  {search ? "Không tìm thấy kết quả phù hợp" : "Không có dữ liệu"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{(page * pageSize) + 1}</span> đến{' '}
              <span className="font-medium">
                {Math.min((page + 1) * pageSize, feedbacks.totalElements)}
              </span> trong{' '}
              <span className="font-medium">{feedbacks.totalElements}</span> kết quả
            </p>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: feedbacks.totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  page === idx
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal with improved animations */}
      {selected && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out"></div>
          
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out animate-modal-slide-up">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span>Chi tiết Feedback</span>
                  <div className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs
                    ${selected.star >= 4 ? 'bg-green-100 text-green-700' : 
                      selected.star >= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {selected.star}/5
                  </div>
                </h3>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              
              <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-100">
                      {selected.email}
                    </div>
                  </div>
                  
                
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nội dung</label>
                    <div className="p-4 bg-gray-50 rounded-lg text-gray-800 border border-gray-100 whitespace-pre-wrap min-h-[120px]">
                      {selected.content}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Thời gian</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-100">
                      {selected.createdAt}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Đánh giá</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <StarRating rating={selected.star} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
