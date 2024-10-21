"use client"
import { useExam } from '@/context/ExamProvider';
import { GetCurrentQuestion, SubmitAnswer } from '@/services/questions';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface ExamContentProps {
    examSessionId: string;
}

const ExamContent: React.FC<ExamContentProps> = ({ examSessionId }) => {
    const {
        currentQuestion,
        setCurrentQuestion,
        currentIndex,
        setCurrentIndex,
        isLast,
        setIsLast,
        totalQuestions,
        setTotalQuestions,
        setSubmission
    } = useExam();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleOptionSelect = (optionLetter: string) => {
        setSelectedOption(optionLetter);
    };

    const updateExamState = (data: any) => {
        setCurrentQuestion(data.question);
        setCurrentIndex(data.currentIndex);
        setIsLast(data.isLast);
        setTotalQuestions(data.totalQuestions);
        setSubmission(data.submission || null);
        setSelectedOption(null);
    };

    const handleNavigation = async (direction: 'next' | 'previous' | 'skip') => {
        try {
            if (direction === 'previous') {

                const submitRespose = await GetCurrentQuestion(examSessionId, 'previous')
                updateExamState(submitRespose.data);
            } else if (direction === 'next' || direction === 'skip') {

                const submitRespose = await SubmitAnswer({ examSessionId, questionId: currentQuestion.id, selectedAnswer: selectedOption, isSkipped: direction === 'skip' });
                if (submitRespose.status === 201) {
                    const response = await GetCurrentQuestion(examSessionId, direction === 'skip' ? 'next' : direction);
                    updateExamState(response.data);
                }
            }
        } catch (err) {
            toast.error(`Error fetching ${direction} question`);
        }
    };

    const handleNext = () => handleNavigation('next');
    const handleSkip = () => handleNavigation('skip');

    const handleSubmit = async () => {
        console.log("handleSubmit");
        // Implement submit logic here
        const submitRespose = await SubmitAnswer({ examSessionId, questionId: currentQuestion.id, selectedAnswer: selectedOption });
        // if (submitRespose.status === 201) {
        //     const response = await FinishExam(examSessionId);
        //     console.log(response, "response");
        // }
    };

    const handlePrevious = () => handleNavigation('previous');

    if (!currentQuestion) {
        return <div>Loading question...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Question {currentIndex} of {totalQuestions}</h2>
            <p className="mb-4">{currentQuestion.questionText}</p>
            <div className="space-y-2">
                {currentQuestion.questionOption.map((option) => (
                    <button
                        key={option.id}
                        className={`w-full text-left p-2 rounded ${selectedOption === option.optionLetter ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                        onClick={() => handleOptionSelect(option.optionLetter)}
                    >
                        {option.optionLetter}. {option.optionText}
                    </button>
                ))}
            </div>
            <div className="mt-6 flex justify-between">
                <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={handlePrevious}
                    disabled={currentIndex === 1}
                >
                    Previous
                </button>
                {isLast ? (
                    <div className='flex gap-2'>
                        <button
                            className="px-4 py-2 bg-yellow-500 text-white rounded"
                            onClick={handleSkip}
                        >
                            Skip
                        </button>
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>

                    </div>
                ) : (
                    <div className='flex gap-2'>
                        <button
                            className="px-4 py-2 bg-yellow-500 text-white rounded"
                            onClick={handleSkip}
                        >
                            Skip
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                            onClick={handleNext}
                            disabled={selectedOption === null}
                        >
                            Next
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamContent;
