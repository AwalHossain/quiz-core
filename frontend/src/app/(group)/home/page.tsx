import { getAllExam } from "@/services/session";
import ExamCards from "../../../components/card/ExamCards";

const HomePage = async () => {
    const getQuestions = await getAllExam();
    console.log(getQuestions.data, "getQuestions");
    return (
        <div>
            <ExamCards />
        </div>
    )
}

export default HomePage;
