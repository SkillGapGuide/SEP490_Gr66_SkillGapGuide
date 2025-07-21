import React, { useState, useEffect, useRef } from "react";
import TopMenu from "./TopMenu";
import { cvService } from "../../services/cvJobService";
import { skillGapService } from "../../services/skillGapService";
import { showError } from "../../utils/alert";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const POLLING_INTERVAL = 4000; // ms
const MAX_POLLING = 90;        // tối đa polling 6 phút

const AnalysisResult = () => {
  // State kỹ năng CV
  const [skills, setSkills] = useState([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);

  // State danh sách job (để phân tích)
  const [jobList, setJobList] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  // State cho quá trình polling getJobList
  const [isPollingJobs, setIsPollingJobs] = useState(false);

  // State kết quả phân tích từng job
  const [jobDetails, setJobDetails] = useState({});
  const [loadingJobIds, setLoadingJobIds] = useState([]);

  // Ref cho polling
  const pollingSkillsCount = useRef(0);
  const pollingSkillsTimer = useRef(null);

  const pollingJobsCount = useRef(0);
  const pollingJobsTimer = useRef(null);

  // --- 1. Lấy kỹ năng CV (polling nếu chưa có)
  useEffect(() => {
    let canceled = false;
    async function fetchSkills(polling = false) {
      setIsLoadingSkills(true);
      try {
        const res = await cvService.getCVSkill();
        if (res.status === 200 && Array.isArray(res.result) && res.result.length > 0) {
          setSkills(res.result);
          setIsLoadingSkills(false);
          pollingSkillsCount.current = 0;
          if (pollingSkillsTimer.current) clearTimeout(pollingSkillsTimer.current);
        } else {
          setSkills([]);
          if (!canceled && polling) {
            if (pollingSkillsCount.current < MAX_POLLING) {
              pollingSkillsCount.current += 1;
              pollingSkillsTimer.current = setTimeout(() => fetchSkills(true), POLLING_INTERVAL);
            } else {
              setIsLoadingSkills(false);
              showError("AI xử lý CV quá lâu, vui lòng thử lại sau.");
            }
          } else {
            setIsLoadingSkills(false);
          }
        }
      } catch (error) {
        setSkills([]);
        setIsLoadingSkills(false);
        if (!polling) showError("Không lấy được kỹ năng: " + error.message);
      }
    }
    fetchSkills();
    if (skills.length === 0) {
      pollingSkillsCount.current = 0;
      pollingSkillsTimer.current = setTimeout(() => fetchSkills(true), POLLING_INTERVAL);
    }
    return () => {
      canceled = true;
      if (pollingSkillsTimer.current) clearTimeout(pollingSkillsTimer.current);
    };
    // eslint-disable-next-line
  }, []);

  // --- 2. Lấy danh sách job (polling nếu chưa có)
  useEffect(() => {
    let canceled = false;
    async function fetchJobs(polling = false) {
      setJobsLoading(true);
      try {
        const res = await skillGapService.getJobList();
        if (res.status === 200 && Array.isArray(res.result) && res.result.length > 0) {
          setJobList(res.result);
          setJobsLoading(false);
          setIsPollingJobs(false);
          pollingJobsCount.current = 0;
          if (pollingJobsTimer.current) clearTimeout(pollingJobsTimer.current);
        } else {
          setJobList([]);
          // Nếu đang polling, thì tiếp tục, nếu hết số lần thì dừng và báo lỗi
          if (!canceled && polling) {
            setIsPollingJobs(true);
            if (pollingJobsCount.current < MAX_POLLING) {
              pollingJobsCount.current += 1;
              pollingJobsTimer.current = setTimeout(() => fetchJobs(true), POLLING_INTERVAL);
            } else {
              setIsPollingJobs(false);
              setJobsLoading(false);
              showError("AI phân tích JD quá lâu, vui lòng thử lại sau.");
            }
          } else {
            setJobsLoading(false);
          }
        }
      } catch (error) {
        setJobList([]);
        setJobsLoading(false);
        if (!polling) showError("Không lấy được danh sách công việc: " + error.message);
      }
    }
    fetchJobs();
    if (jobList.length === 0) {
      pollingJobsCount.current = 0;
      setIsPollingJobs(true);
      pollingJobsTimer.current = setTimeout(() => fetchJobs(true), POLLING_INTERVAL);
    }
    return () => {
      canceled = true;
      if (pollingJobsTimer.current) clearTimeout(pollingJobsTimer.current);
    };
    // eslint-disable-next-line
  }, []);

  // --- 3. Khi đã có jobList, phân tích từng job (polling từng job nếu cần)
  useEffect(() => {
    let canceled = false;
    async function analyzeJobs() {
      if (jobList.length === 0) return;
      let details = {};
      for (let job of jobList) {
        setLoadingJobIds((prev) => [...prev, job.jobId]);
        // Polling từng job: chờ đến khi backend phân tích xong từng job mới trả kết quả
        const POLL_PER_JOB_MAX = 45; // mỗi job tối đa ~3 phút
        let pollCount = 0;
        let skillGap = [];
        let commentData = {};
        let jobSkills = [];
        let error = null;
        while (pollCount < POLL_PER_JOB_MAX) {
          try {
            // 1. getSkillGap (mất thời gian nhất)
            let skillGapRes = await skillGapService.getSkillGap(job.jobId, job.cvId);
            if (skillGapRes.status === 200 && Array.isArray(skillGapRes.result)) {
              skillGap = skillGapRes.result;
              // 2. getCommentSkill (mất thời gian)
              let commentRes = await skillGapService.getCommentSkill(job.jobId, job.cvId);
              if (commentRes.status === 200) commentData = commentRes.result;
              // 3. getJobSkills (nhanh)
              let jobSkillsRes = await skillGapService.getJobSkills(job.jobId);
              if (jobSkillsRes.status === 200 && Array.isArray(jobSkillsRes.result)) jobSkills = jobSkillsRes.result;
              break; // đã có kết quả thì thoát polling từng job
            }
          } catch (err) {
            error = err.message;
          }
          pollCount += 1;
          await new Promise(res => setTimeout(res, POLLING_INTERVAL));
        }
        details[job.jobId] = { skillGap, commentData, jobSkills, error };
        setLoadingJobIds((prev) => prev.filter((id) => id !== job.jobId));
        setJobDetails((old) => ({ ...old, ...details }));
        if (canceled) break;
      }
    }
    setJobDetails({});
    if (jobList.length > 0) analyzeJobs();
    return () => { canceled = true; };
  }, [jobList]);

  // --- Skeleton UI ---
  const renderSkillSkeleton = () => (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="h-10 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg" />
      ))}
    </div>
  );
  const renderJobSkeleton = () => (
    <div className="border rounded-xl p-5 my-5 bg-gray-50">
      <div className="h-5 w-1/3 bg-gray-200 rounded mb-3 animate-pulse"></div>
      <div className="h-4 w-full bg-gray-100 rounded mb-2 animate-pulse"></div>
      <div className="h-4 w-3/4 bg-gray-100 rounded mb-2 animate-pulse"></div>
      <div className="h-32 w-full bg-gray-100 rounded mb-2 animate-pulse"></div>
      <div className="h-8 w-1/4 bg-gray-200 rounded mt-4 animate-pulse"></div>
    </div>
  );

  // --- MAIN RENDER ---
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
          {isLoadingSkills
            ? (
                <>
                  <div className="col-span-2 text-blue-600 font-semibold flex items-center gap-2 pb-2">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2"/></svg>
                    Đang phân tích AI, vui lòng chờ 30-90 giây...
                  </div>
                  {renderSkillSkeleton()}
                </>
              )
            : (skills.length > 0 ? (
                skills.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl shadow-sm text-base font-semibold text-blue-900"
                  >
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <circle cx="11" cy="11" r="10" stroke="#2563eb" strokeWidth="2" />
                      <circle cx="11" cy="11" r="5" fill="#e0edff" stroke="#2563eb" strokeWidth="1" />
                    </svg>
                    {item.skill || item.cvSkill}
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
              ))
          }
        </div>

        {/* Danh sách các Job được phân tích */}
        <div className="mt-10">
          {(jobsLoading || isPollingJobs) ? (
            <>
              <div className="text-blue-600 font-medium text-center mb-4">
                Đang xử lý AI, vui lòng chờ để tạo yêu cầu phân tích...
              </div>
              {Array.from({ length: 2 }).map((_, idx) => <div key={idx}>{renderJobSkeleton()}</div>)}
            </>
          ) : jobList.length === 0 ? (
            <p className="text-gray-400 italic">Chưa có yêu cầu phân tích nào.</p>
          ) : (
            jobList.map((job) => {
              const jobInfo = jobDetails[job.jobId] || {};
              const isJobLoading = loadingJobIds.includes(job.jobId);

              return (
                <div key={job.jobId} className="border rounded-xl p-6 my-7 bg-white shadow-sm">
                  <h3 className="text-red-600 font-bold mb-2 text-[20px]">
                    {job.title} – {job.company}
                  </h3>
                  <div className="italic mb-2 text-gray-700">{job.description}</div>
                  {isJobLoading ? (
                    <div>
                      <p className="text-blue-500 mb-2">Đang phân tích công việc này... Hãy kiên nhẫn chờ đợi AI xử lý!</p>
                      {renderJobSkeleton()}
                    </div>
                  ) : jobInfo.error ? (
                    <div className="text-red-600 font-semibold">Lỗi: {jobInfo.error}</div>
                  ) : (
                    <>
                      {/* Nhận xét */}
                      {jobInfo.commentData && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded">
                          <strong>Nhận xét chung:</strong>{" "}
                          <span className="text-gray-700">{jobInfo.commentData.generalComment}</span>
                          {jobInfo.commentData.skillComment && jobInfo.commentData.skillComment.length > 0 && (
                            <ul className="mt-2 list-disc list-inside pl-5 text-sm text-blue-900 space-y-1">
                              {jobInfo.commentData.skillComment.map((cmt, idx) => (
                                <li key={idx}>
                                  <span className="font-semibold">{cmt.skill}:</span> {cmt.comment}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}

                      {/* Bảng skill gap */}
                      <div className="border rounded-xl overflow-hidden text-sm my-6">
                        <table className="w-full border-collapse text-center">
                          <thead className="bg-blue-50 text-gray-800 font-semibold">
                            <tr>
                              <th className="border px-3 py-2">Kỹ năng trong CV</th>
                              <th className="border px-3 py-2">Yêu cầu công việc</th>
                              <th className="border px-3 py-2">Điểm phù hợp (%)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {jobInfo.skillGap && jobInfo.skillGap.length > 0 ? (
                              jobInfo.skillGap.map((item, idx) => (
                                <tr key={idx}>
                                  <td className="border px-3 py-2">{item.cvSkill}</td>
                                  <td className="border px-3 py-2">{item.jobSkill}</td>
                                  <td className="border px-3 py-2 text-blue-600 font-semibold">
                                    {Math.round(item.score * 100)}%
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={3} className="border px-3 py-2 text-gray-400 italic">
                                  Không có dữ liệu phân tích kỹ năng.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* List job skills */}
                      <div className="mb-3">
                        <h4 className="font-semibold text-blue-700 mb-2">Tất cả kỹ năng yêu cầu của công việc:</h4>
                        <ul className="flex flex-wrap gap-2">
                          {jobInfo.jobSkills && jobInfo.jobSkills.length > 0 ? (
                            jobInfo.jobSkills.map(skill => (
                              <li key={skill.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                {skill.skill}
                              </li>
                            ))
                          ) : (
                            <span className="text-gray-400 italic">Không có.</span>
                          )}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default AnalysisResult;
