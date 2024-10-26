import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ExamModule } from "./exam/exam.module";
import { PrismaModule } from "./prisma/prisma.module";
import { QuestionsModule } from "./questions/questions.module";
import { UserModule } from "./user/users.module";

@Module({
  imports: [PrismaModule, UserModule, ExamModule, QuestionsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
