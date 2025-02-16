import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { SkipAuth } from "../auth/decorators/public.decorators";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CreateQuestionDto } from "./dtos/createQuestio.dto";
import { QuestionsService } from "./questions.service";

@Controller("questions")
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @UseGuards(AuthGuard)
  @Post("/create")
  @UsePipes(ValidationPipe)
  createQuestion(@Body() data: CreateQuestionDto[]) {
    return this.questionsService.createQuestion(data);
  }

  @SkipAuth()
  @Get("/all")
  getAllQuestions() {
    return this.questionsService.getAllQuestions();
  }
  @UseGuards(AuthGuard)
  @Get("/exam/:examId")
  getQuestionsByExamId(@Param("examId") examId: string) {
    return this.questionsService.getQuestionsByExamId(examId);
  }

  @UseGuards(AuthGuard)
  @Get("/current")
  getCurrentQuestion(
    @Query("examSessionId") examSessionId: string,
    @Query("action") action: "next" | "previous" | "current"
  ) {
    return this.questionsService.getCurrentQuestion(examSessionId, action);
  }
}
