import ExamCards from "../../../components/card/ExamCards";
import { getAllExam } from "../../../services/session";

const HomePage = async () => {
    const getQuestions = await getAllExam({ userId: "5d042e01-f949-4c58-89a8-1c5e1d7b953b" });
    console.log(getQuestions.data, "getQuestions");
    return (
        <div>
            <ExamCards questions={getQuestions.data} />
        </div>
    )
}

export default HomePage;
