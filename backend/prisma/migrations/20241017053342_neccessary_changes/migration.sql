/*
  Warnings:

  - You are about to drop the column `TotalTimeSpent` on the `ExamSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExamSession" DROP COLUMN "TotalTimeSpent",
ADD COLUMN     "totalTimeSpent" INTEGER,
ALTER COLUMN "currentQuestionId" DROP DEFAULT,
ALTER COLUMN "currentQuestionId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "QuestionOrder" ALTER COLUMN "questionId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "ExamSession" ADD CONSTRAINT "ExamSession_currentQuestionId_fkey" FOREIGN KEY ("currentQuestionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
