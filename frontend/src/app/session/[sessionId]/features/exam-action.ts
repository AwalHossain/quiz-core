'use server'

import { ENDPOINTS } from "@/services/endpoints";
import { serverFetch } from "@/services/server-fetch";

export const GetCurrentQuestion = async (examSessionId: string, action: "next" | "previous" | "current") => {
    try {
        const response = await serverFetch.get(`${ENDPOINTS["EXAM_QUESTIONS"]}/current?examSessionId=${examSessionId}&&action=${action}`);
        return {
            status: response.status,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error fetching question:', error);
        throw new Error('Failed to fetch question');
    }
}

export const SubmitAnswer = async ({
    examSessionId,
    questionId,
    selectedAnswer,
    isSkipped
}: {
    examSessionId: string,
    questionId: string,
    selectedAnswer?: string | null,
    isSkipped?: boolean
}) => {
    try {
        const url = `${ENDPOINTS["SUBMIT"]}`;
        console.log(url, "url");
        const response = await serverFetch.post(url, { examSessionId, questionId, selectedAnswer, isSkipped });
        console.log(response.data, "response data from submit answer");
        return {
            status: response.status,
            data: response.data
        };
    } catch (error: any) {
        console.error('Error submitting answer:', error);
        throw new Error('Failed to submit answer');
    }
}
