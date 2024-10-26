/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAxiosError } from "@/lib/getAxiosError";
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import { ENDPOINTS } from "../endpoints";
import { serverFetch } from "../server-fetch";

export const getResult = async ({userId, examId}: {userId: string, examId: string}): Promise<AxiosResponse<any>> => {
    try {
        const queryParams = new URLSearchParams({
            userId,
            examId
        }).toString();
        const response = await serverFetch.get(`${ENDPOINTS["RESULT"]}?${queryParams}`);
        return response;
    } catch (error: any) {
        const message = getAxiosError(error);
        console.log(message, "message from here",error);
        
        // toast.error(`${message.message} ${message.status}`);
        throw new Error(error.response?.data?.message || error.message || 'An error occurred while fetching the result');
    }
}

export const getResultLeaderboard = async ({examId, limit=100}: {examId: string, limit?: number}): Promise<AxiosResponse<any>> => {
    try {
        const url = `${ENDPOINTS["LEADERBOARD"]}/${examId}/leaderboard?limit=${limit}`;
        console.log(url, "url of leaderboard");
        
        const response = await serverFetch.get(url);
        return response;
    } catch (error: any) {
        const message = getAxiosError(error);
        toast.error(`${message.message} ${message.status}`);
        return Promise.reject(error);
    }
}
