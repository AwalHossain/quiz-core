import { getResult } from '@/services/result'
import ShowResult from './features/ShowResult'

interface ExamResultsProps {
    params: {
        userId: string
        examId: string
    }
}

const ExamResult = async ({ params }: ExamResultsProps) => {
    const { userId, examId } = params;
    const result = await getResult({ userId, examId });
    console.log(result.data, "result from here");
    return (
        <ShowResult result={result?.data} />
    )
}

export default ExamResult
