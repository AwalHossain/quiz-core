import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateQuestionDto } from "./dtos/createQuestio.dto";
import { QuestionsService } from "./questions.service";

@Controller("questions")
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Post("/create")
  @UsePipes(ValidationPipe)
  createQuestion(@Body() data: CreateQuestionDto) {
    return this.questionsService.createQuestion(data);
  }

  @Get("/all")
  getAllQuestions() {
    return this.questionsService.getAllQuestions();
  }
}
