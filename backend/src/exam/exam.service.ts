import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { OptionLetter, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateExamDto, CreateSubmissionDto } from "./dtos/createExam.dto";

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  private suffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async createExam(data: CreateExamDto) {
    const { startTime, endTime } = data;
    const examData = {
      questionCount: 0,
      startTime: startTime ?? null, // if startTime is not provided, set it to null
      endTime: endTime ?? null, // if endTime is not provided, set it to null
      ...data,
    };
    const exam = await this.prisma.exam.create({
      data: examData,
    });
    return exam;
  }

  async getAllExams() {
    const exams = await this.prisma.exam.findMany({});
    return exams;
  }

  async getExamById(examId: string) {
    return this.prisma.exam.findUnique({
      where: { id: examId },
    });
  }

  // Start or Resume Exam Session
  async startOrResumeExam(userId: string, examId: string, currentQuestionId?: string) {
    if (!userId || !examId) throw new BadRequestException("Invalid user or exam");

    const examSession = await this.prisma.examSession.findFirst({
      where: {
        userId,
        examId,
      },
      include: {
        questionOrder: {
          orderBy: {
            orderIndex: "asc",
          },
        },
        exam: {
          select: {
            duration: true,
            passingScore: true,
          },
        },
        submission: true,
      },
    });
    if (examSession) {
      return this.updateExamState(examSession);
    }

    const newExamSession = await this.prisma.examSession.create({
      data: {
        userId,
        examId,
        startTime: new Date(),
        questionOrder: {
          create: await this.generateQuestionOrder(examId),
        },
        currentQuestionId: currentQuestionId ?? null,
      },

      include: {
        questionOrder: {
          orderBy: {
            orderIndex: "asc",
          },
        },
        exam: {
          select: {
            duration: true,
            passingScore: true,
          },
        },
        submission: true,
      },
    });

    return this.updateExamState(newExamSession);
  }

  // Update the exam state
  async updateExamState(
    session: Prisma.ExamSessionGetPayload<{
      include: {
        exam: { select: { duration: true; passingScore: true } };
        questionOrder: true;
        submission: true;
      };
    }>
  ) {
    if (!session) throw new NotFoundException("Exam Session Not found");
    console.log(session, "session id update exam state");

    const now = new Date();
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.startTime.getTime() + session.exam.duration * 60 * 1000);

    const isExpired = now > endTime;

    if (isExpired && session.status !== "FINISHED") {
      const final = await this.finalizeExam(session);
      console.log(final, "final result");
    }

    const remainingTimeMs = Math.max(0, endTime.getTime() - now.getTime());
    const remainingSeconds = Math.floor(remainingTimeMs / 1000);

    return {
      id: session.id,
      remainingTime: remainingSeconds,
      status: session.status,
      isExpired,
      startTime,
      duration: session.exam.duration,
      currentQuestionId: session.currentQuestionId,
    };
  }

  async submitQuestionAnswer(data: CreateSubmissionDto) {
    const { examSessionId, questionId, selectedAnswer, isSkipped } = data;
    console.log(`Submitting answer for examSessionId: ${examSessionId}, questionId: ${questionId}`);

    const examSession = await this.prisma.examSession.findFirst({
      where: { id: examSessionId },
      include: {
        exam: {
          select: {
            duration: true,
            questionCount: true,
          },
        },
        currentQuestion: {
          select: {
            correctOptionId: true,
          },
        },
      },
    });

    if (!examSession) {
      throw new NotFoundException("Exam session not found");
    }

    const questionOrder = await this.prisma.questionOrder.findFirst({
      where: { examSessionId, questionId },
      select: { orderIndex: true },
    });

    if (!questionOrder) {
      throw new NotFoundException("Question not found in this exam session");
    }

    let isCorrect: boolean | null = false;
    if (!isSkipped && selectedAnswer !== null) {
      isCorrect = examSession.currentQuestion.correctOptionId === selectedAnswer;
    }

    console.log(
      isCorrect,
      "exam session",
      isSkipped,
      selectedAnswer,
      examSession.currentQuestion.correctOptionId
    );

    const submissionData = {
      orderIndex: questionOrder.orderIndex,
      selectedAnswer: isSkipped ? null : (selectedAnswer as OptionLetter | null),
      isSkipped,
      isCorrect,
      examSession: {
        connect: { id: examSessionId },
      },
      question: {
        connect: { id: questionId },
      },
      exam: {
        connect: { id: examSession.examId },
      },
    };

    const submission = await this.prisma.submission.upsert({
      where: {
        examSessionId_questionId: {
          examSessionId,
          questionId,
        },
      },
      update: submissionData,
      create: submissionData,
    });

    const isLastQuestion = questionOrder.orderIndex === examSession.exam.questionCount;

    if (isLastQuestion) {
      return this.submitOrFinishExam(examSessionId);
    }

    return submission;
  }

  // submit or finish the exam
  async submitOrFinishExam(examSessionId: string) {
    console.log(`Submitting or finishing exam for examSessionId: ${examSessionId}`);
    const examSession = await this.prisma.examSession.findFirst({
      where: { id: examSessionId },
      include: {
        exam: { select: { duration: true, passingScore: true } },
        questionOrder: true,
        submission: true,
      },
    });
    if (!examSession) {
      throw new NotFoundException("Exam session not found");
    }
    return this.finalizeExam(examSession);
  }

  // finalize the exam
  async finalizeExam(
    examSession: Prisma.ExamSessionGetPayload<{
      include: {
        submission: true;
      };
    }>
  ) {
    if (!examSession) {
      throw new NotFoundException("Exam session not found");
    }

    const correctAnswers = examSession.submission.filter((s) => s.isCorrect).length;
    const wrongAnswers = examSession.submission.filter(
      (s) => s.selectedAnswer && !s.isCorrect
    ).length;

    const skippedCount = examSession.submission.filter((s) => s.isSkipped).length;

    const result = await this.prisma.$transaction(async (prisma) => {
      const createdResult = await prisma.result.create({
        data: {
          userId: examSession.userId,
          examId: examSession.examId,
          totalScore: correctAnswers,
          correctCount: correctAnswers,
          wrongCount: wrongAnswers,
          skippedCount,
          position: 0,
        },
      });

      const timeSpent = examSession.endTime
        ? examSession.endTime.getTime() - examSession.startTime.getTime()
        : null;

      await prisma.examSession.update({
        where: { id: examSession.id },
        data: {
          status: "FINISHED",
          endTime: new Date(),
          isFinished: true,
          totalTimeSpent: timeSpent,
        },
        include: {
          exam: {
            select: {
              duration: true,
            },
          },
        },
      });
      const position = await this.calculatePosition(
        prisma,
        examSession.examId,
        createdResult.totalScore
      );

      await prisma.leaderboard.create({
        data: {
          userId: examSession.userId,
          examId: examSession.examId,
          resultId: createdResult.id,
          position,
          timeSpent,
        },
      });

      return createdResult;
    });

    const detailedResults = await this.getDetailedResults(examSession.id);

    return {
      ...result,
      detailedResults,
    };
  }

  // Get exam results by user id and exam id
  async getExamResultByExamId(userId: string, examId: string) {
    const results = await this.prisma.result.findFirst({
      where: {
        userId,
        examId,
      },
      include: {
        exam: {
          include: {
            examSession: {
              select: {
                id: true,
                startTime: true,
                endTime: true,
                totalTimeSpent: true,
              },
            },
          },
        },
        leaderboard: {
          select: {
            position: true,
            timeSpent: true,
          },
        },
      },
      orderBy: {
        totalScore: "desc",
      },
    });

    const resultDetails = await this.getDetailedResults(results.exam.examSession[0].id);

    return {
      ...results,
      detailedResults: resultDetails,
    };
  }

  // Function to get detailed results (can be called separately when needed)
  async getDetailedResults(examSessionId: string) {
    const examSession = await this.prisma.examSession.findUnique({
      where: { id: examSessionId },
      include: {
        submission: {
          select: {
            question: {
              include: {
                questionOption: true,
              },
            },
            selectedAnswer: true,
            isCorrect: true,
            isSkipped: true,
          },
        },
      },
    });

    if (!examSession) {
      throw new NotFoundException("Exam session not found");
    }

    return examSession.submission.map((s) => ({
      question: s.question.questionText,
      selectedAnswer: s.selectedAnswer,
      correctAnswer: s.question.questionOption.find((o) => o.optionLetter === s.selectedAnswer)
        ?.optionText,
      isCorrect: s.isCorrect,
      isSkipped: s.isSkipped,
    }));
  }
  // get exam leaderboard
  getExamLeaderboard = async (examId: string, limit: number = 10) => {
    const leaderboard = await this.prisma.leaderboard.findMany({
      where: { examId },
      orderBy: {
        position: "asc",
        timeSpent: "asc",
      },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        result: {
          select: {
            totalScore: true,
            correctCount: true,
            wrongCount: true,
            skippedCount: true,
          },
        },
      },
    });

    return leaderboard;
  };

  // calculate the position of the user

  calculatePosition = async (
    prisma: Prisma.TransactionClient,
    examId: string,
    totalScore: number
  ) => {
    const highScores = await prisma.result.count({
      where: {
        examId,
        totalScore: {
          gt: totalScore,
        },
      },
    });

    return highScores + 1;
  };

  //  Generate question order
  async generateQuestionOrder(examId: string) {
    const questions = await this.prisma.question.findMany({
      where: { examId },
      select: {
        id: true,
      },
    });

    return questions
      .sort(() => Math.random() - 0.5)
      .map((q, index) => ({ questionId: q.id, orderIndex: index + 1 }));
  }
}
