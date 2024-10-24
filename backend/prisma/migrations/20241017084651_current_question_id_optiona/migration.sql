-- DropForeignKey
ALTER TABLE "ExamSession" DROP CONSTRAINT "ExamSession_currentQuestionId_fkey";

-- AlterTable
ALTER TABLE "ExamSession" ALTER COLUMN "currentQuestionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ExamSession" ADD CONSTRAINT "ExamSession_currentQuestionId_fkey" FOREIGN KEY ("currentQuestionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
