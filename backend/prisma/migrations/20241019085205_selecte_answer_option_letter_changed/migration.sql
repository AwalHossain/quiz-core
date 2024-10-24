/*
  Warnings:

  - Added the required column `selectedAnswer` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "selectedAnswer",
ADD COLUMN     "selectedAnswer" "OptionLetter" NOT NULL;
