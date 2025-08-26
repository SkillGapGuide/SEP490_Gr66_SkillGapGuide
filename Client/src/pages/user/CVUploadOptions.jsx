import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { FiUpload, FiTrash } from "react-icons/fi";
import { cvService } from "../../services/cvJobService";
import { scrapeJobService } from "../../services/scrapService";
import {
  showError,
  showSuccess,
  showInfo,
  showConfirm,
} from "../../utils/alert";
import { careerService } from "../../services/career";
import { useCVWizardStore } from "../../stores/cvWizardStore";

const MAX_CV_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const CVUploadOptions = ({ onNext }) => {
  // ====== GLOBAL STATE (ZUSTAND) ======
  const cvFile = useCVWizardStore((state) => state.cvFile);
  const setCVFile = useCVWizardStore((state) => state.setCVFile);

  const uploadResult = useCVWizardStore((state) => state.uploadResult);
  const setUploadResult = useCVWizardStore((state) => state.setUploadResult);

  const jobFiles = useCVWizardStore((state) => state.jobFiles);
  const setJobFiles = useCVWizardStore((state) => state.setJobFiles);

  const topcvLinks = useCVWizardStore((state) => state.topcvLinks);
  const setTopcvLinks = useCVWizardStore((state) => state.setTopcvLinks);

  const selectedOption = useCVWizardStore((s) => s.selectedOption);
  const setSelectedOption = useCVWizardStore((s) => s.setSelectedOption);
  const setJobFilesMeta = useCVWizardStore((s) => s.setJobFilesMeta);
  const setCvUploaded = useCVWizardStore((s) => s.setCvUploaded);
  const clearAllCvAndFile = useCVWizardStore((s) => s.clearAllCvAndFile);
  const setAnalysisNeedRun = useCVWizardStore((s) => s.setAnalysisNeedRun);

  // ====== LOCAL STATE ======
  const [uploading, setUploading] = useState(false);
  const [addingLink, setAddingLink] = useState(false);
  const [showPopup, setShowPopup] = useState("");

  const [newLink, setNewLink] = useState("");
  const [uploadingJobFiles, setUploadingJobFiles] = useState(false);
  const [scrapingLinks, setScrapingLinks] = useState(false);

  const [autoSearching, setAutoSearching] = useState(false);
  const isConfirmingRef = useRef(false);
  const [showGuide, setShowGuide] = useState(false);
  const linkCount = topcvLinks.length; // tránh mở nhiều confirm cùng lúc

  // Dropdown ngành nghề, chuyên môn...
  const [occupationGroups, setOccupationGroups] = useState([]);
  const [occupations, setOccupations] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedCareer, setSelectedCareer] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [showCongrats, setShowCongrats] = useState(false);
  // Lấy danh mục nghề khi load
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

  // ======= Handler chọn nhóm/nghề/chuyên môn/kinh nghiệm =======
  const filteredOccupations = useMemo(
    () =>
      occupations.filter(
        (item) => String(item.groupId) === String(selectedGroup)
      ),
    [occupations, selectedGroup]
  );
  const filteredSpecializations = useMemo(
    () =>
      specializations.filter(
        (item) => String(item.occupationId) === String(selectedCareer)
      ),
    [specializations, selectedCareer]
  );
  const runAutoSearch = useCallback(async (specName) => {
    if (!specName) return showError("Vui lòng chọn Chuyên môn.");

    setAutoSearching(true);

    try {
      const response = await scrapeJobService.crawlTenJobs(specName);
      console.log("Auto search response:", response);
      showSuccess("Đã tìm thấy các công việc phù hợp!");
      setShowCongrats(true); // nếu muốn hiện popup chúc mừng
    } catch (err) {
      showError("Tìm kiếm thất bại: " + (err?.message || ""));
    } finally {
      setAutoSearching(false);
    }
  }, []);
  const handleGroupChange = useCallback((e) => {
    setSelectedGroup(e.target.value);
    setSelectedCareer("");
    setSelectedSpecialization("");
  }, []);
  const handleCareerChange = useCallback((e) => {
    setSelectedCareer(e.target.value);
    setSelectedSpecialization("");
  }, []);
  const handleSpecializationChange = useCallback(
    async (e) => {
      const val = e.target.value; // đây chính là specialization name
      setSelectedSpecialization(val);

      // Nếu người dùng xoá lựa chọn thì thôi
      if (!val) return;

      // Chặn double click / change quá nhanh -> mở nhiều confirm
      if (isConfirmingRef.current) return;
      isConfirmingRef.current = true;

      try {
        const result = await showConfirm(
          `Bạn muốn tìm tin tuyển dụng cho chuyên môn: "${val}"?`
        );

        if (!result.isConfirmed) return;
        await runAutoSearch(val);
      } finally {
        isConfirmingRef.current = false;
      }
    },
    [runAutoSearch]
  );

  const handleExperienceChange = useCallback(
    (e) => setSelectedExperience(e.target.value),
    []
  );
  const ALLOWED_CV_MIME = new Set([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]);
  const ALLOWED_CV_EXT = [".pdf", ".docx"];

  const hasAllowedExt = (name) => {
    const lower = name.toLowerCase();
    return ALLOWED_CV_EXT.some((ext) => lower.endsWith(ext));
  };
  // ====== Upload CV Handler ======
  const handleCVUpload = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return showError("Vui lòng chọn file CV.");

      const isAllowedType =
        ALLOWED_CV_MIME.has(file.type) || hasAllowedExt(file.name);

      if (!isAllowedType) {
        return showError("Chúng tôi chỉ chấp nhận file PDF hoặc DOCX.");
      }

      if (file.size > MAX_CV_SIZE) return showError("File quá lớn (≤ 2MB).");

      // Reset dữ liệu cũ rồi upload file mới
      clearAllCvAndFile();
      setUploading(true);
      setCVFile(file);

      try {
        await cvService.uploadCV(file);
        setCvUploaded(true);
        setAnalysisNeedRun(true);
        showSuccess("Tải lên CV thành công!");
      } catch (err) {
        showError("Tải lên CV thất bại: " + (err?.message || ""));
      } finally {
        setUploading(false);
      }
    },
    [setCVFile]
  );
  // --- constants & helpers (đặt gần đầu file) ---
  const ALLOWED_JOB_MIME = new Set([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]);
  const ALLOWED_JOB_EXT = [".pdf", ".docx"];

  // ====== Handler upload JD files (chỉ lưu vào store, chưa call API) ======
  const handleJobFileUpload = useCallback(
    (e) => {
      const input = e.target; // giữ tham chiếu để reset value
      const picked = Array.from(input.files || []);
      if (!picked.length) return;

      // ĐÃ ĐỦ 5 FILE -> báo sớm
      if (jobFiles.length >= 5) {
        showError("Bạn đã đạt tối đa 5 file. Không thể thêm nữa.");
        input.value = ""; // QUAN TRỌNG: reset để lần sau chọn lại cùng file vẫn chạy onChange
        return;
      }

      const existingKeys = new Set(jobFiles.map((f) => `${f.name}|${f.size}`));
      const remainingSlots = Math.max(0, 5 - jobFiles.length);

      let hasDuplicate = false;
      let hasOversize = false;
      let hasBadType = false;
      let truncated = false;

      // Bắt trùng trong CHÍNH picked (người dùng chọn cùng file 2 lần trong một lần chọn)
      const seenInPicked = new Set();

      let filtered = picked.filter((f) => {
        const key = `${f.name}|${f.size}`;

        // duplicate trong lần chọn mới
        if (seenInPicked.has(key)) {
          hasDuplicate = true;
          return false;
        }
        seenInPicked.add(key);

        // loại file
        const isAllowedType =
          ALLOWED_JOB_MIME.has(f.type) || hasAllowedExt(f.name);
        if (!isAllowedType) {
          hasBadType = true;
          return false;
        }

        // dung lượng
        if (f.size > MAX_FILE_SIZE) {
          hasOversize = true;
          return false;
        }

        // duplicate so với danh sách đã có
        if (existingKeys.has(key)) {
          hasDuplicate = true;
          return false;
        }

        return true;
      });

      // giới hạn 5 file tổng
      if (filtered.length > remainingSlots) {
        filtered = filtered.slice(0, remainingSlots);
        truncated = true;
      }

      if (hasBadType) showError("Chỉ chấp nhận file PDF hoặc DOCX.");
      if (hasOversize)
        showError("File vượt quá 2MB. Vui lòng chọn file nhỏ hơn 2MB!");
      if (hasDuplicate) showError("File đã tồn tại. Vui lòng chọn file khác!");
      if (truncated)
        showError(
          "Chỉ được tải tối đa 5 file. Một số file đã không được thêm."
        );

      if (filtered.length) {
        const newJobFiles = [...jobFiles, ...filtered];
        setJobFiles(newJobFiles);
        setJobFilesMeta(
          newJobFiles.map((f) => ({ name: f.name, size: f.size }))
        );
      }

      // QUAN TRỌNG: reset input để lần sau chọn lại cùng file vẫn fire onChange
      input.value = "";
    },
    [jobFiles, setJobFiles, setJobFilesMeta]
  );

  // Handler gửi JD files khi hoàn thành
  const handleCompleteUploadJobs = useCallback(async () => {
    // Số lượng 1..5
    if (!jobFiles.length) {
      return showError("Vui lòng upload ít nhất 1 file mô tả!");
    }
    if (jobFiles.length > 5) {
      return showError("Chỉ được tải tối đa 5 file mô tả!");
    }

    // Định dạng + dung lượng
    for (const f of jobFiles) {
      const isAllowedType =
        ALLOWED_JOB_MIME.has(f.type) || hasAllowedExt(f.name);
      if (!isAllowedType) {
        return showError(
          `File "${f.name}" không đúng định dạng (chỉ PDF hoặc DOCX).`
        );
      }
      if (f.size > MAX_FILE_SIZE) {
        return showError(`File "${f.name}" vượt quá dung lượng 2MB.`);
      }
    }

    setUploadingJobFiles(true);
    try {
      await cvService.uploadJobDescription(jobFiles);
      setJobFilesMeta(jobFiles.map((f) => ({ name: f.name, size: f.size })));
      showSuccess("Tải lên file mô tả công việc thành công!");
      setShowPopup("");
      setShowCongrats(true);
    } catch (err) {
      showError(
        "Tải lên file mô tả công việc thất bại: " + (err?.message || "")
      );
    } finally {
      setUploadingJobFiles(false);
    }
  }, [jobFiles, setJobFilesMeta]);

  // ====== Handler: Chọn radio option ======
  const handleRadioChange = useCallback((value) => {
    setSelectedOption(value);
    if (value === "upload") setShowPopup("upload");
    else if (value === "link") setShowPopup("link");
  }, []);

  // ====== Thêm link TOPCV ======
  const handleAddTopcvLink = useCallback(() => {
    const url = newLink.trim();
    if (!url) {
      showError("Vui lòng nhập link TOPCV!", "YÊU CẦU");
      return;
    }
    if (!/^https?:\/\/(www\.)?topcv\.vn\/.+/i.test(url)) {
      showError("SKILLGAPGUIDE chỉ hỗ trợ link từ TOPCV!", "YÊU CẦU");
      return;
    }
    if (topcvLinks.includes(url)) {
      showError("Link này đã được thêm!", "Lỗi");
      return;
    }
    if (topcvLinks.length >= 5) {
      showError("Chỉ được nhập tối đa 5 link!", "YÊU CẦU");
      return;
    }
    setTopcvLinks([...topcvLinks, url]);
    setNewLink("");
  }, [newLink, topcvLinks, setTopcvLinks]);

  // ====== Handler: Hoàn thành nhập link (lúc này mới gọi scrapeJob) ======
  const handleCompleteScrapeJobs = useCallback(async () => {
    if (!topcvLinks.length) return showError("Vui lòng nhập ít nhất 1 link!");

    setScrapingLinks(true); // Disable nút bấm
    showInfo("Quá trình có thể mất từ 1 đến 2 phút. Vui lòng chờ...");

    try {
      await scrapeJobService.crawl5JobsByLinks(topcvLinks);
      showSuccess("Lấy dữ liệu từ link TOPCV thành công!"); // Thông báo khi xong
      setShowPopup("");
      setShowCongrats(true);
    } catch (err) {
      showError("Lấy dữ liệu từ link TOPCV thất bại: " + (err?.message || ""));
    } finally {
      setScrapingLinks(false); // Enable nút lại
    }
  }, [topcvLinks]);

  // ====== Options cho dropdown Kinh nghiệm ======
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

  // ===== Input link TOPCV change =====
  const handleNewLinkChange = useCallback(
    (e) => setNewLink(e.target.value),
    []
  );

  // ====== UI ======
  return (
    <>
      <div className="min-h-screen bg-white py-10 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: CV Upload */}
          <div className="flex flex-col items-center border-r md:pr-6">
            <label
              htmlFor="cv-upload"
              className="flex flex-col items-center justify-center w-56 h-48 border-2 border-dashed border-yellow-400 rounded-xl cursor-pointer hover:bg-yellow-50 transition mb-3"
              title="Chấp nhận PDF hoặc DOCX, có dung lượng dưới 2MB"
            >
              <FiUpload className="text-yellow-500 text-4xl mb-2" />
              <p className="font-semibold text-blue-700 underline mb-2">
                Tải lên CV của bạn (PDF)
              </p>
              <span className="text-xs text-gray-500 text-center">
                Nhận file <span className="font-bold">PDF hoặc DOCX</span>, dưới
                2MB
              </span>
            </label>
            <input
              id="cv-upload"
              type="file"
              accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.docx"
              onChange={handleCVUpload}
              className="hidden"
            />
            {cvFile ? (
              <div className="mt-4 w-52 h-[300px] border rounded overflow-hidden shadow bg-gray-50">
                {cvFile.type === "application/pdf" ||
                cvFile.name.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    title="CV"
                    src={URL.createObjectURL(cvFile)}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-3 text-center text-sm text-gray-600">
                    Xem trước không hỗ trợ DOCX. File đã được chọn: <br />
                    <span className="font-medium break-all">{cvFile.name}</span>
                  </div>
                )}
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
                  Hãy để Skill Gap Guide tìm kiếm yêu cầu tuyển dụng giúp bạn!
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
                  {filteredSpecializations &&
                    filteredSpecializations.length > 0 &&
                    filteredSpecializations
                      .filter((spec) => spec.url && spec.url.trim() !== "")
                      .map((spec) => (
                        <option key={spec.id} value={spec.name}>
                          {spec.name}
                        </option>
                      ))}
                </select>
                {/* Kinh nghiệm */}
                {/* <select
                  className="border border-blue-400 bg-blue-100 text-blue-700 px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-500 font-semibold"
                  value={selectedExperience}
                  onChange={handleExperienceChange}
                >
                  {experienceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select> */}
              </div>
            )}
          </div>
        </div>

        {/* Popup: Upload Job Descriptions */}
        {showPopup === "upload" && (
          <div className="transition-transform duration-300 fixed top-24 right-1/2 translate-x-1/2 bg-white shadow-lg border border-gray-200 p-6 rounded-lg w-96 z-50">
            <button
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-200 text-gray-500 hover:text-red-600 text-2xl flex items-center justify-center transition"
              aria-label="Đóng"
              onClick={() => setShowPopup("")}
              tabIndex={0}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-2 text-center">
              Tải lên yêu cầu tuyển dụng
            </h3>

            {/* Thông báo hướng dẫn */}
            <p className="text-sm text-gray-600 text-center mb-4">
              Bạn có thể tải từ{" "}
              <span className="font-semibold text-blue-600">1</span> đến{" "}
              <span className="font-semibold text-blue-600">5</span> file.
              <br />
              Chấp nhận định dạng <span className="font-semibold">
                PDF
              </span>{" "}
              hoặc <span className="font-semibold">DOCX</span>, dung lượng tối
              đa 2MB mỗi file.
            </p>

            <ul className="mb-4">
              {jobFiles.length === 0 ? (
                <li className="text-gray-400 italic text-center py-4">
                  Chưa có file nào được thêm
                </li>
              ) : (
                jobFiles.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-xl mb-2 px-3 py-2 shadow-sm group transition"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-blue-500">
                        <svg
                          width="18"
                          height="18"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M8 2a2 2 0 00-2 2v1H6a2 2 0 00-2 2v9a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H8zm0 2h4v1H8V4zm-2 3h8v9a1 1 0 01-1 1H7a1 1 0 01-1-1V7z"></path>
                        </svg>
                      </span>
                      <span className="truncate font-medium text-gray-700">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <button
                      className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition opacity-60 group-hover:opacity-100"
                      title="Xoá file này"
                      onClick={() => {
                        const newFiles = jobFiles.filter((_, i) => i !== index);
                        setJobFiles(newFiles);
                        setJobFilesMeta(
                          newFiles.map((f) => ({ name: f.name, size: f.size }))
                        );
                      }}
                    >
                      <FiTrash size={18} />
                    </button>
                  </li>
                ))
              )}
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
                  accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.docx"
                  onChange={handleJobFileUpload}
                  className="hidden"
                />
              </div>
            )}
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full py-2 rounded disabled:opacity-60"
              onClick={handleCompleteUploadJobs}
              disabled={uploadingJobFiles || jobFiles.length === 0}
            >
              {uploadingJobFiles ? "Đang tải lên..." : "Hoàn thành"}
            </button>
          </div>
        )}

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
            {/* Info box: 1–5 link + counter */}
            <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900 flex items-center justify-between">
              <div>
                Bạn có thể nhập từ <span className="font-semibold">1</span> đến{" "}
                <span className="font-semibold">5</span> link tuyển dụng từ
                TOPCV.
              </div>
              <span className="ml-3 inline-flex items-center rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold">
                {linkCount}/5
              </span>
            </div>

            {/* Hướng dẫn (mở/đóng) */}
            <div className="mb-3">
              <button
                type="button"
                className="text-xs font-semibold underline text-blue-700 hover:text-blue-600"
                onClick={() => setShowGuide((v) => !v)}
              >
                {showGuide ? "Ẩn hướng dẫn" : "Xem hướng dẫn"}
              </button>
              {showGuide && (
                <ol className="mt-2 list-decimal list-inside space-y-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <li>
                    Mở trang tin tuyển dụng trên{" "}
                    <span className="font-medium">TOPCV</span> và sao chép đường
                    dẫn của 1 công việc mà bạn muốn.
                  </li>
                  <li>
                    Dán vào ô bên dưới rồi bấm{" "}
                    <span className="font-medium">“+ Thêm link”</span>.
                  </li>
                  <li>
                    Lặp lại để thêm tối đa{" "}
                    <span className="font-medium">5</span> link.
                  </li>
                  <li>
                    Bấm <span className="font-medium">“Hoàn thành”</span> để hệ
                    thống lấy dữ liệu.
                  </li>
                </ol>
              )}
            </div>

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
                          setTopcvLinks(
                            topcvLinks.filter((_, i) => i !== index)
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
              {topcvLinks.length < 5 && (
                <>
                  <input
                    type="text"
                    value={newLink}
                    onChange={handleNewLinkChange}
                    placeholder="Dán link từ TOPCV tại đây  (ví dụ: https://topcv.vn/... )"
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
            <button
              className="mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold w-full py-2 rounded disabled:opacity-60"
              onClick={handleCompleteScrapeJobs}
              disabled={scrapingLinks || topcvLinks.length === 0}
            >
              {scrapingLinks ? "Đang gửi link..." : "Hoàn thành"}
            </button>
          </div>
        )}
        {showCongrats && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60 backdrop-blur">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                🎉 Chúc mừng bạn!
              </h2>
              <p className="mb-6 text-gray-700">
                Bạn đã tải lên CV và hoàn thành mô tả công việc bạn mong muốn.
                <br />
                Bấm{" "}
                <span className="font-semibold text-blue-600">
                  Phân tích kỹ năng
                </span>{" "}
                để nhận kết quả phân tích nhé .
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition"
                onClick={() => {
                  setShowCongrats(false);
                }}
              >
                Bắt đầu
              </button>
            </div>
          </div>
        )}
        {/* Blocking overlay when autoSearching */}
        {autoSearching && (
          <div
            className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center"
            aria-modal="true"
            role="dialog"
            aria-labelledby="crawlTitle"
            aria-describedby="crawlDesc"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center">
              <div className="mx-auto mb-4 w-10 h-10 rounded-full border-4 border-gray-300 border-t-transparent animate-spin"></div>
              <h3 id="crawlTitle" className="text-lg font-semibold">

                Đang tìm thông tin tuyển dụng...

              </h3>
              <p id="crawlDesc" className="text-sm text-gray-500 mt-1">
                Vui lòng không đóng hoặc rời trang trong lúc xử lý.
              </p>

              {/* Nếu chưa có cơ chế hủy ở backend, ẩn nút hủy. 
          Nếu có AbortController/cancel API, hiển thị nút và gọi handleAbort */}
              {/* <button
        className="mt-4 px-4 py-2 rounded-lg border text-sm"
        onClick={handleAbort}
      >
        Hủy
      </button> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CVUploadOptions;
