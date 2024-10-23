/* eslint-disable @typescript-eslint/no-explicit-any */
interface QuestionOption {
  id: string;
  optionText: string;
  optionLetter: string;
  questionId: string;
}

export interface Question {
  id: string;
  examId: string;
  questionText: string;
  correctOptionId: string;
  type: string;
  questionOption: QuestionOption[];
}

export interface ExamContextType {
  currentQuestion: Question;
  setCurrentQuestion: (question: Question) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  isLast: boolean;
  setIsLast: (isLast: boolean) => void;
  totalQuestions: number;
  setTotalQuestions: (total: number) => void;
  submission: any | null; // Replace 'any' with a more specific type if possible
  setSubmission?: (submission: any | null) => void;
}


export interface ExamProviderProps {
  children: ReactNode;
  initialExamState: {
    question: Question;
    currentIndex: number;
    isLast: boolean;
    totalQuestions: number;
    submission: any | null;
  };
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  duration: number;
  startTime: string;
  endTime: string;
  status: string;
  passingScore: number;
  hasCompleted?: boolean;
  icon?: any;
}