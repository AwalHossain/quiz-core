// ExamSessionPage.tsx
import { getLoginUserInfo } from "@/action/set-cookie";
import { ExamProvider } from "@/context/ExamProvider";

import { ExamSession } from "@/services/session";
import Link from "next/link";
import { GetCurrentQuestion } from "./features/exam-action";
import ExamContent from "./features/ExamContent";
import ExamTimer from "./features/ExamTimer";

const ExamSessionPage = async ({ params }: { params: { sessionId: string } }) => {
    const { userId } = await getLoginUserInfo();
    const { data } = await ExamSession(params.sessionId, userId || "");

    if (data.status === "FINISHED") {
        return (
            <div className="flex flex-col justify-center items-center text-center mt-5">
                <p>
                    <span className="text-2xl text-red-500 font-bold">Exam has been completed</span>
                </p>

                <br />
                <Link className="border border-custom-green p-2 rounded-md hover:text-white hover:bg-primary" href={`/result/${userId}/${params.sessionId}`}>Click here to view result</Link>
            </div>
        );
    }


    const { data: currentQuestion } = await GetCurrentQuestion(data.id, "current");

    return (
        <div>
            <h1>Exam Questions</h1>
            <div>
                <ExamTimer initialTime={data.remainingTime} duration={data.duration} sessionId={params.sessionId} userId={userId || ""} examSessionId={data.id} />

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


