import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateExamDto, CreateExamSessionDto, CreateSubmissionDto } from "./dtos/createExam.dto";
import { ExamService } from "./exam.service";

@Controller("exam")
export class ExamController {
  constructor(private examService: ExamService) {}

  @Post("/create")
  createExam(@Body() data: CreateExamDto) {
    return this.examService.createExam(data);
  }

  @Get("/all")
  getAllExams() {
    return this.examService.getAllExams();
  }

  @Post("/session")
  @UsePipes(ValidationPipe)
  createExamSession(@Body() data: CreateExamSessionDto) {
    return this.examService.startOrResumeExam(data.userId, data.examId);
  }

  @Post("/submit")
  @UsePipes(ValidationPipe)
  submitQuestionAnswer(@Body() data: CreateSubmissionDto) {
    return this.examService.submitQuestionAnswer(data);
  }

  @Get("/current")
  getCurrentQuestion(
    @Query("examSessionId") examSessionId: number,
    @Query("action") action: "next" | "previous" | "current"
  ) {
    console.log(examSessionId, action, "examSessionId, action");

    return this.examService.getCurrentQuestion(Number(examSessionId), action);
  }
}
