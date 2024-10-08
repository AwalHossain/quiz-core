import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // @IsString()
  // @IsNotEmpty()
  // username: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsDate()
  @IsOptional()
  startTime: Date;

  @IsDate()
  @IsOptional()
  endTime: Date;
}

// title: string;
// description: string;
// duration: number;
// startTime?: Date | string | null;
// endTime?: Date | string | null;
// question?: Prisma.QuestionCreateNestedManyWithoutExamInput;
// Submission?: Prisma.SubmissionCreateNestedManyWithoutExamInput;
// result?: Prisma.ResultCreateNestedManyWithoutExamInput;
// examSession?: Prisma.ExamSessionCreateNestedManyWithoutExamInput

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  optionA: string;

  @IsString()
  @IsNotEmpty()
  optionB: string;

  @IsString()
  @IsNotEmpty()
  optionC: string;

  @IsString()
  @IsNotEmpty()
  optionD: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class CreateResultDto {
  @IsNumber()
  @IsNotEmpty()
  examId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  score: number;
}

export class CreateExamSessionDto {
  @IsNumber()
  @IsNotEmpty()
  examId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

export class CreateSubmissionDto {
  @IsNumber()
  @IsNotEmpty()
  examId: number;

  @IsNumber()
  @IsNotEmpty()
  questionId: number;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class ExamSession {
  @IsNumber()
  @IsNotEmpty()
  examId: number;

  @IsString()
  @IsNotEmpty()
  username: string;
}
