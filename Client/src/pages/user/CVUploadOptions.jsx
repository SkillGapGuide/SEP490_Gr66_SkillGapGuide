import { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { cvService } from "../../services/cvService";
import { careerService } from "../../services/career";

const CV_STORAGE_KEY = "cvUploadData";
const FORM_STORAGE_KEY = "cvUploadForm";

const CVUploadOptions = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null); // Preview PDF
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    occupationGroup: "",
    occupation: "",
    specialization: "",
  });
  const [groups, setGroups] = useState([]);
  const [occupations, setOccupations] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  // Load dữ liệu từ localStorage khi vào lại
  useEffect(() => {
    const savedForm = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedForm) setFormData(JSON.parse(savedForm));
    const savedFile = localStorage.getItem(CV_STORAGE_KEY);
    if (savedFile) setFileUrl(savedFile);
    const savedStep = localStorage.getItem("cvUploadStep");
    if (savedStep) setStep(Number(savedStep));
  }, []);

  useEffect(() => {
    localStorage.setItem("cvUploadStep", step);
  }, [step]);

  useEffect(() => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Xử lý tạo object URL cho file mới
  useEffect(() => {
    if (file) {
      // Nếu là file mới upload
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      // Lưu file dưới dạng base64 vào localStorage để preview lại sau reload (tuỳ chọn)
      const reader = new FileReader();
      reader.onload = function (e) {
        localStorage.setItem(CV_STORAGE_KEY, e.target.result);
      };
      reader.readAsDataURL(file);
      // Cleanup khi đổi file
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  // Lấy danh sách dropdown
  useEffect(() => {
    (async () => {
      const [g, o, s] = await Promise.all([
        careerService.viewOccupationGroupsEnable(),
        careerService.viewOccupationsEnable(),
        careerService.viewSpecializationEnable(),
      ]);
      setGroups(Array.isArray(g) ? g : g?.data || []);
      setOccupations(Array.isArray(o) ? o : o?.data || []);
      setSpecializations(Array.isArray(s) ? s : s?.data || []);
    })();
  }, []);

  // Xử lý upload file
 const handleUpload = (e) => {
  const uploaded = e.target.files[0];
  if (!uploaded) return;

  // Kiểm tra định dạng PDF
  if (uploaded.type !== "application/pdf") {
    setError("Chỉ chấp nhận file PDF.");
    setFile(null);
    return;
  }

  // Kiểm tra dung lượng tối đa 2MB (2 * 1024 * 1024 bytes)
  if (uploaded.size > 2 * 1024 * 1024) {
    setError("Dung lượng file phải nhỏ hơn 2MB.");
    setFile(null);
    return;
  }

  setFile(uploaded);
  setError(null);
};


  // Check điều kiện đủ sang bước 2
  const canProceed = () =>
    fileUrl &&
    formData.occupationGroup &&
    formData.occupation &&
    formData.specialization;

  // Nộp form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!canProceed()) {
      setError("Vui lòng chọn đầy đủ Nhóm nghề, Nghề, Chuyên môn và tải lên CV.");
      return;
    }
    setLoading(true);
    try {
      if (file) {
        const response = await cvService.uploadCV(file);
        if (response.status === 200) {
          setStep(2);
        } else {
          setError("Đã xảy ra lỗi khi upload CV.");
        }
      } else {
        setStep(2);
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi upload CV.");
    } finally {
      setLoading(false);
    }
  };

  // Reset về bước 1
  const handleBack = () => setStep(1);

  // CSS Dropdown Custom: rainbow border, icon, hover màu, focus rõ nét
  const dropdownBase =
    "w-full appearance-none px-4 py-3 rounded-2xl border-2 transition shadow-sm bg-white text-base font-medium " +
    "focus:ring-2 focus:ring-blue-400 focus:border-blue-500 " +
    "hover:border-pink-400 hover:bg-blue-50 " +
    "border-gray-200 text-gray-700";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-3">
      <div className="max-w-4xl mx-auto shadow-2xl rounded-3xl bg-white p-8">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-12 mb-8">
          {["Tải lên CV", "Yêu cầu tuyển dụng"].map((label, idx) => (
            <div key={label} className="flex flex-col items-center group">
              <div
                className={`
                  w-12 h-12 flex items-center justify-center rounded-full text-xl font-bold
                  border-4 transition-all duration-300
                  ${step === idx + 1
                    ? "bg-gradient-to-tr from-blue-600 to-cyan-400 text-white border-blue-400 scale-110 shadow-xl"
                    : "bg-gray-200 border-gray-300 text-gray-400"}
                `}
              >
                {idx + 1}
              </div>
              <span className={`mt-2 text-base font-semibold ${step === idx + 1 ? "text-blue-700" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Thông tin hướng dẫn */}
        <div className="mb-8 text-center">
          <p className="font-medium text-lg text-blue-700 mb-2">
            👋 Chào mừng bạn đến với trình upload CV thông minh!
          </p>
          <p className="text-gray-700">
            <b>Bước 1:</b> Tải lên CV (PDF) & chọn lĩnh vực nghề nghiệp. <br />
            <b>Bước 2:</b> Chọn cách nhập yêu cầu tuyển dụng phù hợp với bạn.
          </p>
        </div>

        {/* Bước 1 */}
        {step === 1 && (
          <>
            <div className="flex flex-col md:flex-row gap-10 mb-6">
              {/* Upload PDF */}
              <div className="w-full md:w-1/3">
                <label
                  htmlFor="cv-upload"
                  className="w-full border-2 border-dashed border-blue-300 rounded-2xl bg-blue-50 flex flex-col items-center py-8 px-4 cursor-pointer hover:bg-blue-100 shadow-lg transition group"
                >
                  <FiUpload className="text-5xl text-blue-500 mb-3 animate-bounce group-hover:text-pink-500" />
                  <span className="text-blue-700 font-semibold mb-2 underline">
                    Kéo thả hoặc nhấn để chọn file CV (PDF)
                  </span>
                  <input id="cv-upload" type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />
                  <span className="text-gray-400 text-sm">Dung lượng ≤ 2MB</span>
                </label>
                {fileUrl ? (
                  <div className="mt-6 shadow rounded-xl overflow-hidden border border-blue-100">
                    <iframe
                      title="CV Preview"
                      src={fileUrl}
                      className="w-full h-72"
                    />
                  </div>
                ) : (
                  <div className="mt-4 text-center text-gray-400 italic">Chưa có CV được tải lên</div>
                )}
              </div>
              {/* Dropdowns */}
              <div className="flex-1 flex flex-col gap-6 justify-between">
                {/* Nhóm nghề */}
                <div>
                  <label className="block font-bold mb-1 text-gray-700">
                    <span className="mr-1">🗂</span>Nhóm nghề <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className={dropdownBase}
                      value={formData.occupationGroup}
                      onChange={e => setFormData({
                        occupationGroup: e.target.value,
                        occupation: "",
                        specialization: "",
                      })}
                    >
                      <option value="">Chọn nhóm nghề</option>
                      {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-3 text-blue-400 pointer-events-none text-xl">▼</span>
                  </div>
                </div>
                {/* Nghề */}
                <div>
                  <label className="block font-bold mb-1 text-gray-700">
                    <span className="mr-1">💼</span>Nghề <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className={dropdownBase + (!formData.occupationGroup ? " bg-gray-100" : "")}
                      value={formData.occupation}
                      onChange={e => setFormData({
                        ...formData,
                        occupation: e.target.value,
                        specialization: "",
                      })}
                      disabled={!formData.occupationGroup}
                    >
                      <option value="">Chọn nghề</option>
                      {occupations
                        .filter(o => String(o.groupId) === String(formData.occupationGroup))
                        .map(o => (
                          <option key={o.id} value={o.id}>{o.name}</option>
                        ))}
                    </select>
                    <span className="absolute right-3 top-3 text-blue-400 pointer-events-none text-xl">▼</span>
                  </div>
                </div>
                {/* Chuyên môn */}
                <div>
                  <label className="block font-bold mb-1 text-gray-700">
                    <span className="mr-1">🎯</span>Chuyên môn <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className={dropdownBase + (!formData.occupation ? " bg-gray-100" : "")}
                      value={formData.specialization}
                      onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                      disabled={!formData.occupation}
                    >
                      <option value="">Chọn chuyên môn</option>
                      {specializations
                        .filter(s => String(s.occupationId) === String(formData.occupation))
                        .map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                    <span className="absolute right-3 top-3 text-blue-400 pointer-events-none text-xl">▼</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Thông báo lỗi */}
            {error && (
              <div className="text-red-500 font-semibold text-center mb-2 animate-pulse">{error}</div>
            )}
            {/* Nút */}
            <div className="flex justify-center mt-2">
              <button
                className={`bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 shadow-lg text-white font-bold px-8 py-3 rounded-2xl text-lg transition-all duration-200 ${loading || !canProceed() ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
              >
                {loading ? "Đang tải..." : "Tải lên CV"}
              </button>
            </div>
          </>
        )}

        {/* Bước 2 */}
        {step === 2 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mt-4 shadow-md">
            <h2 className="text-center text-2xl font-extrabold text-blue-800 mb-6">
              Chọn yêu cầu tuyển dụng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: "Tải lên yêu cầu tuyển dụng", path: "/addCVwritejobdescription" },
                {
                  label: (
                    <span>
                      Nhập đường link từ{" "}
                      <a href="https://topcv.vn" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        TopCV.vn
                      </a>
                    </span>
                  ),
                  path: "/addCVfromTOPCVLink"
                },
                { label: "Để SkillGapGuide tìm giúp bạn!", path: "/analysisCVAvailableJob1" }
              ].map((opt, idx) => (
                <div key={idx} className="bg-white border-2 border-blue-100 rounded-xl p-6 flex flex-col items-center shadow-lg transition hover:scale-105 hover:border-blue-300">
                  <p className="mb-4 font-medium text-blue-800 text-lg text-center">{opt.label}</p>
                  <button
                    className="bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 text-white font-extrabold px-6 py-2 rounded-full shadow"
                    onClick={() => navigate(opt.path)}
                  >
                    Khám phá
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <button
                className="text-blue-600 font-semibold underline hover:text-blue-800"
                onClick={handleBack}
              >
                ← Quay lại bước 1
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVUploadOptions;
