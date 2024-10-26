import { Exam } from "@/interface/constants";
import { getAllExam } from "@/services/session";



export const allExamDetails = async (userId: string): Promise<Exam[]> => {
    const response = await getAllExam({ userId })
    return response?.data;
}
