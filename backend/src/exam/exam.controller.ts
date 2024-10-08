import { Body, Controller, Post } from "@nestjs/common";
import { CreateExamDto } from "./dtos/createExam.dto";
import { ExamService } from "./exam.service";

@Controller("exam")
export class ExamController {
  constructor(private examService: ExamService) {}

  @Post("/create")
  createExam(@Body() data: CreateExamDto) {
    return this.examService.createExam(data);
  }
}
