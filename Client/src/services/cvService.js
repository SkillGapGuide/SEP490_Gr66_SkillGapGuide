import { apiService } from './api'; // Import service API của bạn
import { ENDPOINTS } from '../constants/apiEndpoints';

export const cvService = {
  // API call to upload CV
uploadCV: async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // GỬI TRỰC TIẾP KHÔNG SET HEADERS
    const response = await apiService.post(ENDPOINTS.cv.uploadCV, formData);

    return response;
  } catch (error) {
    console.error("Error uploading CV:", error);
    throw new Error(error.message || "Upload CV failed");
  }
}


};
