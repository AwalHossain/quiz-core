// ExamSessionPage.tsx
import { ExamProvider } from "@/context/ExamProvider";
import { GetCurrentQuestion } from "@/services/questions";
import { ExamSession } from "../../../services/session";
import ExamContent from "./features/ExamContent";
import ExamTimer from "./features/ExamTimer";

const ExamSessionPage = async ({ params }: { params: { examId: string } }) => {
    const { data } = await ExamSession(params.examId, "7a48fb62-4321-4b6c-82a8-35ecdaadcc08");
    const { data: currentQuestion } = await GetCurrentQuestion(data.id, "current");

    return (
        <div>
            <h1>Exam Questions</h1>
            <div>
                <ExamTimer initialTime={data.remainingTime} duration={data.duration} examId={parseInt(params.examId)} />

            </div>
            {currentQuestion && (
                <ExamProvider initialExamState={currentQuestion}>
                    <ExamContent examSessionId={data.id} />
                </ExamProvider>
            )}
        </div>
    );
};

export default ExamSessionPage;


