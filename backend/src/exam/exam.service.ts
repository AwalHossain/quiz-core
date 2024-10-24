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

  async getAllExams(userId?: string) {
    const exams = await this.prisma.exam.findMany({
      where: {
        status: "DRAFT",
      },
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        passingScore: true,
        questionCount: true,
        status: true,
        ...(userId && {
          result: {
            where: {
              userId,
            },
            select: {
              id: true,
            },
          },
        }),
      },
    });
    return exams.map((exam) => ({
      ...exam,
      hasCompleted: userId ? exam.result.length > 0 : undefined,
    }));
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

    const now = new Date();
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.startTime.getTime() + session.exam.duration * 60 * 1000);

    const isExpired = now > endTime;

    if (isExpired && session.status !== "FINISHED") {
      await this.finalizeExam(session);
    }
    // if it's times not expired but user has finished the exam then just show the result and don't allow to submit
    if (session.status === "FINISHED") {
      return {
        id: session.id,
        remainingTime: 0,
        status: session.status,
        isExpired: true,
        startTime: session.startTime,
        endTime: new Date().getTime(),
      };
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
        questionOrder: {
          where: {
            questionId,
          },
          select: {
            orderIndex: true,
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
    if (!examSession.questionOrder[0]) {
      throw new NotFoundException("Question not found in this exam session");
    }

    let isCorrect: boolean | null = false;
    if (!isSkipped && selectedAnswer !== null) {
      isCorrect = examSession.currentQuestion.correctOptionId === selectedAnswer;
    }

    const submissionData = {
      orderIndex: examSession.questionOrder[0].orderIndex,
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

    const isLastQuestion =
      examSession.questionOrder[0].orderIndex === examSession.exam.questionCount;

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
        exam: { select: { duration: true } };
      };
    }>
  ) {
    if (!examSession) {
      throw new NotFoundException("Exam session not found");
    }

    const totalCorrectAnswer = examSession.submission.filter((s) => s.isCorrect).length;
    const wrongAnswers = examSession.submission.filter(
      (s) => s.selectedAnswer && !s.isCorrect
    ).length;

    const skippedCount = examSession.submission.filter((s) => s.isSkipped).length;

    const result = await this.prisma.$transaction(async (prisma) => {
      const startTime = new Date(examSession.startTime);
      const endTime = new Date().getTime();
      const totalTimeSpent = Math.floor((endTime - startTime.getTime()) / 1000);

      const createdResult = await prisma.result.create({
        data: {
          userId: examSession.userId,
          examId: examSession.examId,
          totalScore: totalCorrectAnswer,
          correctCount: totalCorrectAnswer,
          wrongCount: wrongAnswers,
          skippedCount,
          totalTimeSpent,
        },
      });

      await prisma.examSession.update({
        where: { id: examSession.id },
        data: {
          status: "FINISHED",
          endTime: new Date(),
          isFinished: true,
          totalTimeSpent,
        },
        include: {
          exam: {
            select: {
              duration: true,
            },
          },
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
              where: {
                userId,
              },
              select: {
                id: true,
                startTime: true,
                endTime: true,
                totalTimeSpent: true,
              },
            },
          },
        },
      },
      orderBy: {
        totalScore: "desc",
      },
    });

    console.log(results, "results first coming");

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
          include: {
            question: {
              include: {
                questionOption: true,
              },
            },
          },
        },
        questionOrder: {
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
    });

    console.log(examSession, "exam session");

    if (!examSession) {
      throw new NotFoundException("Exam session not found");
    }

    return examSession.submission.map((s) => {
      const selectedOption = s.question.questionOption.find(
        (opt) => opt.optionLetter === s.selectedAnswer
      );
      const correctOption = s.question.questionOption.find(
        (opt) => opt.optionLetter === s.question.correctOptionId
      );

      return {
        orderIndex: s.orderIndex,
        question: s.question.questionText,
        selectedAnswer: selectedOption?.optionText ?? null,
        selectedOptionLetter: s.selectedAnswer,
        correctAnswer: correctOption?.optionText ?? null,
        correctOptionLetter: s.question.correctOptionId,
        isCorrect: s.isCorrect,
        isSkipped: s.isSkipped,
        options: s.question.questionOption.map((opt) => ({
          letter: opt.optionLetter,
          text: opt.optionText,
        })),
      };
    });
  }
  // get exam leaderboard
  getExamLeaderboard = async (examId: string, limit: number = 10) => {
    const leaderboard = await this.prisma.result.findMany({
      where: { examId },
      orderBy: [
        {
          totalScore: "desc",
        },
        {
          totalTimeSpent: "asc",
        },
      ],
      take: Number(limit),
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        exam: {
          select: {
            questionCount: true,
          },
        },
      },
    });

    return leaderboard.map((entry, index) => ({
      position: index + 1,
      userId: entry.userId,
      username: entry.user.username,
      totalScore: entry.totalScore,
      totalTimeSpent: entry.totalTimeSpent,
      correctCount: entry.correctCount,
      wrongCount: entry.wrongCount,
      skippedCount: entry.skippedCount,
      questionCount: entry.exam.questionCount,
    }));
  };

  // calculate the position of the user

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
