import httpClient from "@/constants/httpclient";

export const FeedbackService = {
    //! Submit feedback
    async submitFeedback(feedback: any) {
        return await httpClient.post(`/feedback/add`, feedback);
    },
    
    //! Get all feedback
    async getFeedback() {
        return await httpClient.get(`/feedback/all`);
    },

    //! Get feedback by ID
    async getFeedbackById(id: string) {
        return await httpClient.get(`/feedback/report/${id}`);
    }
};