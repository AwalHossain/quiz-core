import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateExamDto, CreateExamSessionDto } from './dtos/createExam.dto';
import { ExamService } from './exam.service';

@Controller('exam')
export class ExamController {
  constructor(private examService: ExamService) {}

  @Post('/create')
  @UsePipes(ValidationPipe)
  createExam(@Body() data: CreateExamDto) {
    return this.examService.createExam(data);
  }

  @Get('/get-all')
  getAllExams() {
    return this.examService.getAllExams();
  }

  @Post('/session')
  createExamSession(@Body() data: CreateExamSessionDto) {
    return this.examService.startExamSession(data);
  }

  @Post('/start')
  startExamSession(@Body() data: CreateExamSessionDto) {
    return this.examService.startExam(data);
  }
}
