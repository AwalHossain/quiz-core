import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateExamDto, CreateExamSessionDto } from "./dtos/createExam.dto";

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
    return this.prisma.exam.findMany();
  }

  async getExamById(examId: number) {
    return this.prisma.exam.findUnique({
      where: { id: examId },
    });
  }

  // startExam
  async startExamSession(data: CreateExamSessionDto) {
    const { examId, userId } = data;
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: { question: true },
    });
    if (!exam) throw new HttpException("Exam not found", 404);

    const now = new Date();
    const startTime = new Date(exam.startTime);
    const endTime = new Date(exam.endTime);
    const remainingTime = Math.abs(endTime.getTime() - now.getTime());

    if (now < startTime) {
      const timeToStart = Math.abs(startTime.getTime() - now.getTime());
      return {
        status: "NOT_STARTED",
        message: `Exam will start in ${timeToStart} milliseconds`,
        timeToStart,
        startTime: exam.startTime,
      };
    } else if (remainingTime <= 0) {
      throw new BadRequestException("Exam has ended");
    }

    let examSession = await this.prisma.examSession.findFirst({
      where: { examId, userId },
      include: {
        submission: true,
      },
    });

    if (!examSession) {
      // randomized question order
      const shuffledQuestions = this.suffleArray([...exam.question]);
      // user is starting the exam for the first time
      examSession = await this.prisma.examSession.create({
        data: {
          userId,
          examId,
          startTime: now,
          currentQuestionId: shuffledQuestions[0].id,
          submission: {
            create: shuffledQuestions.map((question) => ({
              questionId: question.id,
              // Add other required fields with default values
              selectedAnswer: "",
              orderIndex: 0,
              isSkipped: false,
              isCorrect: false,
              Exam: {
                connect: { id: examId },
              },
              question: {
                connect: { id: question.id },
              },
            })),
          },
          questionOrder: {
            create: shuffledQuestions.map((question, index) => ({
              questionId: question.id,
              orderIndex: index,
            })),
          },
        },
        include: {
          submission: true,
          questionOrder: {
            include: { question: true },
            orderBy: { orderIndex: "asc" },
          },
        },
      });
    }
  }

  // start exam
  async startExam(data: CreateExamSessionDto) {
    const { examId, userId } = data;

    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      select: {
        duration: true,
      },
    });
    if (!exam) throw new HttpException("Exam not found", 404);
    let examSession = await this.prisma.examSession.findFirst({
      where: {
        examId,
        userId,
      },
      select: {
        id: true,
        startTime: true,
      },
    });
    const now = new Date();
    if (!examSession) {
      examSession = await this.prisma.examSession.create({
        data: {
          userId,
          examId,
          startTime: now,
          currentQuestionId: 1,
        },
        select: {
          id: true,
          startTime: true,
        },
      });
    }
    const elapsedTime = now.getTime() - examSession.startTime.getTime();
    const remainingTimeMs = Math.max(0, exam.duration * 60 * 1000 - elapsedTime);

    // Convert remaining time to hours, minutes, and seconds
    const hours = Math.floor(remainingTimeMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

    return {
      examSessionId: examSession.id,
      remainingTime: {
        hours,
        minutes,
        seconds,
        total: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      },
      startTime: examSession.startTime,
    };
  }
}
