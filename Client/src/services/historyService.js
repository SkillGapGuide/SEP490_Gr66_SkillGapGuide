import { apiService } from './api';
import { ENDPOINTS } from '../constants/apiEndpoints';
export const historyService = {
    getActionHistory : async () => {
       return await apiService.get(ENDPOINTS.file.getHistory);
    }
}
