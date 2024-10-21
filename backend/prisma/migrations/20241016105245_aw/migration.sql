/*
  Warnings:

  - You are about to drop the column `choiceText` on the `QuestionOption` table. All the data in the column will be lost.
  - You are about to drop the column `letter` on the `QuestionOption` table. All the data in the column will be lost.
  - Added the required column `optionText` to the `QuestionOption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuestionOption" DROP COLUMN "choiceText",
DROP COLUMN "letter",
ADD COLUMN     "optionLetter" "OptionLetter",
ADD COLUMN     "optionText" TEXT NOT NULL;
