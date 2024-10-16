import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
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

  @Get("/:examId")
  getQuestionsByExamId(@Param("examId") examId: number) {
    return this.questionsService.getQuestionsByExamId(examId);
  }

  @Get("/current")
  getCurrentQuestion(
    @Query("examSessionId") examSessionId: number,
    @Query("action") action: "next" | "previous" | "current"
  ) {
    console.log(examSessionId, action, "examSessionId, action");

    return this.questionsService.getCurrentQuestion(Number(examSessionId), action);
  }
}
