/*
  Warnings:

  - A unique constraint covering the columns `[examSessionId,questionId]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `correctAnswer` on the `Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "QuestionOption" AS ENUM ('A', 'B', 'C', 'D');

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "correctAnswer",
ADD COLUMN     "correctAnswer" "QuestionOption" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Submission_examSessionId_questionId_key" ON "Submission"("examSessionId", "questionId");
