import { create } from "zustand";

export const useCVWizardStore = create((set) => ({
  // State lưu file CV
  cvFile: null,
  setCVFile: (cvFile) => set({ cvFile }),
  // NEW: State lưu cvId
  cvId: null,
  setCvId: (cvId) => set({ cvId }),

  // State lưu kết quả upload CV (tùy ý)
  uploadResult: null,
  setUploadResult: (uploadResult) => set({ uploadResult }),

  // State lưu danh sách link TOPCV
  topcvLinks: [],
  setTopcvLinks: (topcvLinks) => set({ topcvLinks }),

  // Các state khác bạn muốn lưu giữa các bước:
  jobFiles: [],
  setJobFiles: (jobFiles) => set({ jobFiles }),
  selectedOption: "", // NEW: lưu loại người dùng chọn ("upload", "link", "auto")
  setSelectedOption: (selectedOption) => set({ selectedOption }),
  // Nếu cần clear toàn bộ khi user hoàn thành/quay lại từ đầu:
  clearAll: () =>
    set({
      cvFile: null,
      uploadResult: null,
       cvId: null, // reset luôn cvId
      topcvLinks: [],
      jobFiles: [],
       selectedOption: "", // reset luôn option khi quay lại đầu
      // reset các state khác tuỳ bạn!
    }),
}));
