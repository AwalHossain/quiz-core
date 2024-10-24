import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CreateExamDto, CreateSubmissionDto } from "./dtos/createExam.dto";
import { ExamService } from "./exam.service";

@Controller("exam")
export class ExamController {
  constructor(private examService: ExamService) {}

  @Post("/create")
  createExam(@Body() data: CreateExamDto) {
    return this.examService.createExam(data);
  }

  @Get("/all")
  getAllExams(@Query("userId") userId?: string) {
    console.log(userId, "userId");

    return this.examService.getAllExams(userId);
  }

  @Get("/session/:sessionId/:userId")
  @UsePipes(ValidationPipe)
  async createExamSession(@Param("sessionId") sessionId: string, @Param("userId") userId: string) {
    try {
      return await this.examService.startOrResumeExam(userId, sessionId, null);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Post("/submit")
  @UsePipes(ValidationPipe)
  submitQuestionAnswer(@Body() data: CreateSubmissionDto) {
    return this.examService.submitQuestionAnswer(data);
  }

  @Post("/finish")
  submitOrFinishExam(@Body() data: { examSessionId: string }) {
    return this.examService.submitOrFinishExam(data.examSessionId);
  }

  @Get("/result")
  getExamResult(@Query("userId") userId: string, @Query("examId") examId: string) {
    console.log(userId, examId, "userId, examId");
    return this.examService.getExamResultByExamId(userId, examId);
  }

  @Get("/:examId/leaderboard")
  getExamLeaderboard(@Param("examId") examId: string, @Query("limit") limit: number = 10) {
    console.log(examId, limit, "examId, limit");
    return this.examService.getExamLeaderboard(examId, limit);
  }
}
