/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Button } from '@/components/ui/button';
import { useExam, useExamNavigation } from '@/context/ExamProvider';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { GetCurrentQuestion, SubmitAnswer } from './exam-action';

interface ExamContentProps {
    examSessionId: string;
    examId: string;
    userId: string;
}

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



    if (!currentQuestion) {
        return <div>Loading question...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Question {currentIndex} of {totalQuestions}</h2>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="loader">Loading...</div>
                </div>
            )}
            <div className={`relative ${isLoading ? 'blur-sm' : ""}`} >

                <p className="mb-4">{currentQuestion.questionText}</p>
                <div className="space-y-2">
                    {currentQuestion.questionOption.map((option) => (
                        <button
                            key={option.id}
                            className={`w-full text-left p-2 rounded ${selectedOption === option.optionLetter ? 'bg-primary text-white' : 'bg-gray-100'}`}
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
                                onClick={handleNext}
                                disabled={selectedOption === null}
                            >
                                Submit
                            </button>

                        </div>
                    ) : (
                        <div className='flex gap-2'>
                            <Button
                                className="px-4 py-2 bg-yellow-500 text-white rounded"
                                onClick={handleSkip}
                            >
                                Skip
                            </Button>
                            <Button
                                className="px-4 py-2  text-white rounded disabled:opacity-50"
                                onClick={handleNext}
                                disabled={selectedOption === null}
                            >
                                Next
                            </Button>

                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ExamContent;
