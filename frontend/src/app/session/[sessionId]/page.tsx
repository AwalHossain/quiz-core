// ExamSessionPage.tsx
import { getLoginUserInfo } from "@/action/set-cookie";
import { ExamProvider } from "@/context/ExamProvider";

import { ExamSession } from "@/services/session";
import { GetCurrentQuestion } from "./features/exam-action";
import ExamContent from "./features/ExamContent";
import ExamTimer from "./features/ExamTimer";

const ExamSessionPage = async ({ params }: { params: { sessionId: string } }) => {
    const { userId } = await getLoginUserInfo();
    const { data } = await ExamSession(params.sessionId, userId || "");

    if (data.status === "FINISHED") {
        return (
            <div className="flex justify-center items-center text-red-500 font-bold text-center mt-5">
                Exam has been completed
            </div>
        );
    }

    console.log(userId, "data from here");


    const { data: currentQuestion } = await GetCurrentQuestion(data.id, "current");

    return (
        <div>
            <h1>Exam Questions</h1>
            <div>
                <ExamTimer initialTime={data.remainingTime} duration={data.duration} sessionId={params.sessionId} userId={userId || ""} />

            </div>
            {currentQuestion && (
                <ExamProvider initialExamState={currentQuestion}>
                    <ExamContent examSessionId={data.id} examId={params.sessionId} userId={userId || ""} />
                </ExamProvider>
            )}
        </div>
    );
};

export default ExamSessionPage;


