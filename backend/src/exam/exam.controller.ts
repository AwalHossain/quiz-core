import {
  BadRequestException,
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
import { CreateExamDto, CreateSubmissionDto } from "./dtos/createExam.dto";
import { ExamService } from "./exam.service";

@Controller("exam")
export class ExamController {
  constructor(private examService: ExamService) {}

  @UseGuards(AuthGuard)
  @Post("/create")
  createExam(@Body() data: CreateExamDto) {
    return this.examService.createExam(data);
  }

  @SkipAuth()
  @Get("/all")
  getAllExams(@Query("userId") userId?: string) {
    console.log(userId, "userId");

    return this.examService.getAllExams(userId);
  }

  @UseGuards(AuthGuard)
  @Get("/session/:sessionId/:userId")
  @UsePipes(ValidationPipe)
  async createExamSession(@Param("sessionId") sessionId: string, @Param("userId") userId: string) {
    try {
      return await this.examService.startOrResumeExam(userId, sessionId, null);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post("/submit")
  @UsePipes(ValidationPipe)
  submitQuestionAnswer(@Body() data: CreateSubmissionDto) {
    return this.examService.submitQuestionAnswer(data);
  }

  @UseGuards(AuthGuard)
  @Post("/finish")
  submitOrFinishExam(@Body() data: { examSessionId: string }) {
    return this.examService.submitOrFinishExam(data.examSessionId);
  }
  @UseGuards(AuthGuard)
  @Get("/result")
  getExamResult(@Query("userId") userId: string, @Query("examId") examId: string) {
    console.log(userId, examId, "userId, examId");
    return this.examService.getExamResultByExamId(userId, examId);
  }

  @UseGuards(AuthGuard)
  @Get("/:examId/leaderboard")
  getExamLeaderboard(@Param("examId") examId: string, @Query("limit") limit: number = 10) {
    console.log(examId, limit, "examId, limit");
    return this.examService.getExamLeaderboard(examId, limit);
  }
}
