/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { clientFetch } from "../client-fetch";
import { ENDPOINTS } from "../endpoints";

export const getResult = async ({userId, examId}: {userId: string, examId: string}): Promise<AxiosResponse<any>> => {
    try {
        const queryParams = new URLSearchParams({
            userId,
            examId
        }).toString();
        const response = await clientFetch.get(`${ENDPOINTS["RESULT"]}?${queryParams}`);
        return response;
    } catch (error: any) {
        return Promise.reject(error);
    }
}

export const getResultLeaderboard = async ({examId, limit}: {examId: string, limit?: number}): Promise<AxiosResponse<any>> => {
    try {
        const url = `${ENDPOINTS["LEADERBOARD"]}/${examId}/leaderboard?limit=${limit}`;
        console.log(url, "url of leaderboard");
        
        const response = await clientFetch.get(url);
        return response;
    } catch (error: any) {
        return Promise.reject(error);
    }
}
