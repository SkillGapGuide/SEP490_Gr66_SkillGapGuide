import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCourseStore = create(
  persist(
    (set) => ({
      scrapedCourses: {}, // Dạng: { [skillName]: [courseObj, ...] }

      setScrapedCourses: (courseData) => set({ scrapedCourses: courseData }),

      // Có thể gọi riêng để clear nếu cần
      clearScrapedCourses: () => set({ scrapedCourses: {} }),
    }),
    {
      name: "scraped-course-storage", // key dùng trong localStorage
    }
  )
);
