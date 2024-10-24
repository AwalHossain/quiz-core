/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import { clientFetch } from "../client-fetch";
import { ENDPOINTS } from "../endpoints";




export const GetCurrentQuestion = async (examSessionId: string, action: "next" | "previous" | "current"): Promise<AxiosResponse<any>> => {
    try {
        // console.log("url", `${ENDPOINTS["CURRENT_QUESTION"]}?exmSessionId=${examSessionId}&&action=${action}`);
        
        const response = await clientFetch.get(`${ENDPOINTS["EXAM_QUESTIONS"]}/current?examSessionId=${examSessionId}&&action=${action}`);
        if (response.data) {
            return response;
        } else {
            return Promise.reject(response);
        }
    } catch (error: any) {
        toast.error("No question found");
        return Promise.reject(error);
    }
}

export const SubmitAnswer = async ({examSessionId,questionId,selectedAnswer,isSkipped}: {examSessionId: string,questionId: string,selectedAnswer?: string | null,isSkipped?: boolean}): Promise<AxiosResponse<any>> => {
    try {
        const response = await clientFetch.post(`${ENDPOINTS["SUBMIT"]}`, { examSessionId,questionId,selectedAnswer, isSkipped});
        return response;
    } catch (error: any) {
        return Promise.reject(error);
    }
}

export const FinishExam = async (examSessionId: string): Promise<AxiosResponse<any>> => {
    try {
        const response = await clientFetch.post(`${ENDPOINTS["FINISH"]}`, { examSessionId });
        return response;
    } catch (error: any) {
        return Promise.reject(error);
    }
}
