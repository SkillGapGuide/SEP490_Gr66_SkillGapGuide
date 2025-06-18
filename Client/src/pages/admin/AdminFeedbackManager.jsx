import { useState } from "react";
import { Eye, Search, Star, X } from "lucide-react";

// Dữ liệu giả lập (dùng API thật chỉ cần thay đổi)
const DUMMY_FEEDBACK = [
  {
    id: 1,
    email: "nguyena@gmail.com",
    userName: "Nguyen Van A",
    content: "Tốt, tôi rất thích",
    rating: 5,
    createdAt: "08:01:24 11/06/2025",
  },
  {
    id: 2,
    email: "tranlinh@gmail.com",
    userName: "Tran Linh",
    content: "Cũng ổn, tôi muốn nhiều chức năng hơn.",
    rating: 4,
    createdAt: "09:15:33 11/06/2025",
  },
];

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

export default function AdminFeedbackManager() {
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [feedbacks] = useState(DUMMY_FEEDBACK);

  // Phân trang
  const pageSize = 2;
  const [page, setPage] = useState(1);

  // Modal chi tiết
  const [selected, setSelected] = useState(null);

  // Filter & search
  const filtered = feedbacks.filter(f =>
    (!search ||
      f.email.toLowerCase().includes(search.toLowerCase()) ||
      f.content.toLowerCase().includes(search.toLowerCase()))
    && (!filterRating || String(f.rating) === filterRating)
  );
  const pageCount = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Quản lý Feedback</h2>
        <div className="text-sm text-gray-500">
          Tổng số: {filtered.length} feedback
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
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
          value={filterRating}
          onChange={e => { setFilterRating(e.target.value); setPage(1); }}
        >
          <option value="">Tất cả đánh giá</option>
          {[5, 4, 3, 2, 1].map(rating => (
            <option key={rating} value={rating}>
              {rating} sao
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
            {paginated.map(f => (
              <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{f.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">{f.content}</td>
                <td className="px-6 py-4"><StarRating rating={f.rating} /></td>
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
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{((page - 1) * pageSize) + 1}</span> đến{' '}
              <span className="font-medium">{Math.min(page * pageSize, filtered.length)}</span> trong{' '}
              <span className="font-medium">{filtered.length}</span> kết quả
            </p>
          </div>
          <div className="flex gap-2">
            {[...Array(pageCount)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx + 1)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  page === idx + 1
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
                    ${selected.rating >= 4 ? 'bg-green-100 text-green-700' : 
                      selected.rating >= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {selected.rating}/5
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
                    <label className="text-sm font-medium text-gray-700">Người dùng</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-100">
                      {selected.userName}
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
                      <StarRating rating={selected.rating} />
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
