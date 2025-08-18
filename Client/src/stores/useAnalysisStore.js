// src/stores/useAnalysisStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAnalysisStore = create(
  persist(
    (set, get) => ({
      // Kỹ năng từ CV
      skills: [],
      setSkills: (skills) => set({ skills }),
      isSkillsLoading: false,
      setIsSkillsLoading: (v) => set({ isSkillsLoading: v }),
       analysisError: null,
    setAnalysisError: (analysisError) => set({ analysisError }),

      // Job list (chỉ danh sách công việc)
      jobList: [],
      setJobList: (jobList) => set({ jobList }),
      isJobListLoading: false,
      setIsJobListLoading: (v) => set({ isJobListLoading: v }),

      // Job detail (loading từng job)
      jobDetails: {}, // { [jobId]: {...} }
      setJobDetails: (jobDetails) => set({ jobDetails }),
      jobsLoading: {}, // { [jobId]: true/false }
      setJobsLoading: (jobsLoading) => set({ jobsLoading }),

      // Toàn bộ flow loading
      isAnalysisLoading: false,
      setAnalysisLoading: (v) => set({ isAnalysisLoading: v }),

      // Xoá sạch
      clearAll: () => set({
        skills: [],
        jobList: [],
        jobDetails: {},
        isSkillsLoading: false,
        isJobListLoading: false,
        jobsLoading: {},
        isAnalysisLoading: false,
        analysisError: null,
      }),
    }),
    {
      name: "analysis-persist",
    }
  )
);
