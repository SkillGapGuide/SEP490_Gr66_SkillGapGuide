import { apiService } from './api';
import { ENDPOINTS } from '../constants/apiEndpoints';
import { get } from 'react-hook-form';

export const subscriptionService = {
    getAllSubscriptions: async () => {
        const response = await apiService.get(ENDPOINTS.subscription.getAllSubscriptions);
        return response.result; // Returns array of subscriptions
    },
    updateSubscription: async (data) => {  
        return await apiService.post(ENDPOINTS.subscription.updateSubscription, {
            subscriptionId: data.subscriptionId,
            type: data.type,
            price: data.price,
            subscriptionName: data.subscriptionName,
            status: data.status,
        });
    }
    , 
    createSubscription: async (data) => {
        return await apiService.post(ENDPOINTS.subscription.createSubscription, {
            type: data.type,
            price: data.price,
            subscriptionName: data.subscriptionName,
            status: data.status,
        });
    },
}