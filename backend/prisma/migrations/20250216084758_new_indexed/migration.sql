-- CreateIndex
CREATE INDEX "Leaderboard_examId_userId_idx" ON "Leaderboard"("examId", "userId");

-- CreateIndex
CREATE INDEX "Leaderboard_id_idx" ON "Leaderboard"("id");

-- CreateIndex
CREATE INDEX "QuestionOrder_examSessionId_questionId_idx" ON "QuestionOrder"("examSessionId", "questionId");

-- CreateIndex
CREATE INDEX "QuestionOrder_examSessionId_orderIndex_idx" ON "QuestionOrder"("examSessionId", "orderIndex");

-- CreateIndex
CREATE INDEX "Result_userId_examId_idx" ON "Result"("userId", "examId");

-- CreateIndex
CREATE INDEX "Result_id_idx" ON "Result"("id");
