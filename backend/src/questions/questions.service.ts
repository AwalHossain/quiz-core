import { Injectable } from "@nestjs/common";
import { $Enums } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateQuestionDto } from "./dtos/createQuestio.dto";

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async createQuestion(data: CreateQuestionDto) {
    const question = await this.prisma.question.create({
      data: {
        questionText: data.questionText,
        optionA: data.optionA,
        optionB: data.optionB,
        optionC: data.optionC,
        optionD: data.optionD,
        correctAnswer: data.correctAnswer as $Enums.QuestionOption,
        exam: {
          connect: { id: data.examId },
        },
      },
    });
    return question;
  }

  async getAllQuestions() {
    const questions = await this.prisma.question.findMany();
    return questions;
  }
}
