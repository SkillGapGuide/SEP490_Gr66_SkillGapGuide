import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useAnalysisStore } from "../../stores/useAnalysisStore";

const ExportExcelButton = () => {
  // Lấy dữ liệu từ store zustand
  const { skills, jobList, jobDetails } = useAnalysisStore();

  const exportExcel = () => {
    // 1. Chuẩn bị sheet kỹ năng
    const skillSheetData = [
      ["ID", "Tên kỹ năng"],
      ...skills.map(s => [s.id, s.skill])
    ];

    // 2. Chuẩn bị sheet công việc
    const jobSheetData = [
      [ "Tiêu đề", "Công ty", "Điểm phù hợp", "Link"],
      ...jobList.map(j => [ j.title, j.company, j.matchScore, j.sourceUrl])
    ];

    // 3. Sheet phân tích từng job (skillGap)
    const allJobSkillGap = [];
    jobList.forEach(job => {
      const detail = jobDetails[job.jobId];
      if (detail && detail.skillGap && detail.skillGap.length > 0) {
        detail.skillGap.forEach(gap => {
          allJobSkillGap.push({
    
            "Công việc": job.title,
            "Kĩ năng công việc yêu cầu": gap.jobSkill,
            "Kĩ năng của bạn ": gap.cvSkill,
            "Score (%)": Math.round(gap.score * 100)
          });
        });
      }
    });
    const skillGapSheetData = [
      [ "Job Title", "Job Skill", "CV Skill", "Score (%)"],
      ...allJobSkillGap.map(row => [ row["Job Title"], row["Job Skill"], row["CV Skill"], row["Score (%)"]])
    ];

    // 4. Tạo workbook & các sheet
    const wb = XLSX.utils.book_new();
    wb.Props = { Title: "Báo cáo kỹ năng và công việc" };
    wb.SheetNames = ["Kỹ năng", "Công việc", "Phân tích kỹ năng"];
    wb.Sheets["Kỹ năng"] = XLSX.utils.aoa_to_sheet(skillSheetData);
    wb.Sheets["Công việc"] = XLSX.utils.aoa_to_sheet(jobSheetData);
    wb.Sheets["Phân tích kỹ năng"] = XLSX.utils.aoa_to_sheet(skillGapSheetData);

    // 5. Xuất file
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "bao_cao_ky_nang.xlsx");
  };

  return (
    <button
      onClick={exportExcel}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded font-semibold text-sm"
    >
      Xuất Excel nhanh
    </button>
  );
};

export default ExportExcelButton;
