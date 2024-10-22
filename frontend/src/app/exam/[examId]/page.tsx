// ExamSessionPage.tsx
import { ExamProvider } from "@/context/ExamProvider";
import { GetCurrentQuestion } from "@/services/questions";
import { ExamSession } from "../../../services/session";
import ExamContent from "./features/ExamContent";
import ExamTimer from "./features/ExamTimer";

const ExamSessionPage = async ({ params }: { params: { examId: string } }) => {
    const { data } = await ExamSession(params.examId, "b158e666-fec5-4d72-9447-ef4463c7a9da");
    console.log(data, "Hey aman it's not working")

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


