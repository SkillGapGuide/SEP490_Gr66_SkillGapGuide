import { useState } from "react";
import { Edit2 } from "lucide-react";

export default function HomePageManager() {
  // State cho table data
  const [form, setForm] = useState({
    year: "2019",
    title: "SkillGapGuide",
    phone: "559282 - 978",
  });
  // State cho field đang edit
  const [editing, setEditing] = useState(null);

  // Xử lý thay đổi field
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Khi nhấn icon edit
  const handleEdit = (field) => setEditing(field);

  // Khi blur hoặc enter thì lưu và tắt edit
  const handleBlur = () => setEditing(null);

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-md mt-6 shadow">
      <h2 className="text-2xl font-semibold text-blue-900 mb-4">Quản lý nội dung Home Page</h2>
      <table className="w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr className="border-b">
            <th className="pb-2">Năm bắt đầu</th>
            <th className="pb-2">Tên trang</th>
            <th className="pb-2">Số điện thoại liên hệ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            {/* Year */}
            <td>
              {editing === "year" ? (
                <input
                  name="year"
                  type="text"
                  value={form.year}
                  autoFocus
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border-b-2 border-blue-400 outline-none w-20"
                />
              ) : (
                <span className="text-gray-700">{form.year}</span>
              )}
            </td>
            {/* Title */}
            <td>
              {editing === "title" ? (
                <input
                  name="title"
                  type="text"
                  value={form.title}
                  autoFocus
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border-b-2 border-blue-400 outline-none"
                />
              ) : (
                <span className="text-gray-700">{form.title}</span>
              )}
            </td>
            {/* Phone */}
            <td>
              {editing === "phone" ? (
                <input
                  name="phone"
                  type="text"
                  value={form.phone}
                  autoFocus
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border-b-2 border-blue-400 outline-none w-28"
                />
              ) : (
                <span className="text-gray-700">{form.phone}</span>
              )}
            </td>
            {/* Edit Icon */}
            <td>
              <button
                className="p-1 hover:bg-blue-50 rounded"
                onClick={() => setEditing(editing ? null : "phone")}
                tabIndex={-1}
                title="Sửa"
              >
                <Edit2 size={20} className="text-blue-900" onClick={() => setEditing("year")} />
                <Edit2 size={20} className="text-blue-900 ml-2" onClick={() => setEditing("title")} />
                <Edit2 size={20} className="text-blue-900 ml-2" onClick={() => setEditing("phone")} />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Button Lưu */}
      <div className="flex justify-center mt-8">
        <button className="bg-blue-800 text-white font-semibold px-8 py-2 rounded-lg shadow hover:bg-blue-900 transition">
          Lưu
        </button>
      </div>
    </div>
  );
}
