-- CreateIndex
CREATE INDEX "ExamSession_id_idx" ON "ExamSession"("id");

-- CreateIndex
CREATE INDEX "Submission_examSessionId_questionId_idx" ON "Submission"("examSessionId", "questionId");

-- CreateIndex
CREATE INDEX "Submission_orderIndex_idx" ON "Submission"("orderIndex");
