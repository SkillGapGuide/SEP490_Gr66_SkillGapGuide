import { apiService } from "./api";
import { ENDPOINTS } from "../constants/apiEndpoints";

export const courService = {
  showCourse: async (courseId) => {
    return await apiService.post(
      ENDPOINTS.course.showCourse.replace("{courseId}", courseId)
    );
  },

  scrape: async (numPage=1,numItems=10) => {
    return await apiService.post(`${ENDPOINTS.course.scrape}?numPage='${numPage}'&numItems=''${numItems}'`);
  },

  hideCourse: async (courseId) => {
    return await apiService.post(
      ENDPOINTS.course.hideCourse.replace("{courseId}", courseId)
    );
  },

  changeFavoriteCourseStatus: async (courseId, userId, status) => {
    return await apiService.post(
      ENDPOINTS.course.changeFavoriteCourseStatus
        .replace("{courseId}", courseId)
        .replace("{userId}", userId)
        .replace("{status}", status)
    );
  },

  addCourseToFavorites: async (userId, courseId) => {
    return await apiService.post(
      ENDPOINTS.course.addCourseToFavorites
        .replace("{userId}", userId)
        .replace("{courseId}", courseId)
    );
  },

  addCourseManually: async (data) => {
    return await apiService.post(ENDPOINTS.course.addCourseManually, data);
  },

  findById: async (courseId) => {
    return await apiService.get(
      ENDPOINTS.course.findById.replace("{courseId}", courseId)
    );
  },

  findAllFavoriteCourses: async (userId, pageNo = 1, pageSize = 10) => {
    const url = `${ENDPOINTS.course.findAllFavoriteCourses.replace(
      "{userId}",
      userId
    )}?pageNo=${pageNo}&pageSize=${pageSize}`;
    return await apiService.get(url);
  },

  deleteFavoriteCourse: async (userId, courseId) => {
    return await apiService.delete(
      ENDPOINTS.course.deleteFavoriteCourse
        .replace("{userId}", userId)
        .replace("{courseId}", courseId)
    );
  },

  deleteAllFavoriteCourse: async (userId) => {
    return await apiService.delete(
      ENDPOINTS.course.deleteAllFavoriteCourse.replace("{userId}", userId)
    );
  },
};
