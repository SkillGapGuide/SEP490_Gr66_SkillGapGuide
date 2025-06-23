import { apiService } from './api';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const feedbackService = {
    getAllFeedbacks: async (params = { star: 0, pageNo: 0, pageSize: 10, }) => {
        const queryParams = new URLSearchParams({
            star: params.star,
            pageNo: params.pageNo,
            pageSize: params.pageSize,
          
        }).toString();
        const response = await apiService.get(`${ENDPOINTS.feedback.getAllFeedbacks}?${queryParams}`);
        return response;
    },

    // getFeedbackByEmail: async (email) => {
    //     const response = await apiService.get(ENDPOINTS.feedback.getFeedbackByEmail(email));
    //     return response;
    // }
};