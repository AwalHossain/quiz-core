import { AxiosResponse } from "axios";
import { clientFetch } from "../client-fetch";
import { ENDPOINTS } from "../endpoints";

type Exam = {
  id: number;
  title: string;
  description: string;
  duration: number;
}

export const getAllExam = 
    async (): Promise<AxiosResponse<Exam[]>> => {
      try {
        const response = await clientFetch.get(ENDPOINTS['GETALLEXAM']);
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
