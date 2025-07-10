import React, { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; 
const AddCVFromTOPCVLink = () => {
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
 const navigate = useNavigate();
  const handleUpload = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded && uploaded.type === "application/pdf") {
      setFile(uploaded);
    } else {
      alert("Chỉ chấp nhận file PDF.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Cột nhập link */}
        <div className="border rounded-lg p-6 bg-blue-50 shadow-sm">
          <h2 className="font-bold text-indigo-800 mb-3 text-lg">Nhập đường link lấy từ TOP CV</h2>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Đường link của bạn"
            className="w-full p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-sm"
          />
        </div>


           
        </div>
        <button
        className="mt-6 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        onClick={() => navigate("/analysislinkingjob")}
      >
        → Xem kết quả
      </button>
      </div>
   
  );
};

export default AddCVFromTOPCVLink;
