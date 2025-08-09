import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnalysisResult from "./AddCVWriteJobDescription";
import TopMenu from "./TopMenu";
import { useCVWizardStore } from "../../stores/cvWizardStore"; // Sửa ở đây!
import { useAnalysisStore } from "../../stores/useAnalysisStore";

// Chỉ redirect nếu chưa upload CV
export default function AnalyzeResult() {
  const navigate = useNavigate();
  const cvUploaded = useCVWizardStore((s) => s.cvUploaded); // Đổi sang dùng cvUploaded

  useEffect(() => {
    if (!cvUploaded) {
      navigate("/analyze/upload");
    }
  }, [cvUploaded, navigate]);

  return (
    <div>
      <TopMenu />
      <AnalysisResult />
    </div>
  );
}
