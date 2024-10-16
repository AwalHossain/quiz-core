"use client"

import React, { useState } from 'react';

interface Question {
    id: number;
    text: string;
    options: string[];
}

const questions: Question[] = [
    {
        id: 1,
        text: "How many possible pairs of elements are there in an array of size n?",
        options: ["log n", "n", "n^2", "2^n"],
    },
    {
        id: 2,
        text: "What is the time complexity of inserting an element into a binary search tree?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    }
];

const MCQQuiz: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [answers, setAnswers] = useState<(number | null)[]>([]);

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleOptionSelect = (index: number) => {
        setSelectedOption(index);
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = index;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
    };

    const handleSkip = () => {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
    };

    const handleSubmit = () => {
        // Implement submission logic here
        console.log('Quiz submitted:', answers);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Question {currentQuestionIndex + 1}</h2>
            <p className="mb-4">{currentQuestion.text}</p>
            <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        className={`w-full text-left p-2 rounded ${selectedOption === index ? 'bg-blue-500 text-white' : 'bg-gray-100'
                            }`}
                        onClick={() => handleOptionSelect(index)}
                    >
                        {option}
                    </button>
                ))}
            </div>
            <div className="mt-6 flex justify-between">
                <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={handleSkip}
                >
                    Skip
                </button>
                {isLastQuestion ? (
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={selectedOption === null}
                    >
                        Submit
                    </button>
                ) : (
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                        onClick={handleNext}
                        disabled={selectedOption === null}
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default MCQQuiz;
