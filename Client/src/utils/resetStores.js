// src/utils/resetStores.js
import { useCVWizardStore } from "../stores/cvWizardStore";
import { useAnalysisStore } from "../stores/useAnalysisStore";
import { useCourseStore } from "../stores/courseStore";

export function resetStoresForNewRun({ mode = "soft", clearPersist = false } = {}) {
  // luôn xoá phân tích + khoá học
  useAnalysisStore.getState().clearAll();
  useCourseStore.getState().clearScrapedCourses();

  if (mode === "soft") {
    // chỉ dọn input job, GIỮ CV
    useCVWizardStore.getState().clearJobInputsOnly();
  } else if (mode === "hard") {
    // xoá sạch cả CV
    useCVWizardStore.getState().clearAllCvAndFile();
  }

  if (clearPersist) {
    useAnalysisStore.persist?.clearStorage?.();
    useCourseStore.persist?.clearStorage?.();
    if (mode === "hard") {
      useCVWizardStore.persist?.clearStorage?.();
    }
    // rehydrate
    useAnalysisStore.persist?.rehydrate?.();
    useCourseStore.persist?.rehydrate?.();
    if (mode === "hard") {
      useCVWizardStore.persist?.rehydrate?.();
    }
  }
}
