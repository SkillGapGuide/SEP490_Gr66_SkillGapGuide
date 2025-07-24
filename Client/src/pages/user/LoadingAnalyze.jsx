import React, { useContext, useEffect, useRef, useState } from "react";
import { useAnalysisStore } from "../../stores/useAnalysisStore";
import { cvService } from "../../services/cvJobService";
import { skillGapService } from "../../services/skillGapService";
import { scrapeJobService } from "../../services/scrapService";
import { useCVWizardStore } from "../../stores/cvWizardStore";
import { showError } from "../../utils/alert";
import { UserContext } from "../../context/UserContext";

// Custom hook tăng progress mượt
function useSmoothProgress(target, speed = 2, delay = 10) {
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef();

  useEffect(() => {
    if (progress === target) return;
    timeoutRef.current = setTimeout(() => {
      setProgress((prev) => {
        if (prev < target) return Math.min(prev + speed, target);
        if (prev > target) return Math.max(prev - speed, target);
        return prev;
      });
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [target, progress, speed, delay]);

  return progress;
}

const stepLabels = [
  "Đang tải lên CV & lấy kỹ năng từ CV...",
  "Đang tải yêu cầu tuyển dụng hoặc lấy từ link...",
  "Đang lấy danh sách công việc...",
  "Đang phân tích AI từng công việc...",
  "Hoàn thành!"
];

const LoadingAnalyze = ({ onFinish }) => {
  const setSkills = useAnalysisStore((s) => s.setSkills);
  const setJobList = useAnalysisStore((s) => s.setJobList);
  const setJobDetails = useAnalysisStore((s) => s.setJobDetails);
  const clearAll = useAnalysisStore((s) => s.clearAll);
  const setAnalyzeStep = useAnalysisStore((s) => s.setAnalyzeStep);
  const setAnalyzeJobIndex = useAnalysisStore((s) => s.setAnalyzeJobIndex);
  const setAnalyzeJobTotal = useAnalysisStore((s) => s.setAnalyzeJobTotal);

  const selectedOption = useCVWizardStore((s) => s.selectedOption);
  const cvFile = useCVWizardStore((s) => s.cvFile);
  const jobFiles = useCVWizardStore((s) => s.jobFiles);
  const topcvLinks = useCVWizardStore((s) => s.topcvLinks);

  const { user } = useContext(UserContext);
  const userRole = user?.role || "free";

  const [step, setStep] = useState(0);
  const [targetProgress, setTargetProgress] = useState(0);
  const progress = useSmoothProgress(targetProgress, 2, 10); // smooth progress

  useEffect(() => {
    let isCanceled = false;
    clearAll();

    (async () => {
      try {
        // Bước 1: Upload CV & lấy kỹ năng
        setAnalyzeStep("uploading-cv");
        setStep(0);
        setTargetProgress(5);

        try {
          await cvService.uploadCV(cvFile);
        } catch (err) {
          showError("Tải lên CV thất bại: " + (err?.message || ""));
          return;
        }

        setTargetProgress(25);
        setAnalyzeStep("getting-cv-skill");

        let skillRes = null;
        try {
          skillRes = await cvService.getCVSkill();
        } catch (err) {
          showError("Lấy kỹ năng từ CV thất bại: " + (err?.message || ""));
          return;
        }
        setSkills(skillRes.result || []);
        setTargetProgress(35);
        if (isCanceled) return;

        // Nếu role là free, dừng tại đây!
        if (userRole === "free") {
          setStep(4);
          setTargetProgress(100);
          setAnalyzeStep("done");
          setTimeout(() => {
            if (!isCanceled) onFinish?.();
          }, 1200);
          return;
        }

        // Bước 2: Upload JD hoặc scrape link
        if (selectedOption === "upload") {
          setAnalyzeStep("uploading-jd-files");
          setStep(1);
          setTargetProgress(45);
          try {
            await cvService.uploadJobDescription(jobFiles);
          } catch (err) {
            showError("Tải lên file mô tả công việc thất bại: " + (err?.message || ""));
            return;
          }
        }
        if (selectedOption === "link") {
          setAnalyzeStep("scraping-links");
          setStep(1);
          setTargetProgress(45);
          try {
            await Promise.all(topcvLinks.map(link => scrapeJobService.scrapeJob(link)));
          } catch (err) {
            showError("Lấy dữ liệu từ link TOPCV thất bại: " + (err?.message || ""));
            return;
          }
        }
        // Nếu option auto thì code thêm ở đây nếu có

        setTargetProgress(55);
        if (isCanceled) return;

        // Bước 3: Lấy danh sách job
        setAnalyzeStep("reading-job");
        setStep(2);
        setTargetProgress(65);
        let jobRes = null;
        try {
          jobRes = await skillGapService.getJobList();
        } catch (err) {
          showError("Lấy danh sách công việc thất bại: " + (err?.message || ""));
          return;
        }
        const jobs = jobRes.result || [];
        setJobList(jobs);
        setTargetProgress(75);
        if (isCanceled) return;

        // Bước 4: Phân tích từng job
        setAnalyzeStep("ai-analyzing-job");
        setStep(3);
        let jobDetails = {};
        setAnalyzeJobTotal(jobs.length);

        for (let i = 0; i < jobs.length; ++i) {
          setAnalyzeJobIndex(i + 1);
          setTargetProgress(75 + Math.floor(((i + 1) / jobs.length) * 20));
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
          setJobDetails({ ...jobDetails });
          if (isCanceled) return;
        }

        // Bước 5: Hoàn thành
        setAnalyzeStep("done");
        setStep(4);
        setTargetProgress(100);
        setTimeout(() => {
          if (!isCanceled) onFinish?.();
        }, 1200);

      } catch (error) {
        showError("Đã có lỗi xảy ra: " + (error?.message || ""));
      }
    })();

    return () => {
      isCanceled = true;
    };
    // eslint-disable-next-line
  }, []);

  // ---- Vị trí của nhân vật chạy: ----
  // Giả sử chiều rộng progressBar là 100%
  const avatarStyle = {
    position: "absolute",
    left: `calc(${progress}% - 24px)`, // trừ nửa width avatar (24px) để căn giữa
    top: "-36px", // chỉnh cho đẹp
    transition: "left 0.1s linear",
    fontSize: "32px", // to hơn 1 chút cho dễ nhìn
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
                  className={`absolute -left-3 flex items-center justify-center w-6 h-6
                  ${idx <= step ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-400"}
                  rounded-full border-2 border-blue-300`}
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
          {/* Runner icon (có thể dùng ảnh SVG, emoji, hoặc custom component) */}
          <div style={avatarStyle} aria-label="runner" title="Đang xử lý">
            🏃‍♂️
          </div>
        </div>
        {/* Status text */}
        <div className="text-blue-600 text-lg font-semibold text-center mt-6">
          {step === 3
            ? (
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
            )
            : stepLabels[step]
          }
        </div>
        {/* Nếu là free, có thể thêm message riêng */}
        {userRole === "free" && step >= 1 && (
          <div className="mt-8 text-red-600 text-center font-semibold text-lg">
            Tài khoản miễn phí chỉ được xem kỹ năng CV.<br />Đăng ký premium để phân tích sâu!
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingAnalyze;
