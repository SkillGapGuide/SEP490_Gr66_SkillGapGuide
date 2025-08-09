import { apiService } from './api';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const skillGapService = {
  getSkillGap: async (jobId, cvId) => {
    try {
      const response = await apiService.get(ENDPOINTS.skillGap.getSkillGap, 
         { jobId, cvId },
      );
      return response;
    } catch (error) {
      console.error("Error fetching skill gap:", error);
      throw new Error(error.message || "Fetch skill gap failed");
    }
  },
  getCommentSkill: async (jobId, cvId) => {
    try {
      const response = await apiService.get(ENDPOINTS.skillGap.getCommentSkill, 
        { jobId, cvId },
      );
      return response;
    } catch (error) {
      console.error("Error fetching comment skill:", error);
      throw new Error(error.message || "Fetch comment skill failed");
    }
  },
  getJobList: async () => {
    try {
      const response = await apiService.get(ENDPOINTS.job.getJobList);
      return response;
    } catch (error) {
      console.error("Error fetching job list:", error);
      throw new Error(error.message || "Fetch job list failed");
    }
  },
  getJobSkills: async (jobId)  => {
    try {
      const response = await apiService.get(ENDPOINTS.job.getJobSkills,  { jobId } );
      return response;
    } catch (error) {
      console.error("Error fetching job skills:", error);
      throw new Error(error.message || "Fetch job skills failed");
    }
  }  ,

  // option param 1 : job file -param 1
  // option param 2 : link job -param 2
  // option param 3 : auto scpare =param 3
  analyzeJobDescription: async (option ) => {
    try {
      const response = await apiService.get(ENDPOINTS.job.analyzeJob, { option });
      return response;
    } catch (error) {
      console.error("Error analyzing job description:", error);
      throw new Error(error.message || "Analyze job description failed");
    }
  },
   getJobMatchScore: async () => {
    try {
      const response = await apiService.get(ENDPOINTS.job.getJobMatchScore );
      return response;
    } catch (error) {
      console.error("Error fetching job match score:", error);
      throw new Error(error.message || "Fetch job match score failed")};
    }
};

