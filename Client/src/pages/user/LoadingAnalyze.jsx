import React, { useContext, useEffect, useState } from "react";
import { useAnalysisStore } from "../../stores/useAnalysisStore";
import { cvService } from "../../services/cvJobService";
import { skillGapService } from "../../services/skillGapService";
import { useCVWizardStore } from "../../stores/cvWizardStore";
import { showError } from "../../utils/alert";
import { UserContext } from "../../context/UserContext";

// Single flight control
let started = false;
let inFlight = null;

// Phân tích flow chính
function runAnalyzeFlowOnce(params) {
  if (started && inFlight) return inFlight;
  started = true;
  inFlight = (async () => {
    const {
      cvFile, jobFiles, topcvLinks, selectedOption, userRole, onFinish,
      setAnalyzeStep, setStep, setTargetProgress,
      setSkills, setJobList, setJobDetails,
      setAnalyzeJobIndex, setAnalyzeJobTotal, clearAll
    } = params;

    let isCanceled = false;
    const cancel = () => { isCanceled = true; };

    try {
      clearAll();

      // Bước 1: Upload CV & lấy kỹ năng
      setAnalyzeStep && setAnalyzeStep("uploading-cv");
      setStep && setStep(0);
      setTargetProgress && setTargetProgress(5);

      setTargetProgress && setTargetProgress(25);
      setAnalyzeStep && setAnalyzeStep("getting-cv-skill");

      let skillRes = null;
      try {
        skillRes = await cvService.getCVSkill();
      } catch (err) {
        showError("Lấy kỹ năng từ CV thất bại: " + (err?.message || ""));
        return;
      }
      setSkills && setSkills(skillRes.result || []);
      // Lưu cvId vào wizard store
      const resultArr = skillRes.result || [];
      const cvId = resultArr.length > 0 ? resultArr[0].cvId : null;
      if (cvId) {
        if (typeof useCVWizardStore.getState().setCvId === "function") {
          useCVWizardStore.getState().setCvId(cvId);
        }
      }
      setTargetProgress && setTargetProgress(35);
      if (isCanceled) return;

      // Nếu là Free User thì dừng ở đây
      if (userRole === "Free User" || userRole === "free") {
        setStep && setStep(4);
        setTargetProgress && setTargetProgress(100);
        setAnalyzeStep && setAnalyzeStep("done");
        setTimeout(() => { if (!isCanceled) onFinish?.(); }, 1200);
        return;
      }

      // Bước 2: Upload JD hoặc scrape link
      if (selectedOption === "upload") {
        setAnalyzeStep && setAnalyzeStep("uploading-jd-files");
        setStep && setStep(1);
        setTargetProgress && setTargetProgress(45);
      } else if (selectedOption === "link") {
        setAnalyzeStep && setAnalyzeStep("scraping-links");
        setStep && setStep(1);
        setTargetProgress && setTargetProgress(45);
      }
      setTargetProgress && setTargetProgress(55);
      if (isCanceled) return;

      // Bước 3: Lấy danh sách job
      setAnalyzeStep && setAnalyzeStep("reading-job");
      setStep && setStep(2);
      setTargetProgress && setTargetProgress(65);

      let jobRes = null;
      try {
        jobRes = await skillGapService.getJobList();
      } catch (err) {
        showError("Lấy danh sách công việc thất bại: " + (err?.message || ""));
        return;
      }
      const jobs = jobRes.result || [];
      setJobList && setJobList(jobs);
      setTargetProgress && setTargetProgress(75);
      if (isCanceled) return;

      // Bước 4: Phân tích từng job
      setAnalyzeStep && setAnalyzeStep("ai-analyzing-job");
      setStep && setStep(3);
      let jobDetails = {};
      setAnalyzeJobTotal && setAnalyzeJobTotal(jobs.length);

      for (let i = 0; i < jobs.length; ++i) {
        setAnalyzeJobIndex && setAnalyzeJobIndex(i + 1);
        setTargetProgress && setTargetProgress(75 + Math.floor(((i + 1) / jobs.length) * 20));
        const job = jobs[i];
        try {
          const [gapRes, cmtRes, jobSkillsRes] = await Promise.all([
            skillGapService.getSkillGap(job.jobId, job.cvId),
            skillGapService.getCommentSkill(job.jobId, job.cvId),
            skillGapService.getJobSkills(job.jobId),
          ]);
          jobDetails[job.jobId] = {
            skillGap: gapRes.result || [],
            commentData: cmtRes.result || {},
            jobSkills: jobSkillsRes.result || [],
            error: null,
          };
        } catch (err) {
          jobDetails[job.jobId] = {
            skillGap: [],
            commentData: {},
            jobSkills: [],
            error: err?.message || "Lỗi khi phân tích job",
          };
        }
        setJobDetails && setJobDetails({ ...jobDetails });
        if (isCanceled) return;
      }

      // Bước 5: Hoàn thành
      setAnalyzeStep && setAnalyzeStep("done");
      setStep && setStep(4);
      setTargetProgress && setTargetProgress(100);
      setTimeout(() => { if (!isCanceled) onFinish?.(); }, 1200);
    } catch (error) {
      showError("Đã có lỗi xảy ra: " + (error?.message || ""));
    }
    return () => cancel();
  })();

  return inFlight;
}

