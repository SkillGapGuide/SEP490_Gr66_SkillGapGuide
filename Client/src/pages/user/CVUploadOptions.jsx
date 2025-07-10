import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CVUploadOptions = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded && uploaded.type === "application/pdf") {
      setFile(uploaded);
    } else {
      alert("Chỉ chấp nhận file PDF.");
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-start gap-8 mb-10">
          {/* Cột trái: tải file */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <label htmlFor="cv-upload" className="text-center cursor-pointer mb-3">
              <FiUpload className="text-yellow-500 text-3xl mx-auto mb-1" />
              <p className="text-blue-700 font-semibold underline">Tải lên CV của bạn (pdf)</p>
            </label>
            <input
              id="cv-upload"
              type="file"
              accept="application/pdf"
              onChange={handleUpload}
              className="hidden"
            />

            {/* Hiển thị file */}
            {file ? (
              <div className="mt-4 w-52 h-[300px] border rounded overflow-hidden shadow">
                <iframe
                  title="CV Preview"
                  src={URL.createObjectURL(file)}
                  className="w-full h-full"
                ></iframe>
              </div>
            ) : (
              <p className="text-gray-500 italic mt-4">Chưa có CV được tải lên</p>
            )}
          </div>

          {/* Cột phải: dropdown */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Nhóm nghề *</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option>Chọn nhóm nghề</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Nghề *</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option>Chọn nghề</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Chuyên môn *</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option>Chọn chuyên môn</option>
              </select>
            </div>
          </div>
        </div>

        {/* Yêu cầu tuyển dụng */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-center text-lg font-semibold text-blue-800 mb-6">Yêu cầu tuyển dụng</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Khối 1 */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg text-center shadow-sm">
              <p className="mb-4 font-medium">Tải lên yêu cầu tuyển dụng</p>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-full"
                onClick={() => navigate("/addCVwritejobdescription")}
              >
                Khám phá
              </button>
            </div>

            {/* Khối 2 */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg text-center shadow-sm">
              <p className="mb-4 font-medium">
                Nhập đường link từ{" "}
                <a href="https://topcv.vn" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  TopCV.vn
                </a>{" "}
                hoặc{" "}
                <a href="https://vieclam24h.vn" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  vieclam24h.vn
                </a>
              </p>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-full"
                onClick={() => navigate("/addCVfromTOPCVLink")}
              >
                Khám phá
              </button>
            </div>

            {/* Khối 3 */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg text-center shadow-sm">
              <p className="mb-4 font-medium">Hãy để SkillGapGuide tìm yêu cầu tuyển dụng giúp bạn!</p>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-full"
                onClick={() => navigate("/analysisCVAvailableJob1")}
              >
                Khám phá
              </button>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default CVUploadOptions;
