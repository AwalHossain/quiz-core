import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserDto {
  @ApiProperty({
    description: "The username of the user",
    example: "john_doe",
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: "The email of the user",
    example: "john_doe@example.com",
  })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: "The password of the user",
    example: "password",
  })
  @IsString()
  @IsOptional()
  password: string;
}
