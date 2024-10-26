/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { clientFetch } from "../client-fetch";
import { ENDPOINTS } from "../endpoints";
import { serverFetch } from "../server-fetch";



export const getAllExam =
    async ({ userId }: { userId?: string}): Promise<AxiosResponse<any>> => {
        try {
            const response = await clientFetch.get(ENDPOINTS['GETALL_EXAM'], {
                params: {
                    userId
                }
            });

          return response;
        
      } catch (error: any) {
        // const message = getAxiosError(error);
        // toast.error(`${message.message} ${message.status}`);
        throw new Error(error.response?.data?.message || error.message || 'An error occurred while fetching the result');
    }
}


export const ExamSession = async (examId: string, userId: string)=> {
    try {
        const url = `${ENDPOINTS['EXAM_SESSION']}/${examId}/${userId}`;
        const response = await serverFetch.get(url);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'An error occurred while fetching the result');
    }
}
