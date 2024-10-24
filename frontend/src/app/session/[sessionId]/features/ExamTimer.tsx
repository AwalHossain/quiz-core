/* eslint-disable no-console */
"use client"
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Progress } from '../../../../components/ui/progress';


interface ExamTimerProps {
    initialTime: number;
    examId: number;
    duration: number;
}

const ExamTimer = ({ initialTime, examId, duration }: ExamTimerProps) => {
    console.log(initialTime, examId, "initialTime");
    const [progress, setProgress] = useState(100);
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const totalTime = duration * 60; // convert duration to seconds
    const interval = 1000; // 1 second  
    const router = useRouter();

    const updateTimer = useCallback(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                router.push(`/result/${examId}`);
                return 0;
            }
            const newProgress = ((prev) / totalTime) * 100;
            setProgress(newProgress);
            return prev - 1;
        })
    }, [examId, router, totalTime])
    useEffect(() => {
        let lastUpdate = Date.now();
        let animationFrame: number;
        const animate = () => {
            const now = Date.now();
            if (now - lastUpdate >= interval) {
                updateTimer();
                lastUpdate = now;
            }
            animationFrame = requestAnimationFrame(animate);
        }

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [updateTimer])

    useEffect(() => {
        setTimeLeft(initialTime);
        setProgress((initialTime / totalTime) * 100);
    }, [initialTime, totalTime])

    const formattedTime = useMemo(() => {
        return (seconds: number): string => {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes} min ${remainingSeconds} sec`;
        }
    }, [])

    return (
        <div>
            <div className="w-full max-w-md mx-auto space-y-4">
                <Progress value={progress} className="w-full bg-gray-300" />
                <p className="text-center">
                    Time Remaining: {formattedTime(timeLeft)}
                    {/* Remaining: {Math.ceil(progress / 10)} seconds */}
                </p>
            </div>
        </div>
    )
}

export default ExamTimer
