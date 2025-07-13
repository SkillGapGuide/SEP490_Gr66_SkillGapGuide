import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import TopMenu from "./TopMenu";

const CVUploadOptions = () => {
  const [topcvLinks, setTopcvLinks] = useState([]);
const [newLink, setNewLink] = useState("");

  const [cvFile, setCVFile] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [showPopup, setShowPopup] = useState("");
  const [jobFiles, setJobFiles] = useState([]);

  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (file?.type === "application/pdf") setCVFile(file);
    else alert("Chỉ chấp nhận file PDF.");
  };

  const handleJobFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") return alert("Chỉ chấp nhận file PDF.");
    if (jobFiles.length >= 5) return alert("Tối đa 5 file mô tả!");

    setJobFiles([...jobFiles, file]);
  };

  const handleRadioChange = (value) => {
    setSelectedOption(value);
    if (value === "upload") setShowPopup("upload");
    else if (value === "link") setShowPopup("link");
    else if (value === "auto") {
      alert("✔️ Đã chọn thành công! SkillGapGuide sẽ giúp bạn.");
    }
  };

  return (
    <>
    <div className="  max-w-7xl mx-auto">
        <TopMenu />
        </div>
      

      <div className="min-h-screen bg-white py-10 px-6 max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: CV Upload */}
          <div className="flex flex-col items-center border-r md:pr-6">
            <label htmlFor="cv-upload" className="cursor-pointer text-center mb-3">
              <FiUpload className="text-yellow-500 text-3xl mx-auto mb-1" />
              <p className="text-blue-700 font-semibold underline">Tải lên CV của bạn (pdf)</p>
            </label>
            <input
              id="cv-upload"
              type="file"
              accept="application/pdf"
              onChange={handleCVUpload}
              className="hidden"
            />
            {cvFile ? (
              <div className="mt-4 w-52 h-[300px] border rounded overflow-hidden shadow">
                <iframe title="CV" src={URL.createObjectURL(cvFile)} className="w-full h-full" />
              </div>
            ) : (
              <p className="text-gray-500 italic mt-4">Chưa có CV được tải lên</p>
            )}
          </div>

          {/* Right Column: Dropdowns + Requirements */}
          <div className="flex flex-col gap-6">
            {/* Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="border px-3 py-2 rounded">
                <option>Nhóm nghề</option>
              </select>
              <select className="border px-3 py-2 rounded">
                <option>Nghề</option>
              </select>
              <select className="border px-3 py-2 rounded">
                <option>Chuyên môn</option>
              </select>
              <select className="border px-3 py-2 rounded">
                <option>Kinh nghiệm</option>
              </select>
            </div>

            {/* Job Requirement */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h2 className="text-center text-lg font-semibold text-blue-800 mb-4">Yêu cầu tuyển dụng</h2>
              <div className="space-y-3 text-gray-800">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="jobRequirement"
                    value="upload"
                    checked={selectedOption === "upload"}
                    onChange={() => handleRadioChange("upload")}
                  />
                  Tải lên yêu cầu tuyển dụng
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="jobRequirement"
                    value="link"
                    checked={selectedOption === "link"}
                    onChange={() => handleRadioChange("link")}
                  />
                  Nhập đường dẫn yêu cầu tuyển dụng từ{" "}
                  <a href="https://topcv.vn" target="_blank" rel="noreferrer" className="text-blue-600 underline">
                    TOPCV
                  </a>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="jobRequirement"
                    value="auto"
                    checked={selectedOption === "auto"}
                    onChange={() => handleRadioChange("auto")}
                  />
                  Hãy để Skill Gap Guide giúp bạn!
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Popup: Upload Description Files */}
        {showPopup === "upload" && (
          <div className="transition-transform duration-300 fixed top-24 right-1/2 translate-x-1/2 bg-white shadow-lg border border-gray-200 p-6 rounded-lg w-96 z-50">
            <h3 className="text-lg font-bold mb-4 text-center">Tải lên yêu cầu tuyển dụng</h3>
            <ul className="text-sm mb-4 list-disc list-inside">
              {jobFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
            {jobFiles.length < 5 && (
              <div className="text-center mb-4">
                <label htmlFor="job-upload" className="text-red-600 font-semibold cursor-pointer underline">
                  + Thêm file mô tả
                </label>
                <input
                  id="job-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleJobFileUpload}
                  className="hidden"
                />
              </div>
            )}
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full py-2 rounded"
              onClick={() => setShowPopup("")}
            >
              Hoàn thành
            </button>
          </div>
        )}

        {/* Popup: Input TOPCV link */}
        {showPopup === "link" && (
  <div className="transition-transform duration-300 fixed top-24 right-1/2 translate-x-1/2 bg-white shadow-lg border border-gray-200 p-6 rounded-lg w-96 z-50">
    <h3 className="text-lg font-bold mb-3 text-center">Nhập đường dẫn từ TOPCV</h3>

    {/* Danh sách link đã thêm */}
    {topcvLinks.length > 0 && (
      <ul className="text-sm mb-3 list-disc list-inside text-blue-700">
        {topcvLinks.map((link, index) => (
          <li key={index}>
            <a href={link} target="_blank" rel="noopener noreferrer" className="underline">
              {link}
            </a>
          </li>
        ))}
      </ul>
    )}

    {/* Ô input và nút thêm */}
    {topcvLinks.length < 5 && (
      <>
        <input
          type="text"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          placeholder="Dán link từ TOPCV tại đây..."
          className="w-full border px-3 py-2 mb-3 rounded text-sm"
        />
        <button
          onClick={() => {
            if (newLink.trim()) {
              setTopcvLinks([...topcvLinks, newLink.trim()]);
              setNewLink("");
            }
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-semibold"
        >
          + Thêm link
        </button>
      </>
    )}

    <button
      className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold w-full py-2 rounded"
      onClick={() => setShowPopup("")}
    >
      Hoàn thành
    </button>
  </div>
)}

      </div>
    </>
  );
};

export default CVUploadOptions;
