// ExamSessionPage.tsx
import { ExamProvider } from "@/context/ExamProvider";
import { GetCurrentQuestion } from "@/services/questions";
import { ExamSession } from "../../../services/session";
import ExamContent from "./features/ExamContent";

const ExamSessionPage = async ({ params }: { params: { sessionId: string } }) => {
    const { data } = await ExamSession(params.sessionId, "5d042e01-f949-4c58-89a8-1c5e1d7b953b");
    console.log(data, "Hey aman it's not working")

    // if (data.status === "FINISHED") {
    //     return (
    //         <div className="flex justify-center items-center text-red-500 font-bold text-center mt-5">
    //             Exam has been completed
    //         </div>
    //     );
    // }

    const { data: currentQuestion } = await GetCurrentQuestion(data.id, "current");

    return (
        <div>
            <h1>Exam Questions</h1>
            <div>
                {/* <ExamTimer initialTime={data.remainingTime} duration={data.duration} examId={parseInt(params.examId)} /> */}

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


