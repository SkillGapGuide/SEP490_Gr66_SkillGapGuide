import React, { useState, useEffect, useContext,useRef } from "react";
import { useAnalysisStore } from "../../stores/useAnalysisStore";
import { runAnalysisFlowOnce } from "../../utils/startAnalysis";
import { UserContext } from "../../context/UserContext";
import { useCVWizardStore } from "../../stores/cvWizardStore";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { userService } from "../../services/userService";
import { showSuccess, showError } from "../../utils/alert";
import { useAuthStore } from "../../stores/authStore"; // <-- đọc role từ zustand
const FREE_USER_ROLE = "Free User";

const SkillSkeleton = () => (
  <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
    {Array.from({ length: 6 }).map((_, idx) => (
      <div
        key={idx}
        className="h-10 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg"
      />
    ))}
  </div>
);

const JobSkeleton = () => (
  <div className="border rounded-xl p-5 my-5 bg-gray-50">
    <div className="h-5 w-1/3 bg-gray-200 rounded mb-3 animate-pulse"></div>
    <div className="h-4 w-full bg-gray-100 rounded mb-2 animate-pulse"></div>
    <div className="h-4 w-3/4 bg-gray-100 rounded mb-2 animate-pulse"></div>
    <div className="h-32 w-full bg-gray-100 rounded mb-2 animate-pulse"></div>
    <div className="h-8 w-1/4 bg-gray-200 rounded mt-4 animate-pulse"></div>
  </div>
);

