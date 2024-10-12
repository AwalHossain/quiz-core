/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';


interface StatProps {
    icon: string;
    label: string;
    value: string;
}

const Stat: React.FC<StatProps> = ({ icon, label, value }) => (
    <div className="text-center">
        <div className="text-sm mb-1">{icon}</div>
        <div className="text-xs text-gray-600">{label}</div>
        <div className="text-xs">{value}</div>
    </div>
)

interface ExamCardProps {
    title: string;
    questionCount: number;
    totalTime: string;
    passMark: string;
    negativeMarking: string;
    icon: any;
    id: string;
}

const ExamCard: React.FC<ExamCardProps> = ({ id, title, icon, questionCount, totalTime, passMark, negativeMarking }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 min-w-[300px] max-w-sm mx-auto">
            {/* exam icon */}
            <div className="flex justify-center items-center mb-4">
                <Image src={icon} alt="exam" width={50} height={50} />
            </div>
            <h2 className="text-xl font-bold text-center mb-2">{title}</h2>
            {/* <hr className="border-t border-gray-200 mb-4" /> */}
            <div className="flex flex-wrap gap-2">

                <Stat icon="❓" label="প্রশ্নের সংখ্যা" value={`${questionCount}টি`} />
                <Stat icon="🕒" label="মোট সময়" value={totalTime} />
                <Stat icon="🏆" label="পাশ মার্ক" value={passMark} />
                <Stat icon="⚠️" label="নেগেটিভ মার্কিং" value={negativeMarking} />
            </div>
            <Link href={`/exam/${id}`} >
                <Button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white">
                    কুইজ শুরু করুন
                </Button>
            </Link>
        </div>
    )
}

export default ExamCard
