import ExamCards from "../../../components/card/ExamCards";
import { getAllExam } from "../../../services/session";

const HomePage = async () => {
    const getQuestions = await getAllExam();
    console.log(getQuestions.data, "getQuestions");
    return (
        <div>
            <ExamCards questions={getQuestions.data} />
        </div>
    )
}

export default HomePage;
