import React, { useState } from "react";
import { FiUploadCloud, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AddCVWriteJobDescription = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  

  const handleUpload = (e, index) => {
    const uploaded = e.target.files[0];
    if (uploaded && uploaded.type === "application/pdf") {
      const updated = [...files];
      updated[index] = uploaded;
      setFiles(updated);
    } else {
      alert("Chỉ chấp nhận file PDF.");
    }
  };

  const addFileSlot = () => {
  if (files.length >= 5) {
    alert("Bạn chỉ có thể thêm tối đa 5 file.");
    return;
  }
  setFiles([...files, null]);
};


  const removeFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Cột bên trái: danh sách file */}
        <div className="md:col-span-2 border rounded-lg p-4 bg-blue-50 shadow-sm">
          <h2 className="font-bold text-indigo-800 mb-4 text-lg">Tải lên yêu cầu tuyển dụng (pdf)</h2>

          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-2 mb-3 group">
              <label
                htmlFor={`file-${index}`}
                className="flex-1 flex justify-between items-center bg-white border border-gray-300 px-3 py-2 rounded cursor-pointer hover:bg-gray-50 text-sm"
              >
                {file ? file.name : `Job ${index + 1} description.pdf`}
                <FiUploadCloud className="text-gray-500" />
              </label>
              <input
                type="file"
                id={`file-${index}`}
                accept="application/pdf"
                onChange={(e) => handleUpload(e, index)}
                className="hidden"
              />
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 transition"
                title="Xóa"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}

          <button
  onClick={addFileSlot}
  disabled={files.length >= 5}
  className={`mt-2 text-sm underline transition ${
    files.length >= 5
      ? "text-gray-400 cursor-not-allowed"
      : "text-blue-600 hover:text-blue-800"
  }`}
>
  + Thêm lựa chọn
</button>

        </div>

        {/* Cột bên phải: xem preview PDF */}
        <div className="md:col-span-3 p-4 bg-white border rounded-lg shadow min-h-[500px]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {files.map(
              (file, index) =>
                file && (
                  <div key={index} className="text-center">
                    <div className="border h-[220px] rounded overflow-hidden shadow mb-1">
                      <iframe
                        src={URL.createObjectURL(file)}
                        title={`Preview-${index}`}
                        className="w-full h-full"
                      ></iframe>
                    </div>
                    <p className="text-sm text-gray-700 truncate">{file.name}</p>
                  </div>
                )
            )}
          </div>
        </div>
      </div>

      {/* Nút điều hướng xem kết quả */}
      <div className="text-center mt-8">
        <button
          className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          onClick={() => navigate("/addcvwritejobdescription1")}
        >
          → Xem kết quả
        </button>
      </div>
    </div>
  );
};

export default AddCVWriteJobDescription;
