/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Exam } from '@/interface/constants';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from '../../../../components/ui/button';


interface StatProps {
    icon: string;
    label: string;
    value: string | number | null;
}

const Stat: React.FC<StatProps> = ({ icon, label, value }) => (
    <div className="text-center">
        {/* <div className="text-sm mb-1">{icon}</div> */}
        <div className="text-xs text-gray-600">{label}</div>
        <div className="text-xs">{value}</div>
    </div>
)



const ExamCard: React.FC<Exam & { userId: string }> = ({ id, title, icon, questionCount, duration, description, startTime, endTime, status, passingScore, hasCompleted, userId }) => {

    return (
        <div className="bg-white rounded-lg shadow-md p-6 min-w-[300px] max-w-sm mx-auto my-10">
            {/* exam icon */}
            <div className="flex justify-center items-center mb-4 w-full h-40 relative">
                <Image src={icon} alt="exam" layout="fill" objectFit="contain" />
            </div>
            <h2 className="text-xl font-bold text-center mb-2">{title}</h2>
            {/* <hr className="border-t border-gray-200 mb-4" /> */}
            <div className="flex justify-center flex-wrap gap-4">

                <Stat icon="❓" label="প্রশ্নের সংখ্যা" value={`${questionCount}টি`} />
                <Stat icon="🕒" label="মোট সময়" value={`${duration} মিনিট`} />
                <Stat icon="🏆" label="পাশ মার্ক" value={`${passingScore}%`} />
                {/* <Stat icon="⚠️" label="নেগেটিভ মার্কিং" value={negativeMarking} /> */}
            </div>
            {hasCompleted ? (
                <Link href={`/result/${userId}/${id}`} >
                    <Button className="w-full mt-4 bg-pink-400  hover:bg-pink-600 text-white">
                        রেজাল্ট দেখুন
                    </Button>
                </Link>
            ) : (
                <Link href={`/session/${id}`} >
                    <Button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white">
                        কুইজ শুরু করুন ,
                    </Button>
                </Link>
            )}
        </div>
    )
}

export default ExamCard
