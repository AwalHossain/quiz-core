'use client'
import { Exam } from '@/types/constants';
import React from 'react';
import Q1 from '../../assets/Q1.png';
import Q2 from '../../assets/Q2.png';
import Q3 from '../../assets/Q3.png';
import ExamCard from './ExamCard';
// // ... keep the existing Stat component and interfaces ...

// const ExamCard: React.FC<ExamCardProps> = ({ title, questionCount, totalTime, passMark, negativeMarking }) => {
//     // ... keep the existing ExamCard component ...
// }


const ExamCards: React.FC<{ questions: Exam[] }> = ({ questions }) => {
    // const [exams, setExams] = useState<Exam[]>([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     const fetchExams = async () => {
    //         try {
    //             const response = await fetch('/api/exams'); // Replace with your actual API endpoint
    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch exams');
    //             }
    //             const data = await response.json();
    //             setExams(data);
    //         } catch (err) {
    //             setError('Failed to load exams. Please try again later.');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchExams();
    // }, []);

    // if (loading) return <div>Loading exams...</div>;
    // if (error) return <div>{error}</div>;

    const examIcons = [Q1, Q2, Q3];
    return (
        <div className="flex flex-wrap gap-6 mt-10">
            {questions.map((exam, index) => (
                <ExamCard
                    key={exam.id}
                    id={exam.id}
                    title={exam.title}
                    questionCount={exam.questionCount}
                    duration={exam.duration}
                    description={exam.description}
                    startTime={exam.startTime}
                    endTime={exam.endTime}
                    status={exam.status}
                    passingScore={exam.passingScore}
                    icon={examIcons[index % examIcons.length]}
                    hasCompleted={exam.hasCompleted}
                />
            ))}
        </div>
    );
}

export default ExamCards;
