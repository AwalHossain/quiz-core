/*
  Warnings:

  - You are about to drop the column `userId` on the `Submission` table. All the data in the column will be lost.
  - Made the column `examId` on table `Submission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isSkipped` on table `Submission` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_examId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_userId_fkey";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "userId",
ALTER COLUMN "examId" SET NOT NULL,
ALTER COLUMN "isSkipped" SET NOT NULL;

-- CreateTable
CREATE TABLE "QuestionOrder" (
    "id" SERIAL NOT NULL,
    "examSessionId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "orderIndex" INTEGER NOT NULL,

    CONSTRAINT "QuestionOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionOrder_examSessionId_questionId_key" ON "QuestionOrder"("examSessionId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionOrder_examSessionId_orderIndex_key" ON "QuestionOrder"("examSessionId", "orderIndex");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOrder" ADD CONSTRAINT "QuestionOrder_examSessionId_fkey" FOREIGN KEY ("examSessionId") REFERENCES "ExamSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOrder" ADD CONSTRAINT "QuestionOrder_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
