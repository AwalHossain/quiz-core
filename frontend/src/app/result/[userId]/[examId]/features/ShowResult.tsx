"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, MinusCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts"

interface ExamResult {
    id: string
    userId: string
    examId: string
    totalScore: number
    correctCount: number
    wrongCount: number
    skippedCount: number
    position: number
    totalTimeSpent: number | null
    exam: {
        id: string
        title: string
        description: string
        duration: number
        startTime: string | null
        endTime: string | null
        questionCount: number
        status: string
        passingScore: number
        examSession: Array<{
            id: string
            startTime: string
            endTime: string
            totalTimeSpent: number
        }>
    }
    detailedResults: Array<{
        orderIndex: number
        question: string
        selectedAnswer: string | null
        selectedOptionLetter: string | null
        correctAnswer: string
        correctOptionLetter: string
        isCorrect: boolean
        isSkipped: boolean
        options: Array<{
            letter: string
            text: string
        }>
    }>
    overallTotalCorrect: number
    overallTotalWrong: number
    overallTotalSkipped: number
}

export default function ShowResult({ result }: { result: ExamResult }) {

    const totalQuestions = result.exam.questionCount
    const scorePercentage = (result.overallTotalCorrect / totalQuestions) * 100

    const chartData = [
        { name: 'Correct', value: result.overallTotalCorrect, color: 'hsl(var(--chart-1))' },
        { name: 'Incorrect', value: result.overallTotalWrong, color: 'hsl(var(--chart-2))' },
        { name: 'Skipped', value: result.overallTotalSkipped, color: 'hsl(var(--chart-3))' },
    ]

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>{result.exam.title}</CardTitle>
                    <CardDescription>{result.exam.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Total Score</p>
                                    <p className="text-2xl font-bold">{scorePercentage.toFixed(2)}%</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Correct Answers</p>
                                    <p className="text-2xl font-bold text-green-600">{result.overallTotalCorrect}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Wrong Answers</p>
                                    <p className="text-2xl font-bold text-red-600">{result.overallTotalWrong}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Skipped Questions</p>
                                    <p className="text-2xl font-bold text-yellow-600">{result.overallTotalSkipped}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Time Spent</p>
                                    <p className="text-2xl font-bold">{formatTime(result.exam.examSession[0].totalTimeSpent)} <small>minutes</small></p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Position</p>
                                    <p className="text-sm font-medium text-blue-600">
                                        <Link href={`/exam/${result.exam.id}/leaderboard`}>
                                            See Leaderboard
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <ChartContainer config={{
                            correct: { label: "Correct", color: "hsl(var(--chart-1))" },
                            incorrect: { label: "Incorrect", color: "hsl(var(--chart-2))" },
                            skipped: { label: "Skipped", color: "hsl(var(--chart-3))" },
                        }} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Question</TableHead>
                                <TableHead>Your Answer</TableHead>
                                <TableHead>Correct Answer</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.detailedResults.map((detail, index) => (
                                <TableRow key={index}>
                                    <TableCell>{detail.question}</TableCell>
                                    <TableCell>{detail.selectedAnswer || '-'}</TableCell>
                                    <TableCell>{detail.correctAnswer}</TableCell>
                                    <TableCell>
                                        {detail.isSkipped ? (
                                            <Badge variant="outline" className="bg-yellow-100">
                                                <MinusCircle className="mr-1 h-4 w-4" />
                                                Skipped
                                            </Badge>
                                        ) : detail.isCorrect ? (
                                            <Badge variant="outline" className="bg-green-100">
                                                <CheckCircle className="mr-1 h-4 w-4" />
                                                Correct
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-red-100">
                                                <XCircle className="mr-1 h-4 w-4" />
                                                Incorrect
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
