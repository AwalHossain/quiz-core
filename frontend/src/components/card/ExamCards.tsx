'use client'
import React from 'react';
import Q1 from '../../assets/Q1.png';
import Q2 from '../../assets/Q2.png';
import Q3 from '../../assets/Q3.png';
import ExamCard from './ExamCard';
// // ... keep the existing Stat component and interfaces ...

// const ExamCard: React.FC<ExamCardProps> = ({ title, questionCount, totalTime, passMark, negativeMarking }) => {
//     // ... keep the existing ExamCard component ...
// }

// Mock data
const mockExams = [
    {
        id: '1',
        title: 'Mathematics Exam',
        questionCount: 30,
        totalTime: '60 মিনিট',
        passMark: '60%',
        negativeMarking: 'নাই'
    },
    {
        id: '2',
        title: 'Physics Quiz',
        questionCount: 25,
        totalTime: '45 মিনিট',
        passMark: '50%',
        negativeMarking: '0.25'
    },
    {
        id: '3',
        title: 'English Language Test',
        questionCount: 40,
        totalTime: '90 মিনিট',
        passMark: '70%',
        negativeMarking: 'নাই'
    },
    {
        id: '4',
        title: 'History Trivia',
        questionCount: 20,
        totalTime: '30 মিনিট',
        passMark: '55%',
        negativeMarking: 'নাই'
    }
];

interface Exam {
    id: string;
    title: string;
    questionCount: number;
    totalTime: string;
    passMark: string;
    negativeMarking: string;
}

const ExamCards: React.FC = () => {
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
            {mockExams.map((exam, index) => (
                <ExamCard
                    key={exam.id}
                    id={exam.id}
                    title={exam.title}
                    questionCount={exam.questionCount}
                    totalTime={exam.totalTime}
                    passMark={exam.passMark}
                    negativeMarking={exam.negativeMarking}
                    icon={examIcons[index % examIcons.length]}
                />
            ))}
        </div>
    );
}

export default ExamCards;
