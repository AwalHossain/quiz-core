import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
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
    const exams = await this.prisma.exam.findMany({
      include: {
        question: true,
      },
    });
    return exams;
  }

  async getExamById(examId: number) {
    return this.prisma.exam.findUnique({
      where: { id: examId },
    });
  }

  // // startExam
  // async startExamSession(data: CreateExamSessionDto) {
  //   const { examId, userId } = data;
  //   const exam = await this.prisma.exam.findUnique({
  //     where: { id: examId },
  //     include: { question: true },
  //   });
  //   if (!exam) throw new HttpException("Exam not found", 404);

  //   const now = new Date();
  //   const startTime = new Date(exam.startTime);
  //   const endTime = new Date(exam.endTime);
  //   const remainingTime = Math.abs(endTime.getTime() - now.getTime());

  //   if (now < startTime) {
  //     const timeToStart = Math.abs(startTime.getTime() - now.getTime());
  //     return {
  //       status: "NOT_STARTED",
  //       message: `Exam will start in ${timeToStart} milliseconds`,
  //       timeToStart,
  //       startTime: exam.startTime,
  //     };
  //   } else if (remainingTime <= 0) {
  //     throw new BadRequestException("Exam has ended");
  //   }

  //   let examSession = await this.prisma.examSession.findFirst({
  //     where: { examId, userId },
  //     include: {
  //       submission: true,
  //     },
  //   });

  //   if (!examSession) {
  //     // randomized question order
  //     const shuffledQuestions = this.suffleArray([...exam.question]);
  //     // user is starting the exam for the first time
  //     examSession = await this.prisma.examSession.create({
  //       data: {
  //         userId,
  //         examId,
  //         startTime: now,
  //         currentQuestionId: shuffledQuestions[0].id,
  //         submission: {
  //           create: shuffledQuestions.map((question) => ({
  //             questionId: question.id,
  //             // Add other required fields with default values
  //             selectedAnswer: "",
  //             orderIndex: 0,
  //             isSkipped: false,
  //             isCorrect: false,
  //             Exam: {
  //               connect: { id: examId },
  //             },
  //             question: {
  //               connect: { id: question.id },
  //             },
  //           })),
  //         },
  //         questionOrder: {
  //           create: shuffledQuestions.map((question, index) => ({
  //             questionId: question.id,
  //             orderIndex: index,
  //           })),
  //         },
  //       },
  //       include: {
  //         submission: true,
  //         questionOrder: {
  //           include: { question: true },
  //           orderBy: { orderIndex: "asc" },
  //         },
  //       },
  //     });
  //   }
  // }

  // // start exam
  // async startExam(data: CreateExamSessionDto) {
  //   const { examId, userId } = data;

  //   const exam = await this.prisma.exam.findUnique({
  //     where: { id: examId },
  //     select: {
  //       duration: true,
  //     },
  //   });
  //   if (!exam) throw new HttpException("Exam not found", 404);
  //   let examSession = await this.prisma.examSession.findFirst({
  //     where: {
  //       examId,
  //       userId,
  //     },
  //     select: {
  //       id: true,
  //       startTime: true,
  //     },
  //   });
  //   const now = new Date();
  //   if (!examSession) {
  //     examSession = await this.prisma.examSession.create({
  //       data: {
  //         userId,
  //         examId,
  //         startTime: now,
  //         currentQuestionId: 1,
  //       },
  //       select: {
  //         id: true,
  //         startTime: true,
  //       },
  //     });
  //   }
  //   const elapsedTime = now.getTime() - examSession.startTime.getTime();
  //   const remainingTimeMs = Math.max(0, exam.duration * 60 * 1000 - elapsedTime);

  //   // Convert remaining time to hours, minutes, and seconds
  //   const hours = Math.floor(remainingTimeMs / (1000 * 60 * 60));
  //   const minutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
  //   const seconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

  //   return {
  //     examSessionId: examSession.id,
  //     remainingTime: {
  //       hours,
  //       minutes,
  //       seconds,
  //       total: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
  //     },
  //     startTime: examSession.startTime,
  //   };
  // }

  // Start or Resume Exam Session
  async startOrResumeExam(userId: number, examId: number) {
    let examSession = await this.prisma.examSession.findFirst({
      where: {
        userId,
        examId,
      },
      include: {
        questionOrder: {
          include: {
            question: true,
          },
        },
      },
    });
    if (!examSession) {
      examSession = await this.prisma.examSession.create({
        data: {
          userId,
          examId,
          startTime: new Date(),
          currentQuestionId: 1,
          questionOrder: {
            create: await this.generateQuestionOrder(examId),
          },
        },
        include: {
          questionOrder: {
            include: {
              question: true,
            },
          },
        },
      });
    }
    return examSession;
  }

  // fetching the current question and handling navigation
  async getCurrentQuestion(examSessionId: number, action: "next" | "previous" | "current") {
    const examSession = await this.prisma.examSession.findUnique({
      where: { id: Number(examSessionId) },
      include: {
        questionOrder: {
          include: {
            question: true,
          },
        },
        submission: true,
      },
    });
    if (!examSession) throw new NotFoundException("Exam session not found");
    let currentQuestionIndex = examSession.questionOrder.findIndex(
      (qo) => qo.questionId === examSession.currentQuestionId
    );

    console.log(currentQuestionIndex, "currentQuestionIndex");
    console.log(examSession.questionOrder, "examSession.questionOrder");

    switch (action) {
      case "next":
        currentQuestionIndex = Math.min(
          currentQuestionIndex + 1,
          examSession.questionOrder.length - 1
        );
        break;
      case "previous":
        currentQuestionIndex = Math.max(currentQuestionIndex - 1, 0);
        break;
    }
    const currentQuestion = examSession?.questionOrder[currentQuestionIndex].question;
    const submission = examSession?.submission.find((s) => s.questionId === currentQuestion.id);

    // update the currentQuestionId in Exam Session
    await this.prisma.examSession.update({
      where: { id: examSessionId },
      data: {
        currentQuestionId: currentQuestion.id,
      },
    });

    return {
      question: currentQuestion,
      isLast: currentQuestionIndex === examSession.questionOrder.length - 1,
      submission: submission
        ? { selectedAnswer: submission.selectedAnswer, isSkipped: submission.isSkipped }
        : null,
    };
    // const submission = examSession.submission.find(s => s.questionId === currentQuestionIndex.id)
  }

  // handling the submission of the question
  async submitQuestionAnswer(data: CreateSubmissionDto) {
    const { examSessionId, questionId, answer, isSkipped } = data;
    const examSession = await this.prisma.examSession.findUnique({
      where: { id: examSessionId },
      select: { examId: true },
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

    const submission = await this.prisma.submission.upsert({
      where: {
        examSessionId_questionId: {
          examSessionId,
          questionId,
        },
      },
      update: { selectedAnswer: answer, isSkipped },
      create: {
        examSessionId,
        questionId,
        examId: examSession.examId,
        orderIndex: questionOrder.orderIndex,
        selectedAnswer: answer,
        isSkipped,
      },
    });

    const isLast = await this.isLastQuestion(examSessionId, questionId);
    if (isLast) {
      // finalize the exam
    }
    return submission;
  }

  // get the last question
  async isLastQuestion(examSessionId: number, questionId: number) {
    const lastQuestion = await this.prisma.questionOrder.findFirst({
      where: { examSessionId },
      orderBy: { orderIndex: "desc" },
      select: { questionId: true },
    });
    return lastQuestion?.questionId === questionId;
  }

  async generateQuestionOrder(examId: number) {
    const questions = await this.prisma.question.findMany({ where: { examId } });
    return questions.map((q, index) => ({ questionId: q.id, orderIndex: index + 1 }));
  }

  // async generateQuestionOrder(examId: number) {
  //   const questions = await this.prisma.question.findMany({
  //     where: { examId },
  //   });
  //   const shuffledQuestions = this.suffleArray(questions);
  //   return shuffledQuestions.map((question, index) => ({
  //     questionId: question.id,
  //     orderIndex: index,
  //   }));
  // }
}
