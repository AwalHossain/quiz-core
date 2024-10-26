'use client'
import Q1 from "@/assets/Q1.png";
import Q2 from "@/assets/Q2.png";
import Q3 from "@/assets/Q3.png";
import { Exam } from '@/interface/constants';
import React from 'react';
import ExamCard from './ExamCard';


const ExamCards: React.FC<{ questions: Exam[], userId: string }> = ({ questions, userId }) => {

    const examIcons = [Q1, Q2, Q3];
    return (
        <div className="flex flex-wrap gap-6 my-20">
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
