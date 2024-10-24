import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getResultLeaderboard } from "@/services/result"
import { Medal } from "lucide-react"

// Define the type for our leaderboard entry
type LeaderboardEntry = {
    position: number
    userId: string
    username: string
    totalScore: number
    totalTimeSpent: number | null
    correctCount: number
    wrongCount: number
    skippedCount: number
    questionCount: number
}



const getRankColor = (rank: number) => {
    switch (rank) {
        case 1: return "text-yellow-500"
        case 2: return "text-gray-400"
        case 3: return "text-amber-600"
        default: return "text-slate-700"
    }
}

const formatTime = (seconds: number | null): string => {
    if (seconds === null) return "N/A"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const calculateScorePercentage = (correct: number, total: number): number => {
    return Math.round((correct / total) * 100)
}

export default async function ExamLeaderboard({ params }: { params: { examId: string } }) {
    console.log("params from leaderboard", params);

    const { examId } = params;
    const leaderboardResponse = await getResultLeaderboard({ examId, limit: 10 });
    console.log(leaderboardResponse, "leaderboardResponse here is o");
    const leaderboardData = leaderboardResponse.data;


    return (
        <div className="container mx-auto p-4 overflow-x-auto">
            <h1 className="text-3xl font-bold text-center mb-6">Exam Leaderboard</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[60px] sm:w-[100px]">Rank</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Score</TableHead>
                        <TableHead className="text-right hidden md:table-cell">Time Taken</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leaderboardData.map((entry: LeaderboardEntry) => {
                        const scorePercentage = calculateScorePercentage(entry.correctCount, entry.questionCount)
                        return (
                            <TableRow key={entry.userId} className="hover:bg-gray-100 transition-colors">
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-lg sm:text-2xl font-bold ${getRankColor(entry.position)}`}>{entry.position}</span>
                                        {entry.position <= 3 && <Medal className={`h-4 w-4 sm:h-6 sm:w-6 ${getRankColor(entry.position)}`} />}
                                    </div>
                                </TableCell>
                                <TableCell>{entry.username}</TableCell>
                                <TableCell className="text-right sm:hidden">
                                    <span className="font-semibold">{scorePercentage}%</span>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <div className="flex items-center">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${scorePercentage}%` }}></div>
                                        </div>
                                        <span>{scorePercentage}%</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right hidden md:table-cell">{formatTime(entry.totalTimeSpent)}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
