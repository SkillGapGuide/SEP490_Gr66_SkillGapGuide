import { useState, useEffect } from "react";
import { userAdminService } from "../../services/userAdminService";
import { showError, showSuccess } from "../../utils/alert";

// Update the roles and status constants to match API values
const roles = ["Tất cả", "System Admin", "Premium User", "Free User","Content Manager", "Finance Admin","Pro User"];
const statuses = ["Tất cả", "VERIFIED", "NOT_VERIFIED","BANNED"];

const statusLabel = {
  VERIFIED: { label: "Hoạt động", color: "text-green-600" },
  NOT_VERIFIED: { label: "Vô hiệu hóa", color: "text-red-500" },
  BANNED: { label: "Bị cấm", color: "text-red-500" }
};
const ROLE_ID = { "Content Manager": 2, "Finance Admin": 3 };
const ROLE_NAME = { 2: "Content Manager", 3: "Finance Admin" };
const getRoleId = (u) => u?.roleId ?? ROLE_ID[u?.role] ?? null;


const pageSizeOptions = [5, 10, 15];

function ManagerUser() {
  // Replace users state with API data
  const [users, setUsers] = useState({ content: [], totalElements: 0 });
  const [loading, setLoading] = useState(false);
  
  // Add new states for modals
  const [showDetail, setShowDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // State lọc, sort, phân trang
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("Tất cả");
  const [status, setStatus] = useState("Tất cả");
  const [page, setPage] = useState(0); // API uses 0-based indexing
  const [pageSize, setPageSize] = useState(5); // Replace const pageSize = 5
  // Remove sortBy state
  // const [sortBy, setSortBy] = useState({ field: "name", asc: true }); // Add sort state
  // const pageSize = 5;

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await userAdminService.getAllUsers({
          searchText: search,
          role: role === "Tất cả" ? "" : role,
          status: status === "Tất cả" ? "" : status,
          pageNo: page,
          pageSize: pageSize,
          // sortField: sortBy.field,
          // sortDirection: sortBy.asc ? "asc" : "desc"
        });
        console.log("Fetched users:", data);
        
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      setLoading(false);
    };
    fetchUsers();
  }, [search, role, status, page, pageSize]); // Update dependencies

  // Update view detail handler to fetch user details
  const handleViewDetail = (user) => {
  setSelectedUser(user);
  setShowDetail(true);
};


  // Xử lý sort click
  // const handleSort = (field) => {
  //   setSortBy(prev =>
  //     prev.field === field ? { field, asc: !prev.asc } : { field, asc: true }
  //   );
  // }

  // Update pagination handling for API
  const totalPages = users.totalPages || 1;
  
  function handlePage(to) {
    if (to >= 0 && to < totalPages) setPage(to
    );
  }

  const handleCreateUser = async (userData) => {
    // Add API call here
   
    const { name, email, phone, password, role } = userData;
    const newUser = {
      fullName: name,
      email,
      phone,    
      password,
      roleId: role
      // roleId 3 is for "Người dùng" and 2 is for "Admin"
    };
    console.log("Creating user with data:", newUser);
    try {
       await userAdminService.createAdminAccount(newUser);
       showSuccess("Tạo người dùng thành công");

    } catch (error) {
      showError("Error creating user: " + error.message);
      
    }
    setShowCreate(false);
  };
  const handleChangeRole = async (user, newRoleId) => {
  const current = getRoleId(user);
  if (current == null) return showError("Không xác định được vai trò hiện tại.");
  if (newRoleId === current) return showInfo("Vai trò không thay đổi.");

  const userId = user.userId ?? user.id; // đổi theo field id của API bạn
  if (!userId) return showError("Không xác định được userId.");

  try {
    await userAdminService.changeRole(userId, Number(newRoleId));
    showSuccess("Đã cập nhật vai trò.");
    // refresh list
    const data = await userAdminService.getAllUsers({
      searchText: search,
      role: role === "Tất cả" ? "" : role,
      status: status === "Tất cả" ? "" : status,
      pageNo: page,
      pageSize,
    });
    setUsers(data);
    // cập nhật ngay trên modal
    setSelectedUser((prev) =>
      prev ? { ...prev, roleId: Number(newRoleId), role: ROLE_NAME[newRoleId] ?? prev.role } : prev
    );
  } catch (e) {
    showError(e?.response?.data?.message || "Đổi vai trò thất bại.");
  }
};


  const handleStatusChange = async (user) => {
    try {
      if (user.status === 'BANNED') {
        await userAdminService.enableUser(user.email);
      } else {
        await userAdminService.disableUser(user.email);
      }
      // Refresh the data after status change
      const data = await userAdminService.getAllUsers({
        searchText: search,
        role: role === "Tất cả" ? "" : role,
        status: status === "Tất cả" ? "" : status,
        pageNo: page,
        pageSize: pageSize,
      });
      setUsers(data);
    } catch (error) {
      console.error("Error changing user status:", error);
    }
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
          onChange={e => { setSearch(e.target.value); setPage(0); }} // Changed from 1 to 0
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
          onChange={e => { setRole(e.target.value); setPage(0); }} // Changed from 1 to 0
        >
          {roles.map(r => <option key={r}>{r}</option>)}
        </select>
        <select
          className="bg-blue-200/60 px-4 py-2 rounded-md text-blue-900"
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(0); }} // Changed from 1 to 0
        >
          <option value="Tất cả">Tất cả</option>
          <option value="VERIFIED">Hoạt động</option>
          <option value="BANNED">Vô hiệu hóa</option>
        </select>

        {/* Add pageSize selector before create button */}
        <select
          className="bg-blue-200/60 px-4 py-2 rounded-md text-blue-900"
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

        {/* Update Create button */}
        <button 
          onClick={() => setShowCreate(true)}
          className="ml-auto bg-white border border-blue-400 text-blue-900 px-4 py-2 rounded-lg shadow hover:bg-blue-50 transition font-semibold"
        >
          Tạo mới tài khoản
        </button>
      </div>

      {/* Table - remove sort headers */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-blue-800 font-bold text-left">
              <th className="px-4 py-2">Họ và tên</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Số điện thoại</th>
              <th className="px-4 py-2">Vai trò</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">Loading...</td>
              </tr>
            ) : (
              users.content.map((u) => (
                <tr key={u.email} className="border-b border-blue-100 hover:bg-blue-50">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">
                    <a href={`mailto:${u.email}`} className="text-blue-700 underline">{u.email}</a>
                  </td>
                  <td className="px-4 py-2">{u.phone}</td>
                  <td className="px-4 py-2">{u.role}</td>
                  <td className={`px-4 py-2 font-semibold ${statusLabel[u.status].color}`}>
                    {statusLabel[u.status].label}
                  </td>
                  <td className="px-2 py-2 text-blue-600">
                    <button onClick={() => handleViewDetail(u)}>
                      <EyeIcon />
                    </button>
                  </td>
                </tr>
              ))
            )}
            {!loading && users.content.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-8">Không tìm thấy dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add total pages info */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-gray-600">
          Tổng số trang: {totalPages}
        </span>
        
        <div className="flex items-center gap-2">
          <button 
            className="px-3 py-1 rounded bg-blue-200 text-blue-800" 
            disabled={page === 0} 
            onClick={() => handlePage(page - 1)}
          >
            {"<"}
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${page === i ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"}`}
              onClick={() => handlePage(i)}
            >
              {i+1}
            </button>
          ))}
          <button 
            className="px-3 py-1 rounded bg-blue-200 text-blue-800" 
            disabled={page === totalPages - 1} 
            onClick={() => handlePage(page + 1)}
          >
            {">"}
          </button>
        </div>
      </div>

      {/* Add Modals */}
      {showDetail && (
        <UserDetailModal 
          user={selectedUser} 
          onClose={() => setShowDetail(false)}
          onStatusChange={handleStatusChange} 
          onChangeRole={handleChangeRole} // Add this line
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
function UserDetailModal({ user, onClose, onStatusChange,onChangeRole  }) { 
  const currentRoleId = user.roleId ?? ROLE_ID[user.role] ?? null;
  const canSwitch = currentRoleId === 2 || currentRoleId === 3;
  const [newRoleId, setNewRoleId] = useState(currentRoleId); // Add onStatusChange prop
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
            <span className="font-medium text-gray-600">Thao tác:</span>
            {canSwitch && (
           <div className="pt-4 border-t">
             
             <div className="flex items-center gap-2">
               <select
                 className="px-3 py-2 border rounded-md"
                 value={newRoleId}
                 onChange={(e) => setNewRoleId(Number(e.target.value))}
               >
                 <option value={3}>Quản lý tài chính</option>
                 <option value={2}>Quản lý nội dung</option>
               </select>
               <button
                 className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-60"
                 disabled={newRoleId === currentRoleId}
                 onClick={() => onChangeRole(user, newRoleId)}
               >
                 Cập nhật
               </button>
             </div>
           </div>
         )}
            <button
              onClick={() => onStatusChange(user)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                user.status === 'VERIFIED'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                user.status === 'VERIFIED' ? 'bg-red-500' : 'bg-green-500'
              }`}></span>
              {user.status === 'VERIFIED' ? 'Vô hiệu hóa tài khoản' : 'Kích hoạt tài khoản'}
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
    role: 1 // Default to "Người quản lí hệ thống"
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
              <option value="2">Người quản lí nội dung</option>
              <option value="3">Người quản lí tài chính</option>
              <option value="1">Người quản lí hệ thống </option>
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
