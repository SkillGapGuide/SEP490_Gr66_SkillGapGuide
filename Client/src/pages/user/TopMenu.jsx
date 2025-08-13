import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCVWizardStore } from "../../stores/cvWizardStore";
import { UserContext } from "../../context/UserContext";
import { showInfo } from "../../utils/alert";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useAnalysisStore } from "../../stores/useAnalysisStore";

const menuItems = [
  { label: "Tải lên CV & mô tả công việc", path: "/analyze/upload" },
  { label: "Công việc phù hợp", path: "/matchingjobs" },
  { label: "Phân tích kỹ năng", path: "/analyze/result" },
  { label: "Gợi ý khóa học", path: "/suggestedcourses" },

  // { label: "Đánh giá", path: "/servicerating" },
  // { label: "Đăng ký gói dịch vụ", path: "/servicepayment" },
];

const TopMenu = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy các state từ store (persisted)
  const cvUploaded = useCVWizardStore((s) => s.cvUploaded);
  const jobFilesMeta = useCVWizardStore((s) => s.jobFilesMeta);
  const topcvLinks = useCVWizardStore((s) => s.topcvLinks);
const selectedOption = useCVWizardStore((s) => s.selectedOption);
  // Dữ liệu xuất báo cáo
  const { skills, jobList, jobDetails } = useAnalysisStore();

  // Điều kiện enable cho "Phân tích kỹ năng"
  const enableAnalysis =
    cvUploaded &&
    ((jobFilesMeta && jobFilesMeta.length > 0) ||
      (topcvLinks && topcvLinks.length > 0)||
    selectedOption === "auto" );

  // Logic xuất Excel
  const exportExcel = () => {
    if (!skills || !jobList) {
      showInfo("Không có dữ liệu để xuất!");
      return;
    }
    // Sheet kỹ năng
    const skillSheetData = [
      ["STT", "Tên kỹ năng"],
      ...skills.map((s,index) => [index, s.skill])
    ];

    // Sheet công việc
    const jobSheetData = [
      ["Job ID", "Tiêu đề", "Công ty", "Điểm phù hợp", "Link"],
      ...jobList.map(j => [j.jobId, j.title, j.company, j.matchScore, j.sourceUrl])
    ];

    // Sheet phân tích từng job (skillGap)
const allJobSkillGap = [];

jobList.forEach((job) => {
  const detail = jobDetails[job.jobId];
  if (detail && detail.skillGap && detail.skillGap.length > 0) {
    detail.skillGap.forEach((gap) => {
      const raw = Number(gap.score ?? 0);              // score gốc 0–1
      const pct = Math.round(raw * 100);               // %
      
      let suitability = "Không phù hợp";
      let cvSkillDisplay = gap.cvSkill;
      let scoreDisplay = `${pct}`;                     // mặc định hiển thị số %

      if (raw > 0.65) {
        suitability = "Phù hợp";
      } else if (raw > 0.5 && raw <= 0.65) {
        suitability = "Phù hợp một phần";
      } else {
        // < 0.5: theo yêu cầu đổi hiển thị
        cvSkillDisplay = "Không có";
        scoreDisplay = "Không áp dụng";
      }

      allJobSkillGap.push({
        "Job ID": job.jobId,
        "Job Title": job.title,
        "Job Skill": gap.jobSkill,
        "CV Skill": cvSkillDisplay,
        "Score (%)": scoreDisplay,      // có thể là số hoặc chuỗi "Không áp dụng"
        "Mức độ phù hợp": suitability,
      });
    });
  }
});

// Thêm header mới cho sheet
const skillGapSheetData = [
  ["Job ID", "Job Title", "Job Skill", "CV Skill", "Score (%)", "Mức độ phù hợp"],
  ...allJobSkillGap.map((row) => [
    row["Job ID"],
    row["Job Title"],
    row["Job Skill"],
    row["CV Skill"],
    row["Score (%)"],
    row["Mức độ phù hợp"],
  ]),
];


    // Tạo workbook & các sheet
    const wb = XLSX.utils.book_new();
    wb.Props = { Title: "Báo cáo kỹ năng và công việc" };
    wb.SheetNames = ["Kỹ năng", "Công việc", "Phân tích kỹ năng"];
    wb.Sheets["Kỹ năng"] = XLSX.utils.aoa_to_sheet(skillSheetData);
    wb.Sheets["Công việc"] = XLSX.utils.aoa_to_sheet(jobSheetData);
    wb.Sheets["Phân tích kỹ năng"] = XLSX.utils.aoa_to_sheet(skillGapSheetData);

    // Xuất file
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "bao_cao_ky_nang.xlsx");
  };

  return (
    <>
      <nav className="bg-[#f5f9ff] border-b border-blue-200 shadow-sm">
        <ul className="flex justify-center gap-6 px-4 py-2 text-sm font-medium text-gray-800">
          {menuItems.map((item, i) => {
            const isActive = location.pathname === item.path;

            // Xác định enable cho từng menu item
            let isEnabled = true;
            if (item.label === "Phân tích kỹ năng") {
              isEnabled = enableAnalysis;
            }

            return (
              <li
                key={i}
                className={`cursor-pointer transition-all px-2 py-1 rounded ${
                  isActive
                    ? "text-white bg-blue-600 shadow font-semibold"
                    : isEnabled
                    ? "hover:text-blue-600 hover:underline"
                    : "text-gray-400 bg-gray-100 cursor-not-allowed"
                }`}
                style={{ opacity: isEnabled ? 1 : 0.5 }}
                onClick={() => {
                  if (!isEnabled) {
                    showInfo("Bạn cần tải lên CV và mô tả công việc trước!");
                    return;
                  }
                  navigate(item.path);
                }}
              >
                {item.label}
              </li>
            );
          })}
          {/* Nút Xuất báo cáo cuối cùng */}
        <li>
  <button
    className={`bg-white-600 text-black px-3 py-1 rounded hover:bg-green-700 text-sm transition-all font-medium ${
      !enableAnalysis ? "opacity-50 cursor-not-allowed" : ""
    }`}
    style={{ minWidth: 110 }}
    aria-disabled={!enableAnalysis}            // chỉ để screen reader
    onClick={() => {
      if (!enableAnalysis) {
        showInfo("Bạn cần tải lên CV và mô tả công việc trước!");
        return;
      }
      exportExcel();
    }}
    type="button"
  >
    Xuất báo cáo
  </button>
</li>

        </ul>
      </nav>
    </>
  );
};

export default TopMenu;
