import { apiService } from "./api";
import { ENDPOINTS } from "../constants/apiEndpoints";
export const jobService = {
    getFavouriteJobs: async () => {
        return await apiService.get(ENDPOINTS.job.getFavoriteJobs);
    }
    ,
    addFavouriteJob: async (jobId) => {
    const endpoint = ENDPOINTS.job.addFavoriteJob.replace("{jobId}", jobId);
    return await apiService.post(endpoint);
}

    ,
    removeFavouriteJob: async (jobId) => {
        const endpoint = ENDPOINTS.job.removeFavoriteJob.replace("{jobId}", jobId);
        return await apiService.delete(endpoint);
        
    }
}
