-- AlterTable
ALTER TABLE "ExamSession" ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "isFinished" BOOLEAN NOT NULL DEFAULT false;
