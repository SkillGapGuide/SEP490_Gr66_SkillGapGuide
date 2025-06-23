import { apiService } from './api';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const staticPageService = {
    getTermsOfService: async () => {
        const response = await apiService.get(ENDPOINTS.admin.pages.getTermsOfService);
        return response.result; // Returns {title, content}
        
    },
    getSocialLink: async () => {
        const response = await apiService.get(ENDPOINTS.admin.pages.getSocialLink);
        return response.result; // Returns {title, content}
      
    },
    getPrivacy: async () => {
        const response = await apiService.get(ENDPOINTS.admin.pages.getPrivacy);
        return response.result; // Returns {title, content}
        
    },
    getHomePage: async () => {
        const resetonse = await apiService.get(ENDPOINTS.admin.pages.getHomePage);
        return resetonse.result; // Returns {title, content}
       
    },
    getAboutUs: async () => {
        const response = await apiService.get(ENDPOINTS.admin.pages.getAboutUs);
        return response.result; // Returns array of {title, content} objects
       
    },

    updateTermsOfService: async (data) => {
  return await apiService.post(ENDPOINTS.admin.pages.updateTermsOfService, {
    title: data.title,
    content: data.content
  });
},

updatePrivacy: async (data) => {
  return await apiService.post(ENDPOINTS.admin.pages.updatePrivacy, {
    title: data.title,
    content: data.content
  });
},

    /**
     * @param {{title: string, content: string}} data
     */
    updateSocialLink: async (data) => {
        const { title, content } = data;
        return await apiService.post(ENDPOINTS.admin.pages.updateSocialLink, { title, content });
    },

    

    /**
     * @param {{title: string, content: string}} data
     */
    updateHomePage: async (data) => {
        const { title, content } = data;
        return await apiService.post(ENDPOINTS.admin.pages.updateHomePage, { title, content });
    },

    /**
     * @param {{title: string, content: string}} data - Single section update
     */
    updateAboutUs: async (data) => {
        const { title, content } = data;
        return await apiService.post(ENDPOINTS.admin.pages.updateAboutUs, { title, content });
    }
};