import { OptionLetter } from "@prisma/client";
import { IsArray, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @IsArray()
  @IsNotEmpty()
  options: CreateQuestionOptionDto[];

  @IsString()
  @IsNotEmpty()
  correctOptionId: OptionLetter;

  @IsNotEmpty()
  @IsUUID()
  examId: string;
}

export class CreateQuestionOptionDto {
  @IsString()
  @IsNotEmpty()
  optionText: string;

  @IsString()
  @IsNotEmpty()
  optionLetter: string;
}
