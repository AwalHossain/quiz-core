import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateQuestionDto } from "./dtos/createQuestio.dto";

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async createQuestion(data: CreateQuestionDto) {
    const question = await this.prisma.question.create({
      data,
    });
    return question;
  }

  async getAllQuestions() {
    const questions = await this.prisma.question.findMany();
    return questions;
  }
}
