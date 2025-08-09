import { useEffect, useState, useRef } from "react";
import { userService } from "../../services/userService";
import { showError, showSuccess } from "../../utils/alert";
import { uploadImageToSupabase } from '../../config/uploadImageSupabase';
import { FiUser, FiHeart, FiCheckCircle } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import SidebarProfile from "../../components/user/SidebarProfile";

const UserProfile = () => {
 const { setUser: setUserContext } = useContext(UserContext);
  const fileInputRef = useRef(null);
  const [fileAvatar, setFileAvatar] = useState(null);
  const [user, setUser] = useState({ fullName: "", email: "", phone: "", avatar: "", role: "" });
  const [edit, setEdit] = useState({ fullName: false, phone: false });
  const [previewImage, setPreviewImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [changedAvatar, setChangedAvatar] = useState(false);
  const location = useLocation();
 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.viewProfile();
        setUser((prev) => ({ ...prev, ...data }));
      } catch (err) {
        showError("Không thể tải thông tin người dùng.");
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = (field) => setEdit((prev) => ({ ...prev, [field]: true }));
  const handleChange = (e) => setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleAvatarClick = () => fileInputRef.current.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        showError("Dung lượng ảnh tối đa 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, avatar: reader.result }));
        setFileAvatar(file);
        setShowPreview(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    for (const key of ["fullName", "phone"]) {
      if (!user[key] || user[key].trim() === "") {
        showError(key === "phone" ? "Số điện thoại không được để trống." : "Tên không được để trống.");
        return;
      }
    }
    if (!/^\d{10}$/.test(user.phone)) {
    showError("Số điện thoại phải gồm đúng 10 chữ số.");
    return;
  }
    let imageUrl = user.avatar;
    if (fileAvatar) {
      try {
        imageUrl = await uploadImageToSupabase(fileAvatar, "fpt-image");
      } catch (err) {
        showError("Không thể upload ảnh lên Supabase.");
        return;
      }
    }

    try {
       await userService.updateProfile({ fullName: user.fullName, phone: user.phone, avatar: imageUrl });
  showSuccess("Cập nhật thành công!");
  setEdit({ fullName: false, phone: false });

  // Cập nhật context và localStorage sau khi đổi avatar
  const newUser = { ...user, avatar: imageUrl };
  setUser(newUser); // set vào context
  setUserContext(newUser);
  localStorage.setItem('user', JSON.stringify(newUser)); // set vào localStorage (cần thiết nếu dùng user từ localStorage ở đâu đó)
    } catch (err) {
      showError("Lỗi khi cập nhật thông tin.");
    }
  };

 

 return (
  <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
    <SidebarProfile />

    <div className="flex-1 flex flex-col items-center">
      {/* Phần Avatar + Thông tin cơ bản */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-3 mb-10">
        <div className="relative group cursor-pointer">
          <img
            src={user.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
            alt="avatar"
            className="w-36 h-36 rounded-full border-4 border-blue-300 object-cover shadow-lg transition-all duration-300 group-hover:brightness-95 group-hover:scale-105"
            onClick={handleAvatarClick}
          />
          <div
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleAvatarClick}
          >
            <span className="text-white text-base font-semibold tracking-wide">
              Thay ảnh
            </span>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
        </div>
        <div className="font-extrabold text-2xl text-blue-800 text-center">{user.fullName}</div>
        <div className="text-gray-500 text-base text-center">{user.email}</div>
      </div>

      {/* Thông tin chi tiết & Form */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          <FormField
            label="Họ và tên"
            field="fullName"
            value={user.fullName}
            editing={edit.fullName}
            onEdit={handleEdit}
            onChange={handleChange}
            onBlur={() => setEdit((e) => ({ ...e, fullName: false }))}
          />
          <FormField
            label="Số điện thoại"
            field="phone"
            value={user.phone}
            editing={edit.phone}
            onEdit={handleEdit}
            onChange={handleChange}
            onBlur={() => setEdit((e) => ({ ...e, phone: false }))}
          />
          <div>
            <label className="font-semibold text-blue-800 block mb-1">Email</label>
            <div className="flex items-center h-10 text-gray-700">{user.email}</div>
          </div>
          <div>
            <label className="font-semibold text-blue-800 block mb-1">Vai trò</label>
            <div className="flex items-center h-10 text-gray-700 capitalize">{user.role}</div>
          </div>
          <div className="col-span-1 md:col-span-2 flex justify-center mt-8">
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-14 rounded-full shadow-lg text-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>

    {/* Modal Preview */}
    {showModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-7 rounded-2xl shadow-2xl text-center max-w-sm w-full animate-fade-in">
          <h3 className="text-lg font-bold mb-4 text-blue-800">Xem trước ảnh đại diện</h3>
          <img src={previewImage} alt="Preview" className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-blue-300 mb-5" />
          <div className="flex justify-center gap-4">
            <button
              className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
              onClick={() => {
                setUser((prev) => ({ ...prev, avatar: previewImage }));
                setChangedAvatar(true);
                setShowModal(false);
              }}
            >
              Dùng ảnh này
            </button>
            <button
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-400 transition"
              onClick={() => {
                setShowModal(false);
                setPreviewImage(null);
              }}
            >
              Huỷ
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

const FormField = ({ label, field, value, editing, onEdit, onChange, onBlur }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <label className="font-bold text-blue-800">{label}</label>
      <button type="button" onClick={() => onEdit(field)} className="text-gray-400 hover:text-blue-700" tabIndex={-1}>
        <EditIcon />
      </button>
    </div>
    {editing ? (
      <input
        name={field}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="w-full border-b-2 border-gray-300 focus:border-blue-400 px-3 py-2 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        autoFocus
      />
    ) : (
      <div className="flex items-center h-10 text-gray-600">{value}</div>
    )}
  </div>
);

const EditIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0H7.5A2.5 2.5 0 005 15.5v3A1.5 1.5 0 006.5 20h3a2.5 2.5 0 002.5-2.5V15z" />
  </svg>
);

export default UserProfile;