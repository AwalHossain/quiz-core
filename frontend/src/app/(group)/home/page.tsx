import { getLoginUserInfo } from "@/action/set-cookie";

import { getAllExam } from "../../../services/session";
import AuthRequired from "./AuthRequired";
import ExamCards from "./card/ExamCards";

const HomePage = async () => {
    const { userId } = await getLoginUserInfo();
    const getQuestions = await getAllExam({ userId: userId || "" });
    return (
        <div>
            <AuthRequired />
            <ExamCards questions={getQuestions.data} userId={userId || ""} />
        </div>
    )
}

export default HomePage;