// Progress mượt
function useSmoothProgress(target, speed = 2, delay = 10) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress === target) return;
    const id = setTimeout(() => {
      setProgress((prev) => {
        if (prev < target) return Math.min(prev + speed, target);
        if (prev > target) return Math.max(prev - speed, target);
        return prev;
      });
    }, delay);

    return () => clearTimeout(id);
  }, [target, progress, speed, delay]);

  return progress;
}

const stepLabels = [
  "Phân tích kỹ năng từ CV của bạn",
  "Xử lý mô tả công việc (JD) hoặc thu thập dữ liệu",
  "Đọc danh sách công việc phù hợp",
  "AI đang phân tích từng công việc cho bạn",
  "Hoàn tất phân tích! Xem ngay kết quả bên dưới",
];

const LoadingAnalyze = ({ onFinish }) => {
  // Các hàm zustand store (chỉ lấy những hàm có sẵn)
  const setSkills = useAnalysisStore((s) => s.setSkills);
  const setJobList = useAnalysisStore((s) => s.setJobList);
  const setJobDetails = useAnalysisStore((s) => s.setJobDetails);
  const clearAll = useAnalysisStore((s) => s.clearAll);
  const setAnalyzeStep = useAnalysisStore((s) => s.setAnalyzeStep);
  const setAnalyzeJobIndex = useAnalysisStore((s) => s.setAnalyzeJobIndex);
  const setAnalyzeJobTotal = useAnalysisStore((s) => s.setAnalyzeJobTotal);

  // CVWizard store
  const selectedOption = useCVWizardStore((s) => s.selectedOption);
  const cvFile = useCVWizardStore((s) => s.cvFile);
  const jobFiles = useCVWizardStore((s) => s.jobFiles);
  const topcvLinks = useCVWizardStore((s) => s.topcvLinks);

  // UserContext
  const { user } = useContext(UserContext);
  const userRole = user?.role || "Free User";

  // LOCAL state
  const [step, setStep] = useState(0);
  const [targetProgress, setTargetProgress] = useState(0);
  const progress = useSmoothProgress(targetProgress, 2, 10);

  // Run flow duy nhất 1 lần
  useEffect(() => {
    console.log(cvFile);
    
    runAnalyzeFlowOnce({
      cvFile,
      jobFiles,
      topcvLinks,
      selectedOption,
      userRole,
      onFinish,
      setAnalyzeStep,
      setStep,
      setTargetProgress,
      setSkills,
      setJobList,
      setJobDetails,
      clearAll,
      setAnalyzeJobIndex,
      setAnalyzeJobTotal,
    });
  }, []); // Đảm bảo chạy đúng 1 lần

  // Style cho avatar runner
  const avatarStyle = {
    position: "absolute",
    left: `calc(${progress}% - 24px)`,
    top: "-36px",
    transition: "left 0.1s linear",
    fontSize: "32px",
    zIndex: 2,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-lg">
        {/* Stepper list */}
        <div className="mb-7">
          <ol className="relative border-l border-blue-200">
            {stepLabels.map((label, idx) => (
              <li key={label} className="mb-6 ml-6">
                <span
                  className={`absolute -left-3 flex items-center justify-center w-6 h-6 ${
                    idx <= step ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-400"
                  } rounded-full border-2 border-blue-300`}
                >
                  {idx < step ? "✔" : idx + 1}
                </span>
                <span className={`ml-2 ${idx === step ? "font-bold text-blue-700" : ""}`}>
                  {label}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Progress bar + runner */}
        <div className="w-full h-6 relative bg-blue-100 rounded mb-2 overflow-visible">
          <div
            className="h-6 bg-blue-500 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
          <div style={avatarStyle} aria-label="runner" title="Đang xử lý">
            🏃‍♂️
          </div>
        </div>

        {/* Status text */}
        <div className="text-blue-600 text-lg font-semibold text-center mt-6">
          {step === 3 ? (
            <>
              Đang phân tích công việc&nbsp;
              <span className="font-bold text-blue-900">
                {useAnalysisStore.getState().analyzeJobIndex}
              </span>
              /
              <span className="font-bold text-blue-900">
                {useAnalysisStore.getState().analyzeJobTotal}
              </span>
              ...
            </>
          ) : (
            stepLabels[step]
          )}
        </div>

        {/* Nếu là free, có thể thêm message riêng */}
        {["Free User", "free"].includes(userRole) && step >= 1 && (
          <div className="mt-8 text-red-600 text-center font-semibold text-lg">
            Tài khoản miễn phí chỉ được xem kỹ năng CV.
            <br />
            Đăng ký premium để phân tích sâu!
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingAnalyze;
