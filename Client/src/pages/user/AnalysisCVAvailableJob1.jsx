import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const AnalysisCVAvailableJob1 = () => {
  const location = useLocation();
  const { sector, group, job } = location.state || {};

  return (
    <div className="min-h-screen bg-white px-6 py-10 flex flex-col md:flex-row gap-8 text-gray-800">
      {/* Cột bên trái */}
      <div className="w-full md:w-1/2 border rounded-xl shadow p-6 bg-blue-50">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Ngành nghề:</h2>
        <p className="text-red-600 mb-2">{sector || "Chưa chọn"}</p>

        <h2 className="text-lg font-bold text-gray-900 mb-4">Nghề:</h2>
        <p className="text-red-600 mb-2">{group || "Chưa chọn"}</p>

        <h2 className="text-lg font-bold text-gray-900 mb-4">Chuyên môn:</h2>
        <p className="text-red-600 mb-4">{job || "Chưa chọn"}</p>

        <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">Kỹ năng hiện tại của bạn</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>{job || "Chưa có chuyên môn"}</li>
          <li>Làm việc nhóm</li>
          <li>Chăm sóc khách hàng</li>
        </ul>
      </div>

      {/* Cột bên phải */}
      {/* Cột bên phải */}
<div className="w-full md:w-1/2 border rounded-xl shadow p-6 bg-white flex flex-col justify-center h-full">

        <h2 className="text-xl font-bold text-gray-900 mb-4">Kỹ năng còn thiếu</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Hệ thống gửi đến bạn phân tích kỹ năng còn thiếu theo từng công ty
            hiện có ngành của bạn trên thị trường.
          </li>
          <li>Bạn nhận được phần trăm phù hợp của bản thân với từng vị trí công việc.</li>
          <li>Bạn nhận được gợi ý khóa học phù hợp để cải thiện kỹ năng.</li>
          <li>Bạn nhận được gợi ý công việc phù hợp với kỹ năng hiện tại.</li>
        </ul>

        <div className="mt-6">
          <Link
            to="/analysisCVAvailableJob2"
            className="inline-flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full transition"
          >
            → Khám phá
            <FiSearch className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCVAvailableJob1;
