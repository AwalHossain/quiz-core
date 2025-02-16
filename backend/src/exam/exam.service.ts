import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { OptionLetter, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateExamDto, CreateSubmissionDto } from "./dtos/createExam.dto";
import { PrismaTransactionalClient } from "../config/types";

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
  async startOrResumeExam(examId: string, userId: string, currentQuestionId?: string) {
    if (!userId || !examId) throw new BadRequestException("Invalid user or exam");

    return this.prisma.$transaction(
      async (tx) => {
        const examSession = await tx.examSession.findFirst({
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
          return this.updateExamState(tx, examSession);
        }

        const questionOrder = await this.generateQuestionOrder(tx, examId);

        // 3. Create session with minimal data first
        const newExamSession = await tx.examSession.create({
          data: {
            userId,
            examId,
            startTime: new Date(),
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

        // 4. Batch insert question order and submissions
        await Promise.all([
          tx.questionOrder.createMany({
            data: questionOrder.map((qo) => ({
              ...qo,
              examSessionId: newExamSession.id,
            })),
          }),
          tx.submission.createMany({
            data: questionOrder.map(({ questionId, orderIndex }) => ({
              questionId,
              orderIndex,
              examId,
              examSessionId: newExamSession.id,
              selectedAnswer: null,
              isSkipped: false,
            })),
          }),
        ]);

        return this.updateExamState(tx, newExamSession);
      },
      {
        maxWait: 30000, // Increased from default 2000ms
        timeout: 50000, // Increased from default 5000ms
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, // Less strict isolation
      }
    );
  }

  // Update the exam state
  async updateExamState(
    tx: PrismaTransactionalClient,
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
      await this.finalizeExam(tx, session);
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

    return this.prisma.$transaction(
      async (tx) => {
        const examSession = await tx.examSession.findFirst({
          where: { id: examSessionId },
          select: {
            id: true,
            examId: true,
            exam: {
              select: {
                questionCount: true,
              },
            },
            questionOrder: {
              where: { questionId },
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

        console.log(examSession.questionOrder, "just checking");

        if (!examSession.questionOrder[0]) {
          throw new NotFoundException("Question not found in this exam session");
        }

        // 2. Calculate isCorrect without additional queries
        const isCorrect =
          !isSkipped && selectedAnswer !== null
            ? examSession.currentQuestion.correctOptionId === selectedAnswer
            : null;

        // const submissionData = {
        //   orderIndex: examSession.questionOrder[0].orderIndex,
        //   selectedAnswer: isSkipped ? null : (selectedAnswer as OptionLetter | null),
        //   isSkipped,
        //   isCorrect,
        //   examSession: {
        //     connect: { id: examSessionId },
        //   },
        //   question: {
        //     connect: { id: questionId },
        //   },
        //   exam: {
        //     connect: { id: examSession.examId },
        //   },
        // };

        const submission = await tx.submission.upsert({
          where: {
            examSessionId_questionId: {
              examSessionId,
              questionId,
            },
          },
          update: {
            selectedAnswer: isSkipped ? null : selectedAnswer,
            isSkipped,
            isCorrect,
            orderIndex: examSession.questionOrder[0].orderIndex,
          },
          create: {
            examSessionId,
            questionId,
            examId: examSession.examId,
            selectedAnswer: isSkipped ? null : selectedAnswer,
            isSkipped,
            isCorrect,
            orderIndex: examSession.questionOrder[0].orderIndex,
          },
        });

        const isLastQuestion =
          examSession.questionOrder[0].orderIndex === examSession.exam.questionCount;

        if (isLastQuestion) {
          return this.submitOrFinishExam(examSessionId, tx);
        }

        return submission;
      },
      {
        maxWait: 10000, // Increased from default 2000ms
        timeout: 20000, // Increased from default 5000ms
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, // Less strict isolation
      }
    );
  }

  // submit or finish the exam
  async submitOrFinishExam(examSessionId: string, tx?: PrismaTransactionalClient) {
    console.log(`Submitting or finishing exam for examSessionId: ${examSessionId}`);

    if (tx) {
      const examSession = await tx.examSession.findFirst({
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

      return this.finalizeExam(tx, examSession);
    }

    return this.prisma.$transaction(
      async (tx) => {
        const examSession = await tx.examSession.findFirst({
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

        return this.finalizeExam(tx, examSession);
      },
      {
        maxWait: 10000, // Increased from default 2000ms
        timeout: 20000, // Increased from default 5000ms
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, // Less strict isolation
      }
    );
  }

  // finalize the exam
  async finalizeExam(
    tx: PrismaTransactionalClient,
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
    console.log(examSession.submission, "is correct");

    const detailedResults = await this.createDetailedResults(examSession.id, tx);
    return detailedResults;
  }

  // Get exam results by user id and exam id
  async getExamResultByExamId(userId: string, examId: string) {
    return this.prisma.$transaction(
      async (tx) => {
        const results = await tx.result.findFirst({
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

        if (!results) {
          throw new NotFoundException("Result not found");
        }

        console.log(results, "results first coming");

        const resultDetails = await this.getDetailedResults(tx, results.exam.examSession[0].id);

        return {
          ...results,
          ...resultDetails,
        };
      },
      {
        maxWait: 20000, // Increased from default 2000ms
        timeout: 30000, // Increased from default 5000ms
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, // Less strict isolation
      }
    );
  }

  // get detailed results
  async getDetailedResults(tx: PrismaTransactionalClient, examSessionId: string) {
    const examSession = await tx.examSession.findUnique({
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

    let overallTotalCorrect = 0;
    let overallTotalWrong = 0;
    let overallTotalSkipped = 0;
    let overallTotalUnanswered = 0;

    const detailedResults = examSession.submission.map((s) => {
      const selectedOption = s.question.questionOption.find(
        (opt) => opt.optionLetter === s.selectedAnswer
      );
      const correctOption = s.question.questionOption.find(
        (opt) => opt.optionLetter === s.question.correctOptionId
      );

      if (s.selectedAnswer && s.isCorrect === true) {
        overallTotalCorrect += 1;
      } else if (s.selectedAnswer && s.isCorrect === false) {
        overallTotalWrong += 1;
      } else if (s.isSkipped === true) {
        overallTotalSkipped += 1;
      } else if (!s.selectedAnswer && !s.isSkipped) {
        overallTotalUnanswered += 1;
      }
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

    return {
      detailedResults,
      overallTotalCorrect,
      overallTotalWrong,
      overallTotalSkipped,
      overallTotalUnanswered,
    };
  }

  // Function to get detailed results (can be called separately when needed)
  async createDetailedResults(examSessionId: string, tx: PrismaTransactionalClient) {
    const examSession = await tx.examSession.findUnique({
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

    let overallTotalCorrect = 0;
    let overallTotalWrong = 0;
    let overallTotalSkipped = 0;
    let overallTotalUnanswered = 0;

    // Calculate the detailed results
    const detailedResults = examSession.submission.map((s) => {
      const selectedOption = s.question.questionOption.find(
        (opt) => opt.optionLetter === s.selectedAnswer
      );
      const correctOption = s.question.questionOption.find(
        (opt) => opt.optionLetter === s.question.correctOptionId
      );

      if (s.selectedAnswer && s.isCorrect === true) {
        overallTotalCorrect += 1;
      } else if (s.selectedAnswer && s.isCorrect === false) {
        overallTotalWrong += 1;
      } else if (s.isSkipped === true) {
        overallTotalSkipped += 1;
      } else if (!s.selectedAnswer && !s.isSkipped) {
        overallTotalUnanswered += 1;
      }
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

    const startTime = new Date(examSession.startTime);
    const endTime = new Date().getTime();
    const totalTimeSpent = Math.floor((endTime - startTime.getTime()) / 1000);

    const existingResult = await tx.result.findFirst({
      where: {
        userId: examSession.userId,
        examId: examSession.examId,
      },
    });
    let result;

    if (existingResult) {
      result = existingResult;
    } else {
      result = await tx.result.create({
        data: {
          userId: examSession.userId,
          examId: examSession.examId,
          totalScore: overallTotalCorrect,
          correctCount: overallTotalCorrect,
          wrongCount: overallTotalWrong,
          skippedCount: overallTotalSkipped,
          unansweredCount: overallTotalUnanswered,
          totalTimeSpent,
        },
      });

      await tx.examSession.update({
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
    }

    return {
      result,
      detailedResults,
      overallTotalCorrect,
      overallTotalWrong,
      overallTotalSkipped,
      overallTotalUnanswered,
    };
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
      distinct: ["userId"],
    });

    console.log(leaderboard, "leaderboard");

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
  async generateQuestionOrder(tx: PrismaTransactionalClient, examId: string) {
    const questions = await tx.question.findMany({
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
