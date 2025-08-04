import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCourseStore = create(
  persist(
    (set) => ({
      scrapedCourses: {},
      isCourseLoading: false,   // <-- THÊM FLAG NÀY
      setScrapedCourses: (courseData) => set({ scrapedCourses: courseData }),
      setCourseLoading: (val) => set({ isCourseLoading: val }),
      clearScrapedCourses: () => set({ scrapedCourses: {}, isCourseLoading: false }),
    }),
    { name: "scraped-course-storage" }
  )
);