const AnalyzeResult = () => {
  const navigate = useNavigate();

  // Role từ zustand (được UserContext đẩy vào sau khi bạn setUser sau thanh toán)
  
 
  const { user } = useContext(UserContext);

 const role = user?.role ?? FREE_USER_ROLE;  // an toàn khi user null/undefined

   const isUpgraded = /pro|premium/i.test(role);
  const {
    skills,
    isSkillsLoading,
    jobList,
    isJobListLoading,
    jobDetails,
    jobsLoading,
    setIsSkillsLoading,
    setIsJobListLoading,
    jobListStarted,
    jobListFinished,
    setJobListStarted,
    setJobListFinished,
    setAnalysisLoading,
    setJobsLoading,
    setJobDetails,
    setSkills,
    setJobList,
    clearAll,
  } = useAnalysisStore();

  const cvId = useCVWizardStore((s) => s.cvId);
  const cvUploaded = useCVWizardStore((s) => s.cvUploaded);
  const analysisNeedRun = useCVWizardStore((s) => s.analysisNeedRun);
  const setAnalysisNeedRun = useCVWizardStore((s) => s.setAnalysisNeedRun);
  // Đặt 3 biến global (thường đặt trên cùng file hoặc ngoài component)
  const SUITABLE_POINT = 0.65;
  const PARTIALLY_SUITABLE_POINT = 0.5;
  const NOT_SUITABLE_LABEL = "Không có";
  const NA_LABEL = "Không áp dụng "; // Nếu bạn thích có thể dịch thành "Không áp dụng"
  const [favoriteSkillIds, setFavoriteSkillIds] = useState([]);
const analysisError = useAnalysisStore((s) => s.analysisError);

  // Chạy flow khi flag analysisNeedRun = true
  useEffect(() => {
    if (!analysisNeedRun) return;
    setAnalysisNeedRun(false);
     setJobListStarted(false);
 setJobListFinished(false);
  setAnalysisLoading(true);
    runAnalysisFlowOnce({
       userRole: user?.role ?? FREE_USER_ROLE,
      onSkillStart: () => setIsSkillsLoading(true),
      onSkillDone: () => setIsSkillsLoading(false),
      onJobListStart: () => { setJobListStarted(true); setIsJobListLoading(true); },
   onJobListDone: () => { setIsJobListLoading(false); setJobListFinished(true); },
      onJobDetailStart: () => {},
      onJobDetailDone: () => {},
      onFinish: () => { setAnalysisLoading(false); },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisNeedRun]);

  useEffect(() => {
    if (!cvUploaded) {
      navigate("/analyze/upload");
    }
  }, [cvUploaded, navigate]);

  const handleAddFavorite = async (skillId) => {
    if (!user?.id) return;
    try {
      console.log("Adding favorite skill:", skillId);

      await userService.addFavoriteMissingSkill(user.id, skillId);
      setFavoriteSkillIds((prev) => [...prev, skillId]);
      showSuccess("Đã thêm vào kỹ năng yêu thích!");
    } catch (e) {
      showError(
        e?.response?.data?.message ||
          "Có lỗi xảy ra khi thêm kỹ năng yêu thích."
      );
    }
  };

  // Render phần kỹ năng
  const renderSkillsSection = () => {
    if (isSkillsLoading) return <SkillSkeleton />;
    if (skills && skills.length > 0)
      return skills.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl shadow-sm text-base font-semibold text-blue-900"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#2563eb" strokeWidth="2" />
            <circle
              cx="11"
              cy="11"
              r="5"
              fill="#e0edff"
              stroke="#2563eb"
              strokeWidth="1"
            />
          </svg>
          {item.skill || item.cvSkill}
        </div>
      ));
    return (
      <div className="flex items-center col-span-2 text-gray-400 italic gap-2 py-3">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#d1d5db" strokeWidth="2" />
          <path
            d="M9.5 9.5h.01M14.5 9.5h.01M9 15c.7-.7 2.3-.7 3 0"
            stroke="#d1d5db"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        Chưa có kỹ năng nào phù hợp được tìm thấy.
      </div>
    );
  };

  // Render phần job list (show từng job skeleton/loading/real data)
  const renderJobsSection = () => {
       // Nếu Step 3 fail (mảng rỗng do AI fail) → show lỗi, không render skeleton
   if (analysisError?.step === "jobList") {
     return (
       <div className="border rounded-xl bg-red-50 p-6 my-6 text-center">
         <h2 className="text-red-700 font-bold mb-2">Không lấy được danh sách công việc</h2>
         <p className="text-red-700">{analysisError.message}</p>
         <button
           onClick={() => setAnalysisNeedRun(true)}
           className="mt-4 px-4 py-2 rounded bg-red-600 text-white font-semibold"
         >
           Thử lại
         </button>
       </div>
     );
   }
    if (isJobListLoading) {
      return (
        <>
         <div className="text-sm text-blue-700 mb-2">AI đang phân tích danh sách công việc…</div>
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx}><JobSkeleton /></div>
          ))}
        </>
      );
    }
    if (role === FREE_USER_ROLE) {
      return (
        <div className="border rounded-xl bg-yellow-50 p-7 text-center my-6 shadow">
          <h2 className="text-xl font-bold text-yellow-700 mb-2">
            Bạn đang dùng tài khoản miễn phí
          </h2>
          <p className="text-gray-700 mb-3">
            Nâng cấp tài khoản để xem đầy đủ kết quả phân tích công việc, nhận
            tư vấn kỹ năng còn thiếu và đánh giá độ phù hợp cá nhân hóa!
          </p>
          <button
            onClick={() => navigate("/servicepayment")}
            className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-5 py-2 rounded shadow"
          >
            Nâng cấp tài khoản ngay
          </button>
          <div className="mt-6">
            <JobSkeleton />
          </div>
        </div>
      );
    }
     // CHƯA BẮT ĐẦU bước jobList → đừng nói "không tìm thấy"
 if (!jobListStarted) {
   return (
     <div className="text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 py-2 inline-flex items-center gap-2">
       <span className="inline-block h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
       AI đang chuẩn bị phân tích danh sách công việc…
     </div>
   );
 }
   if (jobListFinished && (!jobList || jobList.length === 0)) {
      return (
        <p className="text-gray-400 italic">
         Không tìm thấy công việc phù hợp.{" "}
        </p>
      );
    }

    return jobList.map((job, index) => {
      const jobInfo = jobDetails[job.jobId];
      const isLoading = jobsLoading && jobsLoading[job.jobId];
      if (isLoading || !jobInfo) return <JobSkeleton key={job.jobId} />;
      return (
        <div
          key={job.jobId}
          className="border rounded-xl p-6 my-7 bg-white shadow-sm"
        >
          <h3 className="text-red-600 font-bold mb-2 text-[20px]">
            Công việc {index + 1}: {job.title} – {job.company}
          </h3>
          <div className="italic mb-2 text-gray-700">
            <span className="font-semibold not-italic text-gray-900 ">
              Mô tả công việc{" "}
            </span>{" "}
            :{job.description}
          </div>
          {jobInfo.error ? (
            <div className="text-red-600 font-semibold">
              Xin lỗi, AI không thể phân tích công việc này.
            </div>
          ) : (
            <>
              {/* Nhận xét */}
              {/* {jobInfo.commentData && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded">
                  <strong>Nhận xét chung:</strong>{" "}
                  <span className="text-gray-700">
                    {jobInfo.commentData.generalComment}
                  </span>
                  {jobInfo.commentData.skillComment &&
                    jobInfo.commentData.skillComment.length > 0 && (
                      <ul className="mt-2 list-disc list-inside pl-5 text-sm text-blue-900 space-y-1">
                        {jobInfo.commentData.skillComment.map((cmt, idx) => (
                          <li key={idx}>
                            <span className="font-semibold">{cmt.skill}:</span>{" "}
                            {cmt.comment}
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              )} */}

              {/* Bảng skill gap */}
              <div className="border rounded-xl overflow-hidden text-sm my-6">
                <table className="w-full border-collapse text-center">
                  <thead className="bg-blue-50 text-gray-800 font-semibold">
                    <tr>
                      <th className="border px-3 py-2">
                        Kĩ năng công việc yêu cầu{" "}
                      </th>
                      <th className="border px-3 py-2">
                        Kỹ năng trong CV phù hợp nhất
                      </th>
                      <th className="border px-3 py-2">Điểm phù hợp (%)</th>
                      <th className="border px-3 py-2">Độ phù hợp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobInfo.skillGap && jobInfo.skillGap.length > 0 ? (
                      jobInfo.skillGap.map((item, idx) => {
                        let percent = Math.round(item.score * 100);
                        let level;
                        if (item.score > SUITABLE_POINT) level = "SUITABLE";
                        else if (item.score >= PARTIALLY_SUITABLE_POINT)
                          level = "PARTIAL";
                        else level = "NOT";

                        // Định nghĩa hiển thị
                        let scoreDisplay =
                          level === "NOT" ? NA_LABEL : percent + "%";
                        let cvSkillDisplay =
                          level === "NOT" ? NOT_SUITABLE_LABEL : item.cvSkill;

                        let scoreColor =
                          level === "SUITABLE"
                            ? "text-green-600"
                            : level === "PARTIAL"
                            ? "text-yellow-500"
                            : "text-red-600";

                        let matchLabel =
                          level === "SUITABLE" ? (
                            <span className="text-green-700 font-bold">
                              Phù hợp
                            </span>
                          ) : level === "PARTIAL" ? (
                            <span className="text-yellow-600 font-bold">
                              Phù hợp một phần
                            </span>
                          ) : (
                            <span className="text-red-500 font-bold">
                              Không phù hợp
                            </span>
                          );

                        return (
                          <tr key={idx}>
                            <td className="border px-3 py-2">
                              {item.jobSkill}
                            </td>
                            <td className="border px-3 py-2">
                              {cvSkillDisplay}
                            </td>
                            <td
                              className={`border px-3 py-2 font-semibold ${scoreColor}`}
                            >
                              {scoreDisplay}
                            </td>
                            <td className="border px-3 py-2">{matchLabel}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="border px-3 py-2 text-gray-400 italic"
                        >
                          Không có dữ liệu phân tích kỹ năng.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* List job skills */}
              <div className="mb-3">
                <h4 className="font-semibold text-blue-700 mb-2">
                  Tất cả kỹ năng yêu cầu của công việc:
                </h4>
                <ul className="flex flex-wrap gap-2">
                  {jobInfo.jobSkills && jobInfo.jobSkills.length > 0 ? (
                    jobInfo.jobSkills.map((skill) => {
                      const isFav = favoriteSkillIds.includes(skill.id);
                      return (
                        <li
                          key={skill.id}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {skill.skill}
                          <button
                            className="ml-1"
                            title={
                              isFav
                                ? "Đã thêm vào yêu thích"
                                : "Thêm vào kỹ năng yêu thích"
                            }
                            disabled={isFav}
                            onClick={() =>
                              !isFav && handleAddFavorite(skill.id)
                            }
                            style={{ cursor: isFav ? "default" : "pointer" }}
                          >
                            {isFav ? (
                              <FaStar className="text-yellow-500" />
                            ) : (
                              <FaRegStar className="text-gray-400 hover:text-yellow-400" />
                            )}
                          </button>
                        </li>
                      );
                    })
                  ) : (
                    <span className="text-gray-400 italic">Không có.</span>
                  )}
                </ul>
                <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <FaStar className="inline text-yellow-500" /> Bấm vào ngôi sao
                  để lưu kỹ năng yêu thích còn thiếu
                </div>
              </div>
            </>
          )}
        </div>
      );
    });
  };

  return (
    <div className="bg-white min-h-screen py-6 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-1 flex items-center gap-3">
        <span>Kết quả phân tích </span>
      </h1>
      <div className="h-1 w-14 bg-blue-200 rounded-full mb-6" />

      {/* Kỹ năng từ CV */}
      <h2 className="text-xl font-semibold text-blue-600 mb-4 flex items-center gap-2 tracking-wide">
        <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
          <path
            d="M7 10a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM3 16.5a7 7 0 1 1 14 0v.25a1.25 1.25 0 0 1-1.25 1.25H4.25A1.25 1.25 0 0 1 3 16.75V16.5Z"
            fill="#2563eb"
          />
        </svg>
        Kỹ năng hiện tại của bạn
      </h2>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        {renderSkillsSection()}
      </div>
      {/* --- TIÊU ĐỀ PHÂN TÍCH CÔNG VIỆC --- */}
      <h2 className="text-xl font-semibold text-blue-600 mb-4 mt-10 flex items-center gap-2 tracking-wide">
        <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
          <path
            d="M7 10a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM3 16.5a7 7 0 1 1 14 0v.25a1.25 1.25 0 0 1-1.25 1.25H4.25A1.25 1.25 0 0 1 3 16.75V16.5Z"
            fill="#2563eb"
          />
        </svg>
        Phân tích công việc
      </h2>
      <div className="mt-10">{renderJobsSection()}</div>

      {/* --- HẾT BỌC --- */}
    </div>
  );
};

export default AnalyzeResult;
