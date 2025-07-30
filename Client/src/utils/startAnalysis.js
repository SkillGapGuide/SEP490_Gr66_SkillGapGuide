// src/utils/startAnalysis.js
import { cvService } from "../services/cvJobService";
import { skillGapService } from "../services/skillGapService";
import { useCVWizardStore } from "../stores/cvWizardStore";
import { useAnalysisStore } from "../stores/useAnalysisStore";
import { showError } from "../utils/alert";

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
    clearAll
  } = useAnalysisStore.getState();

  try {
    clearAll();

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

    // Step 2: Phân tích job (backend chuẩn bị dữ liệu)
    onJobListStart?.();
    setIsJobListLoading(true);
    await analyzeJobByOption(selectedOption);

    // Step 3: Lấy danh sách công việc
    const jobRes = await skillGapService.getJobList();
    const jobs = jobRes.result || [];
    setJobList(jobs);
    setIsJobListLoading(false);
    onJobListDone?.();
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

        jobsLoading[job.jobId] = false;
        setJobsLoading({ ...jobsLoading });
        setJobDetails({ ...jobDetails });
        onJobDetailDone?.(job.jobId);
      })
    );
     // chạy ngầm /api/job/match/getJobMatchScore 
       
    // Kết thúc
    onFinish?.();
  } catch (err) {
    showError("Lỗi trong quá trình phân tích: " + (err?.message || ""));
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
