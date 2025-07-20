import React, { useState, useEffect } from "react";

import TopMenu from "./TopMenu";

import { cvService } from "../../services/cvJobService";
import { showError, showSuccess, showInfo } from "../../utils/alert";

const AnalysisResult = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState("");
  const [skills, setSkills] = useState([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);

  useEffect(() => {
    // Gọi API lấy kỹ năng khi component mount
    const fetchSkills = async () => {
      setIsLoadingSkills(true);
      try {
        const response = await cvService.getCVSkill();
        if (response.status === 200 && Array.isArray(response.result)) {
          setSkills(response.result);
        } else {
          setSkills([]);
          showError(response.message || "Không lấy được kỹ năng!");
        }
      } catch (error) {
        setSkills([]);
        showError("Không lấy được kỹ năng: " + error.message);
      } finally {
        setIsLoadingSkills(false);
      }
    };
    fetchSkills();
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <TopMenu />
      </div>

      <div className="bg-white min-h-screen py-6 px-4 max-w-6xl mx-auto">
       
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Kết quả phân tích kỹ năng</h1>
       {/* Kỹ năng hiện tại của bạn */}
<h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
    <path d="M7 10a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM3 16.5a7 7 0 1 1 14 0v.25a1.25 1.25 0 0 1-1.25 1.25H4.25A1.25 1.25 0 0 1 3 16.75V16.5Z" fill="#2563eb"/>
  </svg>
  Kỹ năng hiện tại của bạn
</h2>

<div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
  {isLoadingSkills ? (
    // Loading skeleton shimmer effect
    Array.from({ length: 4 }).map((_, idx) => (
      <div
        key={idx}
        className="h-8 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg"
      />
    ))
  ) : skills.length > 0 ? (
    skills.map((item) => (
      <div
        key={item.id}
        className="flex items-center gap-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl shadow-sm hover:scale-[1.02] transition-transform duration-150 cursor-pointer group"
        title={item.skill}
      >
        {/* skill icon */}
        <div className="w-7 h-7 flex items-center justify-center bg-blue-100 rounded-full group-hover:bg-blue-200 transition">
          <svg width="20" height="20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="#3b82f6" strokeWidth="2" />
            <path d="M7 10a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z" fill="#2563eb"/>
          </svg>
        </div>
        <span className="font-medium text-gray-800 group-hover:text-blue-700 transition">
          {item.skill}
        </span>
      </div>
    ))
  ) : (
    <div className="flex items-center col-span-2 text-gray-400 italic gap-2 py-3">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#d1d5db" strokeWidth="2"/>
        <path d="M9.5 9.5h.01M14.5 9.5h.01M9 15c.7-.7 2.3-.7 3 0" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      Chưa có kỹ năng nào phù hợp được tìm thấy.
    </div>
  )}
</div>


        {/* Tiêu đề yêu cầu */}
        <h3 className="text-red-600 font-bold mb-2 text-[18px]">
          Yêu cầu tuyển dụng 1 (Mô tả file 1.pdf) – Chuyên gia tư vấn
        </h3>

        {/* Nhận xét + biểu đồ */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 text-sm text-gray-700 leading-relaxed">
            <strong>Nhận xét chung:</strong> Ứng viên đã có nền tảng kiến thức chuyên môn khá tốt.
            Tuy nhiên, cần nâng cao thêm kỹ năng mềm và kỹ năng lập trình nâng cao để đáp ứng yêu cầu công việc.
            Việc bổ sung khả năng giao tiếp và sử dụng thành thạo công cụ cũng là một điểm cần lưu ý.
          </div>
          <div className="flex justify-center items-center">
            <div className="w-[120px] h-[120px] rounded-full border-[10px] border-gray-300 border-t-blue-500 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700 text-center">
                  Độ phù hợp
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bảng phân tích */}
        <div className="border rounded-xl overflow-hidden text-sm">
          <table className="w-full border-collapse text-center">
            <thead className="bg-blue-50 text-gray-800 font-semibold">
              <tr>
                <th className="border px-3 py-2">Kỹ năng hiện tại của bạn</th>
                <th className="border px-3 py-2">Yêu cầu công việc</th>
                <th className="border px-3 py-2">Độ phù hợp</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-2">Tiếng Anh (IELTS 6.0)</td>
                <td className="border px-3 py-2">Tiếng Anh (IELTS 6.5)</td>
                <td className="border px-3 py-2 text-red-600 font-bold">90%</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">Lập trình Python cơ bản</td>
                <td className="border px-3 py-2">Thành thạo Python</td>
                <td className="border px-3 py-2 text-orange-500 font-bold">70%</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">Giao tiếp ổn</td>
                <td className="border px-3 py-2">Giao tiếp tốt</td>
                <td className="border px-3 py-2 text-gray-500 font-bold">0%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Phần mở rộng - list chi tiết */}
        <div className="mt-8 border border-gray-300 rounded-xl p-4 bg-gray-50">
          <h4 className="text-base font-semibold text-gray-800 mb-3">
            Phân tích chi tiết kỹ năng còn thiếu
          </h4>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Cần nâng cấp trình độ tiếng Anh lên IELTS 6.5 để đáp ứng yêu cầu.</li>
            <li>Cần luyện thêm các bài tập nâng cao về Python và tham gia các dự án thực tế.</li>
            <li>Rèn luyện kỹ năng giao tiếp trong nhóm, thuyết trình và xử lý tình huống.</li>
            <li>Bổ sung kiến thức về tư duy phản biện và giải quyết vấn đề.</li>
            <li>Nên tham gia các khóa học kỹ năng mềm hoặc câu lạc bộ ngoại khóa.</li>
          </ul>
        </div>

        {/* Yêu cầu tuyển dụng 2 */}
        <h3 className="text-red-600 font-bold mb-2 text-[18px] mt-10">
          Yêu cầu tuyển dụng 2 (Mô tả file 2.pdf) – Nhân viên phân tích dữ liệu
        </h3>

        {/* Nhận xét + biểu đồ */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 text-sm text-gray-700 leading-relaxed">
            <strong>Nhận xét chung:</strong> Ứng viên có tư duy phân tích tốt và nền tảng công nghệ ổn định.
            Tuy nhiên, khả năng sử dụng công cụ phân tích dữ liệu và kỹ năng thống kê vẫn còn hạn chế.
            Nên bổ sung thêm kiến thức về Excel nâng cao, SQL và Power BI.
          </div>
          <div className="flex justify-center items-center">
            <div className="w-[120px] h-[120px] rounded-full border-[10px] border-gray-300 border-t-blue-500 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700 text-center">
                  Độ phù hợp
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bảng phân tích kỹ năng */}
        <div className="border rounded-xl overflow-hidden text-sm">
          <table className="w-full border-collapse text-center">
            <thead className="bg-blue-50 text-gray-800 font-semibold">
              <tr>
                <th className="border px-3 py-2">Kỹ năng hiện tại của bạn</th>
                <th className="border px-3 py-2">Yêu cầu công việc</th>
                <th className="border px-3 py-2">Độ phù hợp</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-2">Excel cơ bản</td>
                <td className="border px-3 py-2">Excel nâng cao</td>
                <td className="border px-3 py-2 text-red-600 font-bold">60%</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">Khả năng phân tích tốt</td>
                <td className="border px-3 py-2">Tư duy logic + phân tích dữ liệu</td>
                <td className="border px-3 py-2 text-green-600 font-bold">85%</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">Biết SQL cơ bản</td>
                <td className="border px-3 py-2">Sử dụng thành thạo SQL</td>
                <td className="border px-3 py-2 text-orange-500 font-bold">50%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Chi tiết kỹ năng còn thiếu */}
        <div className="mt-8 border border-gray-300 rounded-xl p-4 bg-gray-50">
          <h4 className="text-base font-semibold text-gray-800 mb-3">
            Phân tích chi tiết kỹ năng còn thiếu
          </h4>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Nên học các hàm nâng cao trong Excel như PivotTable, VLOOKUP, INDEX/MATCH.</li>
            <li>Củng cố kiến thức SQL thông qua dự án thực tế hoặc khóa học trực tuyến.</li>
            <li>Làm quen với công cụ trực quan hóa dữ liệu như Power BI hoặc Tableau.</li>
            <li>Đọc hiểu và phân tích báo cáo thống kê để hỗ trợ quyết định kinh doanh.</li>
            <li>Tham gia khóa học phân tích dữ liệu nền tảng từ Google hoặc Microsoft.</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AnalysisResult;
