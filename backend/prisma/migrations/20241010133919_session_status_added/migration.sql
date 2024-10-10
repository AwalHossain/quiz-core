-- CreateEnum
CREATE TYPE "ExamSessionStatus" AS ENUM ('ONGOING', 'FINISHED');

-- AlterTable
ALTER TABLE "ExamSession" ADD COLUMN     "status" "ExamSessionStatus" NOT NULL DEFAULT 'ONGOING';
