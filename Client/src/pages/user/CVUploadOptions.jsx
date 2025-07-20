import React, { useState, useCallback, useMemo, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import TopMenu from "./TopMenu";
import { cvService } from "../../services/cvJobService";
import { showError, showSuccess, showInfo } from "../../utils/alert";
import { careerService } from "../../services/career";
import { FiTrash } from "react-icons/fi";

const MAX_CV_SIZE = 2 * 1024 * 1024; // 2MB

const CVUploadOptions = () => {
  // State cho upload CV
  const [cvFile, setCVFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [addingLink, setAddingLink] = useState(false);
  const [fetchingLinks, setFetchingLinks] = useState(false);

  // State cho upload Job Description
  const [jobFiles, setJobFiles] = useState([]);

  // State cho TopCV link
  const [topcvLinks, setTopcvLinks] = useState([]);
  const [newLink, setNewLink] = useState("");

  // State cho popup & radio chọn method
  const [selectedOption, setSelectedOption] = useState("");
  const [showPopup, setShowPopup] = useState("");

  // State cho dropdown danh mục nghề
  const [occupationGroups, setOccupationGroups] = useState([]); // Nhóm nghề
  const [occupations, setOccupations] = useState([]); // Nghề
  const [specializations, setSpecializations] = useState([]); // Chuyên môn

  // Selected values cho dropdown
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedCareer, setSelectedCareer] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");

  // ===== Gọi API danh mục nghề khi load component =====
  useEffect(() => {
    const fetchData = async () => {
      const [groups, careers, specs] = await Promise.all([
        careerService.viewOccupationGroupsEnable(),
        careerService.viewOccupationsEnable(),
        careerService.viewSpecializationEnable(),
      ]);
      setOccupationGroups(groups || []);
      setOccupations(careers || []);
      setSpecializations(specs || []);
    };
    fetchData();
  }, []);

  // ===== Filter nghề theo nhóm =====
  const filteredOccupations = useMemo(
    () =>
      occupations.filter(
        (item) => String(item.groupId) === String(selectedGroup)
      ),
    [occupations, selectedGroup]
  );
  // ===== Filter chuyên môn theo nghề =====
  const filteredSpecializations = useMemo(
    () =>
      specializations.filter(
        (item) => String(item.occupationId) === String(selectedCareer)
      ),
    [specializations, selectedCareer]
  );

  // ===== Xử lý chọn nhóm, nghề, chuyên môn =====
  const handleGroupChange = useCallback((e) => {
    setSelectedGroup(e.target.value);
    setSelectedCareer("");
    setSelectedSpecialization("");
  }, []);
  const handleCareerChange = useCallback((e) => {
    setSelectedCareer(e.target.value);
    setSelectedSpecialization("");
  }, []);
  const handleSpecializationChange = useCallback((e) => {
    setSelectedSpecialization(e.target.value);
  }, []);

  // ...trên đầu component
  const handleNewLinkChange = useCallback(
    (e) => setNewLink(e.target.value),
    []
  );
  const handleExperienceChange = useCallback(
    (e) => setSelectedExperience(e.target.value),
    []
  );

  // ========== Upload CV Handler ==========
  const handleCVUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) {
      showError("Vui lòng chọn file CV.", "Lỗi");
      return;
    }
    if (file.type !== "application/pdf") {
      showError("Chỉ chấp nhận file PDF.", "Lỗi");
      return;
    }
    if (file.size > MAX_CV_SIZE) {
      showError("File CV không được vượt quá 2MB.", "Lỗi");
      return;
    }
    setCVFile(file);
    setUploading(true);
    setUploadResult(null);
    try {
      const res = await cvService.uploadCV(file);
      setUploadResult(res);
      showSuccess("Tải lên CV thành công!");
    } catch (error) {
      setUploadResult({ error: error.message });
      showError("Upload CV thất bại: " + error.message, "Lỗi");
    } finally {
      setUploading(false);
    }
  }, []);

  // ========== Upload Job Description Handler ==========
  const handleJobFileUpload = useCallback(
    (e) => {
      const files = Array.from(e.target.files);

      // Kiểm tra số lượng file tổng cộng (đã chọn + đã upload)
      if (files.length + jobFiles.length > 5) {
        showError("Tối đa 5 file mô tả!", "Lỗi");
        return;
      }

      // Kiểm tra tất cả file hợp lệ
      for (let file of files) {
        if (
          file.type !== "application/pdf" &&
          file.type !==
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          showError("Chỉ chấp nhận file PDF.", "Lỗi");
          return;
        }
        if (file.size > MAX_CV_SIZE) {
          showError("File mô tả không được vượt quá 2MB.", "Lỗi");
          return;
        }
      }

      try {
        // Gọi API upload nhiều file cùng lúc
        cvService.uploadJobDescription(files);
        setJobFiles((prev) => [...prev, ...files]);
        showSuccess("Tải lên mô tả công việc thành công!");
      } catch (error) {
        showError("Upload file mô tả thất bại: " + error.message, "Lỗi");
      }
    },
    [jobFiles]
  );

  // ========== Radio select ==========
  const handleRadioChange = useCallback((value) => {
    setSelectedOption(value);
    if (value === "upload") setShowPopup("upload");
    else if (value === "link") setShowPopup("link");
    // Không gọi showSuccess ở đây nữa!
  }, []);

  // ========== Thêm link TOPCV ==========
  const handleAddTopcvLink = useCallback(() => {
    const url = newLink.trim();
    if (!url) {
      showError("Vui lòng nhập link TOPCV!", "Lỗi");
      return;
    }
    if (!/^https?:\/\/(www\.)?topcv\.vn\/.+/i.test(url)) {
      showError("Chỉ hỗ trợ link từ TOPCV!", "Lỗi");
      return;
    }
    if (topcvLinks.includes(url)) {
      showError("Link này đã được thêm!", "Lỗi");
      return;
    }
    if (topcvLinks.length >= 5) {
      showError("Chỉ được nhập tối đa 5 link!", "Lỗi");
      return;
    }
    setTopcvLinks((prev) => [...prev, url]);
    setNewLink("");
  }, [newLink, topcvLinks]);

  const handleFetchJobsFromLinks = useCallback(async () => {
    if (topcvLinks.length === 0) {
      showError("Vui lòng nhập ít nhất 1 link TOPCV!", "Lỗi");
      return;
    }
    setFetchingLinks(true);
    try {
      await Promise.all(
        topcvLinks.map((link) => cvService.getDataJobFromLink(link))
      );
      showSuccess("Đã gửi link để cào job thành công!");
      setShowPopup("");
      setTopcvLinks([]);
    } catch (err) {
      showError("Cào job thất bại: " + err.message, "Lỗi");
    } finally {
      setFetchingLinks(false);
    }
  }, [topcvLinks]);

  // ========== Options cho dropdown Kinh nghiệm ==========
  const experienceOptions = useMemo(
    () => [
      { value: "", label: "Kinh nghiệm" },
      { value: "1", label: "Dưới 1 năm" },
      { value: "2", label: "1-2 năm" },
      { value: "3", label: "2-5 năm" },
      { value: "4", label: "Trên 5 năm" },
    ],
    []
  );

  // ========== UI ==========
  return (
    <>
      <div className="max-w-7xl mx-auto">
        <TopMenu />
      </div>
      <div className="min-h-screen bg-white py-10 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: CV Upload */}
          <div className="flex flex-col items-center border-r md:pr-6">
            <label
              htmlFor="cv-upload"
              className="flex flex-col items-center justify-center w-56 h-48 border-2 border-dashed border-yellow-400 rounded-xl cursor-pointer hover:bg-yellow-50 transition mb-3"
              title="Chỉ chấp nhận file PDF, dung lượng dưới 2MB"
            >
              <FiUpload className="text-yellow-500 text-4xl mb-2" />
              <p className="font-semibold text-blue-700 underline mb-2">
                Tải lên CV của bạn (PDF)
              </p>
              <span className="text-xs text-gray-500 text-center">
                Chỉ nhận file PDF, dung lượng dưới{" "}
                <span className="font-bold">2MB</span>
              </span>
            </label>
            <input
              id="cv-upload"
              type="file"
              accept="application/pdf"
              onChange={handleCVUpload}
              className="hidden"
            />
            {cvFile ? (
              <div className="mt-4 w-52 h-[300px] border rounded overflow-hidden shadow bg-gray-50">
                <iframe
                  title="CV"
                  src={URL.createObjectURL(cvFile)}
                  className="w-full h-full"
                />
              </div>
            ) : (
              <p className="text-gray-500 italic mt-4">
                Chưa có CV được tải lên
              </p>
            )}
            {uploading && (
              <p className="text-yellow-600 mt-2">Đang tải lên...</p>
            )}
            {uploadResult && uploadResult.error && (
              <p className="text-red-600 mt-2">{uploadResult.error}</p>
            )}
          </div>

          {/* Right Column: Dropdowns + Requirements */}
          <div className="flex flex-col gap-6">
            {/* Job Requirement */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h2 className="text-center text-lg font-semibold text-blue-800 mb-4">
                Yêu cầu tuyển dụng
              </h2>
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
                  <a
                    href="https://topcv.vn"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
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

            {/* Dropdowns: chỉ hiện nếu chọn option "auto" */}
            {selectedOption === "auto" && (
              <div className="transition-all duration-200 grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 border border-blue-300 rounded-xl p-6 shadow">
                {/* Nhóm nghề */}
                <select
                  className="border border-blue-400 bg-blue-100 text-blue-700 px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-500 font-semibold"
                  value={selectedGroup}
                  onChange={handleGroupChange}
                >
                  <option value="">Nhóm nghề</option>
                  {occupationGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                {/* Nghề (lọc theo nhóm) */}
                <select
                  className="border border-blue-400 bg-blue-100 text-blue-700 px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-500 font-semibold"
                  value={selectedCareer}
                  onChange={handleCareerChange}
                  disabled={!selectedGroup}
                >
                  <option value="">Nghề</option>
                  {filteredOccupations.map((occ) => (
                    <option key={occ.id} value={occ.id}>
                      {occ.name}
                    </option>
                  ))}
                </select>
                {/* Chuyên môn (lọc theo nghề) */}
                <select
                  className="border border-blue-400 bg-blue-100 text-blue-700 px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-500 font-semibold"
                  value={selectedSpecialization}
                  onChange={handleSpecializationChange}
                  disabled={!selectedCareer}
                >
                  <option value="">Chuyên môn</option>
                  {filteredSpecializations.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
                {/* Kinh nghiệm */}
                <select
                  className="border border-blue-400 bg-blue-100 text-blue-700 px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-500 font-semibold"
                  value={selectedExperience}
                  onChange={handleExperienceChange}
                >
                  {experienceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Popup: Upload Job Descriptions */}
        {showPopup === "upload" && (
          <div className="transition-transform duration-300 fixed top-24 right-1/2 translate-x-1/2 bg-white shadow-lg border border-gray-200 p-6 rounded-lg w-96 z-50">
            {/* Nút X */}
            <button
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-200 text-gray-500 hover:text-red-600 text-2xl flex items-center justify-center transition"
              aria-label="Đóng"
              onClick={() => setShowPopup("")}
              tabIndex={0}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4 text-center">
              Tải lên yêu cầu tuyển dụng
            </h3>
            <ul className="text-sm mb-4 list-disc list-inside">
              {jobFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
            {jobFiles.length < 5 && (
              <div className="text-center mb-4">
                <label
                  htmlFor="job-upload"
                  className="text-red-600 font-semibold cursor-pointer underline"
                >
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
        {/* Popup: Input TOPCV link */}
       {showPopup === "link" && (
  <div
    className="transition-transform duration-300 fixed top-24 right-1/2 translate-x-1/2 bg-white shadow-lg border border-gray-200 p-6 rounded-lg w-96 z-50 flex flex-col"
    style={{ minHeight: 400, maxHeight: 560 }}
  >
    <button
      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-200 text-gray-500 hover:text-red-600 text-2xl flex items-center justify-center transition"
      aria-label="Đóng"
      onClick={() => setShowPopup("")}
      tabIndex={0}
    >
      ×
    </button>
    <h3 className="text-lg font-bold mb-3 text-center">
      Nhập đường dẫn từ TOPCV
    </h3>

    {/* Nội dung cuộn được */}
    <div className="flex-1 overflow-y-auto">
      {topcvLinks.length > 0 ? (
        <ul className="text-sm mb-3 space-y-2">
          {topcvLinks.map((link, index) => (
            <li
              key={index}
              className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg shadow-sm group"
            >
              <span className="font-semibold text-blue-700 min-w-[28px] text-center">
                {index + 1}.
              </span>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 break-all text-blue-900 underline hover:text-blue-700 transition"
              >
                {link}
              </a>
              <button
                className="ml-2 text-gray-400 hover:text-red-600 transition"
                title="Xoá link này"
                onClick={() =>
                  setTopcvLinks((prev) =>
                    prev.filter((_, i) => i !== index)
                  )
                }
              >
                <FiTrash size={18} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 italic text-center mb-3">
          Chưa có link nào được thêm
        </p>
      )}

      {/* Input và nút thêm link */}
      {topcvLinks.length < 5 && (
        <>
          <input
            type="text"
            value={newLink}
            onChange={handleNewLinkChange}
            placeholder="Dán link từ TOPCV tại đây..."
            className="w-full border px-3 py-2 mb-3 rounded text-sm"
          />
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-semibold disabled:opacity-60"
            onClick={handleAddTopcvLink}
            disabled={addingLink}
          >
            {addingLink ? "Đang thêm link..." : "+ Thêm link"}
          </button>
        </>
      )}
      {topcvLinks.length >= 5 && (
        <p className="text-red-600 text-center font-medium my-2">
          Chỉ nhập tối đa 5 link!
        </p>
      )}
    </div>

    {/* Nút Hoàn thành luôn ở dưới cùng */}
    <button
      className="mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold w-full py-2 rounded disabled:opacity-60"
      onClick={handleFetchJobsFromLinks}
      disabled={fetchingLinks || topcvLinks.length === 0}
    >
      {fetchingLinks ? "Đang gửi link..." : "Hoàn thành"}
    </button>
  </div>
)}

      </div>
    </>
  );
};

export default CVUploadOptions;
