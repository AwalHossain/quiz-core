# QuizCore: Advanced MCQ Exam Platform

QuizCore is a cutting-edge MCQ (Multiple Choice Question) exam platform built with Next.js and Nest.js, offering a seamless and robust experience for both exam takers and administrators.

![QuizCore Banner](insert_banner_image_url_here)

## 🚀 Features

- **Timed Exams**: Exams with customizable time limits and a dynamic countdown timer.
- **Exam Continuity**: Resume exams from where you left off, even after network failures.
- **Flexible Navigation**: Skip questions, go back to previous ones, or submit answers at any time.
- **Instant Results**: Get immediate feedback on your performance after completing the exam.
- **Leaderboard**: Compare your results with other participants.
- **Detailed Analytics**: View comprehensive breakdowns of right, wrong, skipped, and unanswered questions.
- **Secure Authentication**: Cookie-based authentication system for user security.

## 🛠️ Tech Stack

### Frontend
- **Next.js**: For server-side rendering and optimal performance.
- **React**: Building interactive user interfaces.
- **Tailwind CSS**: For responsive and beautiful designs.
- **Axios**: Handling HTTP requests.
- **JWT Decode**: For secure token management.

### Backend
- **Nest.js**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **PostgreSQL**: Robust relational database for data persistence.
- **Prisma**: Next-generation ORM for Node.js and TypeScript.

## 🖥️ Key Components

### Exam Session Management

```11:47:frontend/src/app/session/[sessionId]/page.tsx
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

    console.log(userId, "data from here", data);


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
```

This component handles the core exam session, including timer management and question navigation.

### Question Navigation and Submission

```16:86:frontend/src/app/session/[sessionId]/features/ExamContent.tsx
const ExamContent: React.FC<ExamContentProps> = ({ examSessionId, examId, userId }) => {
    const {
        currentQuestion,
        currentIndex,
        isLast,
        totalQuestions,
    } = useExam();

    const { handleNavigation, updateExamState, isLoading } = useExamNavigation();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    // navigate to other page
    const navigate = useRouter();
    const handleOptionSelect = (optionLetter: string) => {
        setSelectedOption(optionLetter);
    };

    // const updateExamState = (data: any) => {
    //     setCurrentQuestion(data.question);
    //     setCurrentIndex(data.currentIndex);
    //     setIsLast(data.isLast);
    //     setTotalQuestions(data.totalQuestions);
    //     setSubmission(data.submission || null);
    //     setSelectedOption(null);
    // };

    const navigateQuestion = async (direction: 'next' | 'previous' | 'skip') => {
        const apiCall = async () => {
            if (direction === 'previous') {

                return await GetCurrentQuestion(examSessionId, 'previous')

            } else {

                const submitRespose = await SubmitAnswer({ examSessionId, questionId: currentQuestion.id, selectedAnswer: selectedOption, isSkipped: direction === 'skip' });

                console.log(submitRespose, "submitRespose from exam content");

                if (submitRespose.status === 201) {
                    if (isLast) {
                        console.log("isLast");

                        return { isExamComplete: true, status: "success" }
                    }
                    return await GetCurrentQuestion(examSessionId, direction === 'skip' ? 'next' : direction);
                }
            }
            throw new Error("Failed to fetch question")
        }
        setSelectedOption(null);
        await handleNavigation(
            apiCall,
            (data: any) => {
                if (data.isExamComplete) {
                    console.log("Exam complete, navigating to results");
                    toast.success("Exam completed successfully");
                    navigate.push(`/result/${userId}/${examId}`);
                } else {
                    updateExamState(data);
                }
            },
            (error: any) => {
                console.error("Navigation error:", error);
                toast.error(`Error: ${error.message || 'An unexpected error occurred'}`);
            }
        );
    };

    const handleNext = () => navigateQuestion('next');
    const handleSkip = () => navigateQuestion('skip');
    const handlePrevious = () => navigateQuestion('previous');

```

Manages the flow of questions, allowing users to navigate and submit answers seamlessly.


Handles the business logic for exam creation, session management, and result processing.

## 🚀 Getting Started

1. Clone the repository
   ```
   git clone https://github.com/yourusername/quizcore.git
   ```

2. Install dependencies
   ```
   cd quizcore/frontend
   npm install
   cd ../backend
   npm install
   ```

3. Set up your environment variables (refer to `.env.example` in both frontend and backend directories)

4. Run the development servers
   ```
   # Frontend
   cd frontend
   npm run dev

   # Backend
   cd backend
   npm run start:dev
   ```

## 📈 Future Enhancements

- Integration with popular learning management systems
- Advanced analytics dashboard for exam administrators
- Support for different question types (e.g., multiple select, short answer)
- Mobile app for on-the-go exam taking

## 🤝 Contributing

We welcome contributions to QuizCore! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

QuizCore - Empowering education through technology. Built with ❤️ by [Your Name/Team]

[Add badges here for build status, test coverage, etc.]

This README provides a comprehensive overview of your QuizCore project, highlighting its key features, technologies used, and how to get started. It's designed to be attractive to recruiters by showcasing the complexity and modern tech stack of your project. You can further enhance it by adding screenshots of your application in action, which would give viewers a visual representation of your work.
