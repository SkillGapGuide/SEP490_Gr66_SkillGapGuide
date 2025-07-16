import React, { useState } from "react";

import TopMenu from "./TopMenu";


const AnalysisResult = () => {
  const [showPopup, setShowPopup] = useState(false);
const [links, setLinks] = useState([]);
const [newLink, setNewLink] = useState("");

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <TopMenu />
      </div>

      <div className="bg-white min-h-screen py-6 px-4 max-w-6xl mx-auto">
        {/* Tiêu đề kỹ năng */}
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          Kỹ năng hiện tại của bạn
        </h2>

        {/* Gạch đầu dòng kỹ năng */}
        <ul className="list-disc list-inside text-sm text-gray-700 mb-6 grid grid-cols-1 md:grid-cols-2 gap-1">
          <li>Kiến thức nền tảng CNTT</li>
          <li>Hiểu biết về hệ điều hành</li>
          <li>Phân tích hệ thống</li>
          <li>Lập trình</li>
        </ul>

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
