/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { clientFetch } from "../client-fetch";
import { ENDPOINTS } from "../endpoints";



export const getAllExam =
    async ({ userId }: { userId?: string}): Promise<AxiosResponse<Exam[]>> => {
        try {
            const response = await clientFetch.get(ENDPOINTS['GETALL_EXAM'], {
                params: {
                    userId
                }
            });
        if (response.data) {
          return response;
        } else {
          return Promise.reject(response);
        }
      } catch (error: any) {
        console.error('Error fetching user data: ', error);
        return Promise.reject(error);
      }
    }


export const ExamSession = async (sessionId: string, userId: string): Promise<AxiosResponse<any>> => {
    try {
        const url = `${ENDPOINTS['EXAM_SESSION']}/${sessionId}/${userId}`;
        const response = await clientFetch.get(url);
        if (response.data) {
                return response;
            } else {
                return Promise.reject(response);
            }
        } catch (error: any) {
        console.error('Error starting or resuming exam session: ', error.response.data);
        return Promise.reject(error);
    }
}
