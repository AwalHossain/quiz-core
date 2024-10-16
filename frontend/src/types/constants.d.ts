/* eslint-disable @typescript-eslint/no-explicit-any */


interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  startTime: Date | null;
  endTime: Date | null;
  status: string;
  passingScore: number | null;
  questionCount: number;
  icon: any;
}
