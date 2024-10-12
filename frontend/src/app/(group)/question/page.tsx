import { getAllExam } from "@/services/session";

const QuestionPage = async () => {
    const getQuestions = await getAllExam();
    console.log(getQuestions, "getQuestions");
    return (
        <div>QuestionPage</div>
    )
}

export default QuestionPage;
