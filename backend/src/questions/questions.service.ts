import { Injectable, NotFoundException } from "@nestjs/common";
import { OptionLetter, QuestionOrder } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateQuestionDto } from "./dtos/createQuestio.dto";

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async createQuestion(data: CreateQuestionDto) {
    return this.prisma.$transaction(async (tx) => {
      const question = await tx.question.create({
        data: {
          questionText: data.questionText,
          examId: data.examId,
          correctOptionId: data.correctOptionId,
        },
        select: {
          examId: true,
          questionText: true,
          id: true,
          questionOption: {
            select: {
              optionLetter: true,
              optionText: true,
            },
          },
        },
      });

      // create question options
      const questionOpions = await tx.questionOption.createMany({
        data: data.options.map((option) => ({
          optionText: option.optionText,
          questionId: question.id,
          optionLetter: option.optionLetter as OptionLetter,
        })),
        skipDuplicates: true,
      });

      // update exam question count
      await tx.exam.update({
        where: { id: data.examId },
        data: { questionCount: { increment: 1 } },
        include: { question: { include: { questionOption: true } } },
      });
      return { ...question, options: questionOpions };
    });
  }

  async getAllQuestions() {
    const questions = await this.prisma.question.findMany({
      include: { questionOption: true },
    });
    return questions;
  }

  async getQuestionsByExamId(examId: string) {
    const questions = await this.prisma.question.findMany({
      where: { examId: examId },
      include: { questionOption: true },
    });
    return questions;
  }

  // fetching the current question and handling navigation
  async getCurrentQuestion(examSessionId: string, action: "next" | "previous" | "current") {
    return this.prisma.$transaction(async (tx) => {
      const examSession = await tx.examSession.findUnique({
        where: { id: examSessionId },
        include: {
          questionOrder: {
            orderBy: {
              orderIndex: "asc",
            },
          },
          submission: true,
          currentQuestion: {
            include: {
              questionOption: true,
            },
          },
        },
      });
      if (!examSession) throw new NotFoundException("Exam session not found");

      let currentQuestionOrder = examSession.questionOrder.find(
        (qo) => qo.questionId === examSession.currentQuestionId
      );

      if (!currentQuestionOrder) currentQuestionOrder = examSession.questionOrder[0];

      let nextQuestionOrder: QuestionOrder;
      switch (action) {
        case "next":
          nextQuestionOrder = examSession.questionOrder.find(
            (qo) => qo.orderIndex === currentQuestionOrder.orderIndex + 1
          );
          break;
        case "previous":
          nextQuestionOrder = examSession.questionOrder.find(
            (qo) => qo.orderIndex === currentQuestionOrder.orderIndex - 1
          );
          break;

        default:
          nextQuestionOrder = currentQuestionOrder;
      }

      if (!nextQuestionOrder) throw new NotFoundException("Question not found");

      // now fetch the current question
      const question =
        nextQuestionOrder.questionId === examSession.currentQuestionId
          ? examSession.currentQuestion
          : await tx.question.findUnique({
              where: { id: nextQuestionOrder.questionId },
              include: { questionOption: true },
            });

      if (!question) throw new NotFoundException("Question not found");

      // update the currentQuestionId in Exam Session
      await tx.examSession.update({
        where: { id: examSessionId },
        data: {
          currentQuestionId: nextQuestionOrder.questionId,
        },
      });
      const currentIndex = examSession.questionOrder.findIndex(
        (qo) => qo.questionId === nextQuestionOrder.questionId
      );
      const isLast = currentIndex === examSession.questionOrder.length - 1;
      const submission = examSession.submission.find((s) => s.questionId === question.id);

      return {
        question,
        currentIndex: currentIndex + 1,
        isLast,
        totalQuestions: examSession.questionOrder.length,
        submission: submission || null,
      };
    });
  }
}
