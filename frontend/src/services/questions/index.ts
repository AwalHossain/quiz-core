// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { getAxiosError } from "@/lib/getAxiosError";
// import { AxiosResponse } from "axios";
// import { toast } from "sonner";
// import { ENDPOINTS } from "../endpoints";
// import { serverFetch } from "../server-fetch";





// export const FinishExam = async (examSessionId: string): Promise<AxiosResponse<any>> => {
//     try {
//         const response = await serverFetch.post(`${ENDPOINTS["FINISH"]}`, { examSessionId });
//         return response;
//     } catch (error: any) {
//         const message = getAxiosError(error);
//             toast.error(`${message.message} ${message.status}`);
//             return Promise.reject(error);
//     }
// }
