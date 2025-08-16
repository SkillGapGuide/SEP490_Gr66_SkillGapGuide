import { apiService } from "./api";
import { ENDPOINTS } from "../constants/apiEndpoints";
export const dashboardService = {
    getTotalMoneyAndUserForLast7Days: async () => {
        return await apiService.get(ENDPOINTS.dashboard.getTotalMoneyAndUserForLast7Days);
    },
    getChartForLastWeek: async () => {
        return await apiService.get(ENDPOINTS.dashboard.getChartForLastWeek);
    },
    getChartForLastMonth: async () => {
        return await apiService.get(ENDPOINTS.dashboard.getChartForLastMonth);
    },
    getNumberUserSubscription: async () => {
        return await apiService.get(ENDPOINTS.dashboard.getNumberUserSubscription);
    },
    getTotalMoney: async () => {
        return await apiService.get(ENDPOINTS.dashboard.getTotalMoney);
    }
};