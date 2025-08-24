import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCourseStore = create(
  persist(
    (set) => ({
      scrapedCourses: {},
      isCourseLoading: false,
      loadMoreCount: 0,            // số lần load thêm
      isLoadMoreLoading: false,    // flag loading riêng cho load more

      setScrapedCourses: (courseData) => set({ scrapedCourses: courseData }),
      setCourseLoading: (val) => set({ isCourseLoading: val }),
      clearScrapedCourses: () =>
        set({ scrapedCourses: {}, isCourseLoading: false, loadMoreCount: 0 }),

      setLoadMoreCount: (val) => set({ loadMoreCount: val }),
      setIsLoadMoreLoading: (val) => set({ isLoadMoreLoading: val }),
    }),
    { name: "scraped-course-storage" }
  )
);

