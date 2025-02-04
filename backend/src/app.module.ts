import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config'; // Add this import
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ExamModule } from "./exam/exam.module";
import { PrismaModule } from "./prisma/prisma.module";
import { QuestionsModule } from "./questions/questions.module";
import { UserModule } from "./user/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes env variables available throughout the app
      envFilePath: '.env',
    }),
    PrismaModule, 
    UserModule, 
    ExamModule, 
    QuestionsModule, 
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}