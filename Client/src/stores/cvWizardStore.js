import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCVWizardStore = create(
  persist(
    (set) => ({
      // Những gì nên persist (không persist file object)
      cvId: null, // Lưu cvId lấy được từ API sau khi upload
      setCvId: (cvId) => set({ cvId }),

      selectedOption: "", // "upload" | "link" | "auto"
      setSelectedOption: (selectedOption) => set({ selectedOption }),

      topcvLinks: [],
      setTopcvLinks: (topcvLinks) => set({ topcvLinks }),

      jobFilesMeta: [], // chỉ lưu metadata các file
      setJobFilesMeta: (filesMeta) => set({ jobFilesMeta: filesMeta }),

      // Chỉ để preview khi chưa reload (không persist)
      cvFile: null,
      setCVFile: (cvFile) => set({ cvFile }),

      jobFiles: [],
      setJobFiles: (jobFiles) => set({ jobFiles }),

      uploadResult: null,
      setUploadResult: (uploadResult) => set({ uploadResult }),

      cvUploaded: false,
      setCvUploaded: (uploaded) => set({ cvUploaded: uploaded }),
      analysisNeedRun: false,
      setAnalysisNeedRun: (v) => set({ analysisNeedRun: v }),
      
      clearAllCvAndFile: () =>
        set({
          cvId: null,
          selectedOption: "",
          topcvLinks: [],
          jobFilesMeta: [],
          cvUploaded: false,
          cvFile: null,
          jobFiles: [],
          uploadResult: null,
          analysisNeedRun: false,
        }),
         clearJobInputsOnly: () => set({
       
        topcvLinks: [],
        jobFilesMeta: [],
        jobFiles: [],
        uploadResult: null,
        analysisNeedRun: false,
        // KHÔNG đụng tới cvId, cvUploaded, cvFile
      }),
    }),
    
     // 👇 Thêm action mới: chỉ xóa INPUT job, giữ lại CV
     

    {
      name: "cvwizard-persist",
      // Chỉ persist các trường bên trên, không persist file object!
      partialize: (state) => ({
        cvId: state.cvId,
        cvUploaded: state.cvUploaded,
        selectedOption: state.selectedOption,
        topcvLinks: state.topcvLinks,
        jobFilesMeta: state.jobFilesMeta,
        analysisNeedRun: state.analysisNeedRun,
      }),
    }
  )
);
