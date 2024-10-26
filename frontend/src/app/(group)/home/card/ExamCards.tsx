'use client'
import Q1 from "@/assets/exam-1.jpg";
import Q2 from "@/assets/exam-2.jpg";
import Q3 from "@/assets/exam-3.jpg";
import { Exam } from '@/interface/constants';
import React from 'react';
import ExamCard from './ExamCard';


const ExamCards: React.FC<{ questions: Exam[], userId: string }> = ({ questions, userId }) => {


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
                    userId={userId}
                />
            ))}
        </div>
    );
}

export default ExamCards;
