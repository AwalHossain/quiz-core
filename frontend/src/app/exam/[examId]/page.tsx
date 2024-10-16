/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * this page will start or resume the exam session
 * and will show the exam questions
 * @param param0 
 * @returns 
 */


import { redirect } from "next/navigation";
import { ExamSession } from "../../../services/session";
import ExamTimer from "./features/ExamTimer";
import MCQQuiz from "./features/MCQQuiz";

const ExamSessionPage = async ({ params }: { params: { examId: string } }) => {
    const { data, status, statusText } = await ExamSession(parseInt(params.examId), 4);
    console.log(data, "session", status);

    if (data.status === "FINISHED") {
        // redirect to result page


        return (
            `Exam Finished, redirecting to leaderboard ${redirect(`/leaderboard`)}`
        );

    }


    return (
        <div>

            {/* Show exam timer here */}
            <ExamTimer initialTime={data.remainingTime} duration={data.duration} examId={parseInt(params.examId)} />
            {/* Show exam questions here */}
            <div>
                <h1>Exam Questions</h1>
            </div>
            <MCQQuiz />
        </div>
    )
}

export default ExamSessionPage;
