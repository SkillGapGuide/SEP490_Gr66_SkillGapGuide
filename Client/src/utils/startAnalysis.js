// src/utils/startAnalysis.js
import { cvService } from "../services/cvJobService";
import { skillGapService } from "../services/skillGapService";
import { useCVWizardStore } from "../stores/cvWizardStore";
import { useAnalysisStore } from "../stores/useAnalysisStore";
import { showError } from "../utils/alert";
import { useCourseStore } from "../stores/courseStore";
import { courService } from "../services/courService"; // Đường dẫn tuỳ bạn
import { resetStoresForNewRun } from "./resetStores";
export async function runAnalysisFlowOnce({
  userRole = "Free User",
  onSkillStart,
  onSkillDone,
  onJobListStart,
  onJobListDone,
  onJobDetailStart,
  onJobDetailDone,
  onFinish
}) {
   // ---- chuẩn hoá role → tier
  const tier = (() => {
    const r = (userRole || "").toLowerCase();
    if (r.includes("premium")) return "premium";
    if (r.includes("pro")) return "pro";
    return "free";
  })();
  const {
    selectedOption,
    setCvId
  } = useCVWizardStore.getState();
  const {
    setSkills,
    setJobList,
    setJobDetails,
    setIsSkillsLoading,
    setIsJobListLoading,
    setJobsLoading,
    setAnalysisError,
    clearAll
  } = useAnalysisStore.getState();

  try {
    // ✅ Soft reset: không đụng tới cvUploaded
    resetStoresForNewRun({ mode: "soft", clearPersist: false });

    // Step 1: Lấy kỹ năng
    onSkillStart?.();
    setIsSkillsLoading(true);
    const skillRes = await cvService.getCVSkill();
    const skills = skillRes.result || [];
    setSkills(skills);
    setIsSkillsLoading(false);
    onSkillDone?.();
    const cvId = skills.length > 0 ? skills[0].cvId : null;
    if (cvId) setCvId(cvId);
     // Free User: dừng sau Step 1
    if (tier === "free") {
      onFinish?.();
      return;
    }

    // Step 2: Phân tích job (backend chuẩn bị dữ liệu)
    onJobListStart?.();
    setIsJobListLoading(true);
     let jobs = [];
   try {
     await analyzeJobByOption(selectedOption);
     const jobRes = await skillGapService.getJobList();
     jobs = jobRes.result || [];

     if (!jobs.length) {
       // ĐÁNH DẤU LỖI PHÂN TÍCH
       setJobList([]); // đảm bảo rỗng
       setAnalysisError({
         step: "jobList",
         code: "AI_ANALYSIS_EMPTY_RESULT",
         message: "AI phân tích thất bại hoặc không tìm thấy công việc phù hợp.",
       });
       showError("Không lấy được danh sách công việc. Vui lòng thử lại hoặc đổi tuỳ chọn phân tích.");
       return onFinish?.(); // dừng flow tại đây
     }

     setJobList(jobs);
   } catch (e) {
     setJobList([]);
     setAnalysisError({
       step: "jobList",
       code: e?.code || "JOB_LIST_FETCH_FAILED",
       message: e?.message || "Không lấy được danh sách công việc.",
     });
     showError("Không lấy được danh sách công việc.");
     return onFinish?.(); // dừng flow
   } finally {
     setIsJobListLoading(false);
     onJobListDone?.();
   }
  if (jobs.length && cvId) {
      try {
        const matchScoreRes = await skillGapService.getJobMatchScore();
        // Xử lý ghép match score với jobList
        const matchMap = {};
        (matchScoreRes.result || []).forEach(item => {
          matchMap[`${item.jobId}_${item.cvId}`] = item.score;
        });
        // update jobList trong store: append thêm trường matchScore vào job
        const jobsWithScore = jobs.map(job => ({
          ...job,
          matchScore: matchMap[`${job.jobId}_${cvId}`]
            ? Math.round(matchMap[`${job.jobId}_${cvId}`] * 100)
            : null
        }));
        setJobList(jobsWithScore);
      } catch (err) {
        // Có thể show error toast nếu muốn
        setJobList(jobs); // vẫn giữ nguyên jobList cũ
      }
    }
    // Step 4: Lấy từng job detail (song song hoặc tuần tự, loading từng cái)
    const jobsLoading = {};
    const jobDetails = {};

    await Promise.all(
      jobs.map(async (job) => {
        jobsLoading[job.jobId] = true;
        setJobsLoading({ ...jobsLoading }); // Trigger UI loading job này

        try {
          const [gap, jobSkills] = await Promise.all([
            skillGapService.getSkillGap(job.jobId, job.cvId),
            // skillGapService.getCommentSkill(job.jobId, job.cvId),
            skillGapService.getJobSkills(job.jobId),
          ]);
          jobDetails[job.jobId] = {
            skillGap: gap.result || [],
            // commentData: cmt.result || {},
            jobSkills: jobSkills.result || [],
            error: null,
          };
        } catch (err) {
          jobDetails[job.jobId] = {
            skillGap: [],
            // commentData: {},
            jobSkills: [],
            error: err?.message || "Lỗi phân tích job",
          };
        }

        jobsLoading[job.jobId] = false;
        setJobsLoading({ ...jobsLoading });
        setJobDetails({ ...jobDetails });
        onJobDetailDone?.(job.jobId);
      })
    );
    // Pro User: dừng tại Step 4
    if (tier === "pro") {
      onFinish?.();
      return;
    }
     // chạy ngầm /api/job/match/getJobMatchScore 
       
    // Kết thúc
    onFinish?.();
     // Sau onFinish mới cào course
  const { setScrapedCourses, setCourseLoading } = useCourseStore.getState();
  setCourseLoading(true);
  try {
    if (cvId) {
      const res = await courService.scrapeAutomation(1, 2, cvId);
      setScrapedCourses(res.result || {});
    }
  } catch (err) {
    setScrapedCourses({});
    showError("Lỗi "+err.message) // Hoặc báo lỗi tuỳ bạn
  }
  finally {
  setCourseLoading(false); // <-- luôn tắt loading dù thành công hay lỗi!
}

  } catch (err) {
    showError("Lỗi trong quá trình phân tích: " + (err?.message || ""));
     onFinish?.();
  }
}

async function analyzeJobByOption(option) {
  const optionMap = {
    auto: 3,
    link: 2,
    upload: 1,
  };
  const param = optionMap[option];
  if (!param) return;
  try {
    await skillGapService.analyzeJobDescription(param);
  } catch (error) {
    // Lỗi backend
    console.warn(`Lỗi khi phân tích job option=${option}:`, error.message);
  }
}