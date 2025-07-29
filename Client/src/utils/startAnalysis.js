import { cvService } from "../services/cvJobService";
import { skillGapService } from "../services/skillGapService";
import { courseService } from "../services/courseService"; // Đường dẫn đúng theo bạn
import { useCVWizardStore } from "../stores/cvWizardStore";
import { useAnalysisStore } from "../stores/useAnalysisStore";
import { useCourseStore } from "../stores/courseStore";
import { showError } from "../utils/alert";

let started = false;

export async function runAnalysisFlowOnce({ userRole = "Free User", onFinish }) {
  if (started) return;
  started = true;

  const {
    cvFile,
    jobFiles,
    topcvLinks,
    selectedOption,
    setCvId,
  } = useCVWizardStore.getState();

  const {
    setSkills,
    setJobList,
    setJobDetails,
    clearAll,
    setAnalyzeJobIndex,
    setAnalyzeJobTotal,
  } = useAnalysisStore.getState();

  const { setSuggestedCourses } = useCourseStore.getState();

  try {
    clearAll();

    const skillRes = await cvService.getCVSkill();
    const skills = skillRes.result || [];
    setSkills(skills);

    const cvId = skills.length > 0 ? skills[0].cvId : null;
    if (cvId) setCvId(cvId);

    // 🔥 Gọi ngầm lấy khóa học
    

    if (userRole === "Free User" || userRole === "free") {
      onFinish?.();
      return;
    }

    const jobRes = await skillGapService.getJobList();
   
    const jobs = jobRes.result || [];
    setJobList(jobs);

    let jobDetails = {};
    setAnalyzeJobTotal(jobs.length);
  try {
      const res = await courseService.scrapeAutomation(1, 3, cvId);
      setSuggestedCourses(res.result || []);
    } catch (err) {
      console.error("Lỗi lấy khóa học:", err);
    }
    for (let i = 0; i < jobs.length; i++) {
      setAnalyzeJobIndex(i + 1);
      const job = jobs[i];

      try {
        const [gap, cmt, jobSkills] = await Promise.all([
          skillGapService.getSkillGap(job.jobId, job.cvId),
          skillGapService.getCommentSkill(job.jobId, job.cvId),
          skillGapService.getJobSkills(job.jobId),
        ]);

        jobDetails[job.jobId] = {
          skillGap: gap.result || [],
          commentData: cmt.result || {},
          jobSkills: jobSkills.result || [],
          error: null,
        };
      } catch (err) {
        jobDetails[job.jobId] = {
          skillGap: [],
          commentData: {},
          jobSkills: [],
          error: err?.message || "Lỗi phân tích job",
        };
      }
    }

    setJobDetails(jobDetails);
    onFinish?.();
  } catch (err) {
    showError("Lỗi trong quá trình phân tích: " + (err?.message || ""));
  }
}
