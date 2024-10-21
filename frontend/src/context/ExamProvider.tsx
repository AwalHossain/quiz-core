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
