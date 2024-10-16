import { Injectable, NotFoundException } from "@nestjs/common";
import { $Enums } from "@prisma/client";
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
          optionA: data.optionA,
          optionB: data.optionB,
          optionC: data.optionC,
          optionD: data.optionD,
          correctAnswer: data.correctAnswer as $Enums.QuestionOption,
          examId: data.examId,
        },
      });
      // update exam question count
      await tx.exam.update({
        where: { id: data.examId },
        data: { questionCount: { increment: 1 } },
      });
      return question;
    });
  }

  async getAllQuestions() {
    const questions = await this.prisma.question.findMany();
    return questions;
  }

  async getQuestionsByExamId(examId: number) {
    const questions = await this.prisma.question.findMany({
      where: { examId: Number(examId) },
    });
    return questions;
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
}
