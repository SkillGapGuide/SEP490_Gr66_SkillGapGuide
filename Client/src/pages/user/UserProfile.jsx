import { useState, useRef } from "react";

const UserProfile = () => {
  const fileInputRef = useRef(null);
  // Giả lập dữ liệu user, có thể thay bằng props hoặc fetch API
  const [user, setUser] = useState({
    name: "Nguyễn A",
    email: "nguyena@gmail.com",
    phone: "0976 543 879",
    password: "******",
    avatar: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  });

  // Giả lập trạng thái editing (tuỳ biến theo ý bạn)
  const [edit, setEdit] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
  });

  // Handler khi click icon edit
  const handleEdit = (field) => setEdit((prev) => ({ ...prev, [field]: true }));

  // Handler lưu
  const handleSave = (e) => {
    e.preventDefault();
    setEdit({ name: false, email: false, phone: false, password: false });
    // Xử lý lưu API ở đây
    alert("Đã lưu thông tin!");
  };

  // Handler nhập liệu (demo)
  const handleChange = (e) =>
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({...prev, avatar: reader.result}));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Avatar & Thông tin */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <div className="relative group">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-32 h-32 rounded-full border-4 border-blue-200 object-cover shadow-lg transition-all duration-300 group-hover:border-blue-400"
            onClick={handleAvatarClick}
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
               onClick={handleAvatarClick}>
            <span className="text-white text-sm">Change Photo</span>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            className="hidden"
            accept="image/*"
          />
        </div>
        <div className="font-bold text-2xl text-blue-800">{user.name}</div>
        <div className="text-gray-500 text-lg">{user.email}</div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {/* Họ tên */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-blue-800">Họ và tên</label>
              <button
                type="button"
                onClick={() => handleEdit("name")}
                className="ml-2 text-gray-400 hover:text-blue-700"
                tabIndex={-1}
              >
                <EditIcon />
              </button>
            </div>
            {edit.name ? (
              <input
                className="w-full border-b-2 border-gray-300 focus:border-blue-400 px-3 py-2 text-gray-800 rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={user.name}
                name="name"
                onChange={handleChange}
                autoFocus
                onBlur={() => setEdit((e) => ({ ...e, name: false }))}
              />
            ) : (
              <div className="flex items-center h-10 text-gray-600">{user.name}</div>
            )}
          </div>

          {/* Số điện thoại */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-blue-800">Số điện thoại</label>
              <button
                type="button"
                onClick={() => handleEdit("phone")}
                className="ml-2 text-gray-400 hover:text-blue-700"
                tabIndex={-1}
              >
                <EditIcon />
              </button>
            </div>
            {edit.phone ? (
              <input
                className="w-full border-b-2 border-gray-300 focus:border-blue-400 px-3 py-2 text-gray-800 rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={user.phone}
                name="phone"
                onChange={handleChange}
                autoFocus
                onBlur={() => setEdit((e) => ({ ...e, phone: false }))}
              />
            ) : (
              <div className="flex items-center h-10 text-gray-600">{user.phone}</div>
            )}
          </div>

          {/* Email */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-blue-800">Email</label>
              <button
                type="button"
                onClick={() => handleEdit("email")}
                className="ml-2 text-gray-400 hover:text-blue-700"
                tabIndex={-1}
              >
                <EditIcon />
              </button>
            </div>
            {edit.email ? (
              <input
                className="w-full border-b-2 border-gray-300 focus:border-blue-400 px-3 py-2 text-gray-800 rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={user.email}
                name="email"
                onChange={handleChange}
                autoFocus
                onBlur={() => setEdit((e) => ({ ...e, email: false }))}
              />
            ) : (
              <div className="flex items-center h-10 text-gray-600">{user.email}</div>
            )}
          </div>

          {/* Mật khẩu */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-blue-800">Mật khẩu</label>
              <button
                type="button"
                onClick={() => handleEdit("password")}
                className="ml-2 text-gray-400 hover:text-blue-700"
                tabIndex={-1}
              >
                <EditIcon />
              </button>
            </div>
            {edit.password ? (
              <input
                className="w-full border-b-2 border-gray-300 focus:border-blue-400 px-3 py-2 text-gray-800 rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={user.password}
                name="password"
                type="text"
                onChange={handleChange}
                autoFocus
                onBlur={() => setEdit((e) => ({ ...e, password: false }))}
              />
            ) : (
              <div className="flex items-center h-10 text-gray-600">{user.password}</div>
            )}
          </div>

          {/* Nút lưu (full 2 cột) */}
          <div className="col-span-1 md:col-span-2 flex justify-center mt-10">
            <button
              type="submit"
              className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-3 px-16 rounded-full shadow-lg text-lg transition-all duration-300 ease-in-out hover:transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// SVG Icon edit
function EditIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0H7.5A2.5 2.5 0 005 15.5v3A1.5 1.5 0 006.5 20h3a2.5 2.5 0 002.5-2.5V15z" />
    </svg>
  );
}

export default UserProfile;
