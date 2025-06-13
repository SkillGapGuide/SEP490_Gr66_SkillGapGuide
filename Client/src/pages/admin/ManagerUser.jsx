import { useState } from "react";

// Demo data
const initUsers = [
  { name: "Nguyen A", email: "A@example.com", phone: "0345 678 907", role: "Người dùng", status: "active" },
  { name: "Tran B", email: "B@example.com", phone: "0678 654 356", role: "Admin", status: "active" },
  { name: "Le C", email: "C@example.com", phone: "0987 609 879", role: "Người dùng", status: "active" },
  { name: "Dang D", email: "D@example.com", phone: "0987 673 412", role: "Người dùng", status: "inactive" },
  // Thêm nhiều dòng hơn để test phân trang!
];

const roles = ["Tất cả", "Admin", "Người dùng"];
const statuses = ["Tất cả", "active", "inactive"];

const statusLabel = {
  active: { label: "Hoạt động", color: "text-green-600" },
  inactive: { label: "Vô hiệu hóa", color: "text-red-500" }
};

function ManagerUser() {
  // Add new states for modals
  const [showDetail, setShowDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // State lọc, sort, phân trang
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("Tất cả");
  const [status, setStatus] = useState("Tất cả");
  const [sortBy, setSortBy] = useState({ field: "name", asc: true });
  const [page, setPage] = useState(1);
  const pageSize = 3;

  // Lọc
  let filtered = initUsers.filter(
    u =>
      (search === "" ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())) &&
      (role === "Tất cả" || u.role === role) &&
      (status === "Tất cả" || u.status === status)
  );

  // Sắp xếp
  filtered.sort((a, b) => {
    const f = sortBy.field;
    if (a[f] < b[f]) return sortBy.asc ? -1 : 1;
    if (a[f] > b[f]) return sortBy.asc ? 1 : -1;
    return 0;
  });

  // Phân trang
  const totalPage = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Xử lý sort click
  function handleSort(field) {
    setSortBy(prev =>
      prev.field === field ? { field, asc: !prev.asc } : { field, asc: true }
    );
  }

  // Xử lý phân trang
  function handlePage(to) {
    if (to >= 1 && to <= totalPage) setPage(to);
  }

  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setShowDetail(true);
  };

  const handleCreateUser = (userData) => {
    // Add API call here
    console.log('Create user:', userData);
    setShowCreate(false);
  };

  const handleStatusChange = (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    // Update user status in the list
    const updatedUsers = initUsers.map(u => 
      u.email === user.email ? { ...u, status: newStatus } : u
    );
    // In real app, make API call here
    console.log(`Changed status for ${user.email} to ${newStatus}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Quản lý người dùng</h1>
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          className="bg-blue-200/60 px-4 py-2 rounded-md placeholder-white focus:outline-none w-72"
          placeholder="Nhập tên / email người dùng"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <button className="bg-blue-200 px-4 py-2 rounded-md ml-[-44px]">
          <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-2.5-2.5" />
          </svg>
        </button>
        <select
          className="bg-blue-200/60 px-4 py-2 rounded-md text-blue-900"
          value={role}
          onChange={e => { setRole(e.target.value); setPage(1); }}
        >
          {roles.map(r => <option key={r}>{r}</option>)}
        </select>
        <select
          className="bg-blue-200/60 px-4 py-2 rounded-md text-blue-900"
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="Tất cả">Tất cả</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Vô hiệu hóa</option>
        </select>
        {/* Update Create button */}
        <button 
          onClick={() => setShowCreate(true)}
          className="ml-auto bg-white border border-blue-400 text-blue-900 px-4 py-2 rounded-lg shadow hover:bg-blue-50 transition font-semibold"
        >
          Tạo mới tài khoản
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-blue-800 font-bold text-left">
              <ThSort label="Họ và tên" sortBy={sortBy} field="name" onSort={handleSort} />
              <ThSort label="Email" sortBy={sortBy} field="email" onSort={handleSort} />
              <ThSort label="Số điện thoại" sortBy={sortBy} field="phone" onSort={handleSort} />
              <ThSort label="Vai trò" sortBy={sortBy} field="role" onSort={handleSort} />
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((u, idx) => (
              <tr key={u.email} className="border-b border-blue-100 hover:bg-blue-50">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">
                  <a href={`mailto:${u.email}`} className="text-blue-700 underline">{u.email}</a>
                </td>
                <td className="px-4 py-2">{u.phone}</td>
                <td className="px-4 py-2">{u.role}</td>
                <td className={`px-4 py-2 font-semibold ${statusLabel[u.status].color}`}>
                  <button 
                    onClick={() => handleStatusChange(u)}
                    className="flex items-center gap-2 hover:opacity-80"
                  >
                    <span className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {statusLabel[u.status].label}
                  </button>
                </td>
                {/* Update eye button in table */}
                <td className="px-2 py-2 text-blue-600">
                  <button onClick={() => handleViewDetail(u)}>
                    <EyeIcon />
                  </button>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-8">Không tìm thấy dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button className="px-3 py-1 rounded bg-blue-200 text-blue-800" disabled={page === 1} onClick={() => handlePage(page - 1)}>{"<"}</button>
        {Array.from({ length: totalPage }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded ${page === i + 1 ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"}`}
            onClick={() => handlePage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button className="px-3 py-1 rounded bg-blue-200 text-blue-800" disabled={page === totalPage} onClick={() => handlePage(page + 1)}>{">"}</button>
      </div>

      {/* Add Modals */}
      {showDetail && (
        <UserDetailModal 
          user={selectedUser} 
          onClose={() => setShowDetail(false)} 
        />
      )}
      
      {showCreate && (
        <CreateUserModal 
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreateUser}
        />
      )}
    </div>
  );
}

// Th icon sort
function ThSort({ label, sortBy, field, onSort }) {
  return (
    <th
      className="px-4 py-2 cursor-pointer select-none"
      onClick={() => onSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        {sortBy.field === field && (
          <svg
            className={`w-3 h-3 ml-0.5 inline ${sortBy.asc ? "" : "rotate-180"}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </span>
    </th>
  );
}

// Eye icon
function EyeIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        d="M1.458 12C2.732 7.943 6.523 5 12 5c5.477 0 9.268 2.943 10.542 7-1.274 4.057-5.065 7-10.542 7-5.477 0-9.268-2.943-10.542-7z" />
      <circle cx="12" cy="12" r="3" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Add Modal Components
function UserDetailModal({ user, onClose }) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 w-full max-w-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-800">Chi tiết người dùng</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <DetailRow label="Họ và tên" value={user.name} />
          <DetailRow label="Email" value={user.email} />
          <DetailRow label="Số điện thoại" value={user.phone} />
          <DetailRow label="Vai trò" value={user.role} />
          <DetailRow label="Trạng thái" value={statusLabel[user.status].label} />
          <div className="flex items-center justify-between pt-4 border-t">
            <span className="font-medium text-gray-600">Trạng thái:</span>
            <button
              onClick={() => handleStatusChange(user)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                user.status === 'active' 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              {statusLabel[user.status].label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateUserModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Người dùng'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 w-full max-w-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-800">Tạo mới tài khoản</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField 
            label="Họ và tên"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <InputField 
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <InputField 
            label="Số điện thoại"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <InputField 
            label="Mật khẩu"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Người dùng">Người dùng</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Tạo mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex">
      <span className="font-medium text-gray-600 w-32">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}

function InputField({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  );
}

export default ManagerUser;
