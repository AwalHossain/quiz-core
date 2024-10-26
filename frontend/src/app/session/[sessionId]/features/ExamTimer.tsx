"use client";

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../../../components/ui/button';
import { Progress } from '../../../../components/ui/progress';
interface ExamTimerProps {
    initialTime: number;
    userId: string;
    sessionId: string;
    duration: number;
    examSessionId: string;
}

const ExamTimer = ({ initialTime, userId, sessionId, duration, examSessionId }: ExamTimerProps) => {
    const [progress, setProgress] = useState(100);
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const totalTime = duration * 60; // convert duration to seconds
    const interval = 1000; // 1 second
    const router = useRouter();
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [isFinishing, setIsFinishing] = useState(false);

    const updateTimer = useCallback(() => {
        setTimeLeft((prev) => {
            if (prev <= 0) {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
                finishExam();
                return 0;
            }
            const newProgress = ((prev - 1) / totalTime) * 100;
            setProgress(newProgress);
            return prev - 1;
        });
    }, [totalTime]);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const finishExam = useCallback(async () => {
        setIsFinishing(true);

        const finishExamPromise = async () => {
            const token = Cookies.get('access_token');
            if (!token) {
                throw new Error('No access token found');
            }

            const response = await fetch(`${BASE_URL}/exam/finish/${examSessionId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to finalize exam');
            }

            return response;
        };

        toast.promise(finishExamPromise, {
            loading: 'Finishing exam...',
            success: (data) => {
                router.push(`/result/${userId}/${sessionId}`);
                return 'Exam finished successfully';
            },
            error: (err) => {
                console.error('Error finalizing exam:', err);
                return 'Failed to finish exam. Please try again.';
            },
            finally: () => {
                setIsFinishing(false);
            },
        });
    }, [examSessionId, userId, sessionId, router]);

    useEffect(() => {
        timerRef.current = setInterval(updateTimer, interval);
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [updateTimer, interval]);

    useEffect(() => {
        setTimeLeft(initialTime);
        setProgress(100);
    }, [initialTime]);

    const formattedTime = useMemo(() => {
        return (seconds: number): string => {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes} min ${remainingSeconds} sec`;
        }
    }, []);

    return (
        <div>
            <div className="w-full max-w-md mx-auto space-y-4">
                <Progress value={progress} className="w-full bg-gray-300" />
                <p className="text-center">
                    Time Remaining: {formattedTime(timeLeft)}
                </p>
                <Button onClick={finishExam} className="w-full" disabled={isFinishing}>
                    Finish Exam
                </Button>
            </div>
        </div>
    );
}

export default ExamTimer;
