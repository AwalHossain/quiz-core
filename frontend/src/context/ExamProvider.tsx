/* eslint-disable @typescript-eslint/no-explicit-any */
// ExamProvider.tsx
"use client"
import { createContext, useContext, useState } from "react";

interface Question {
    questionOption: Array<{ id: string; optionLetter: string; optionText: string }>;
    questionText: string;
    id: string;
    examId: string;
    correctOptionId: string;
    type: string;
}

interface ExamContextType {
    currentQuestion: Question;
    setCurrentQuestion: (question: Question) => void;
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
    isLast: boolean;
    setIsLast: (isLast: boolean) => void;
    totalQuestions: number;
    setTotalQuestions: (total: number) => void;
    submission: any | null;
    setSubmission: (submission: any) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

interface ExamProviderProps {
    children: React.ReactNode;
    initialExamState: {
        question: Question;
        currentIndex: number;
        isLast: boolean;
        totalQuestions: number;
        submission: any | null;
    };
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<ExamProviderProps> = ({ children, initialExamState }) => {
    const [currentQuestion, setCurrentQuestion] = useState<Question>(initialExamState.question);
    const [currentIndex, setCurrentIndex] = useState<number>(initialExamState.currentIndex);
    const [isLast, setIsLast] = useState<boolean>(initialExamState.isLast);
    const [totalQuestions, setTotalQuestions] = useState<number>(initialExamState.totalQuestions);
    const [submission, setSubmission] = useState<any | null>(initialExamState.submission);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const value: ExamContextType = {
        currentQuestion,
        setCurrentQuestion,
        currentIndex,
        setCurrentIndex,
        isLast,
        setIsLast,
        totalQuestions,
        setTotalQuestions,
        submission,
        setSubmission,
        isLoading,
        setIsLoading,
    };

    return (
        <ExamContext.Provider value={value}>
            {children}
        </ExamContext.Provider>
    );
};

export const useExam = () => {
    const context = useContext(ExamContext);
    if (context === undefined) {
        throw new Error("useExam must be used within an ExamProvider");
    }
    return context;
};


export const useExamNavigation = () => {
    const { isLoading, setIsLoading, setCurrentIndex, setIsLast, setTotalQuestions,
        setSubmission, setCurrentQuestion
    } = useExam()

    const handleNavigation = async (apiCall: () => Promise<any>,
        onSuccess: (data: any) => void,
        onError: (error: any) => void
    ) => {
        setIsLoading(true)
        try {
            const response = await apiCall();
            // Check if the response is the exam completion object
            if (response && response.isExamComplete !== undefined) {
                onSuccess(response);
            } else if (response && response.data) {
                // Regular navigation response
                onSuccess(response.data);
            } else {
                // Unexpected response format
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            onError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const updateExamState = (data: any) => {
        setCurrentQuestion(data.question)
        setCurrentIndex(data.currentIndex)
        setIsLast(data.isLast)
        setTotalQuestions(data.totalQuestions)
        setSubmission(data.submission || null)
    }

    return { handleNavigation, updateExamState, isLoading }
}
