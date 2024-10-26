/* eslint-disable no-console */
"use client"
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Progress } from '../../../../components/ui/progress';


interface ExamTimerProps {
    initialTime: number;
    sessionId: string;
    duration: number;
    userId: string;
}

const ExamTimer = ({ initialTime, userId, sessionId, duration, }: ExamTimerProps) => {
    const [progress, setProgress] = useState(100);
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const totalTime = duration * 60; // convert duration to seconds
    const interval = 1000; // 1 second  
    console.log(userId, "data from here");

    const updateTimer = useCallback(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                // router.push(`/result/${userId}/${sessionId}`);
                window.location.reload();
                // window.location.href = `/result/${userId}/${sessionId}`;
                return 0;
            }
            const newProgress = ((prev) / totalTime) * 100;
            setProgress(newProgress);
            return prev - 1;
        })
    }, [sessionId, totalTime])
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
