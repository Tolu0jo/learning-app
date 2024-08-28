/*
  Warnings:

  - A unique constraint covering the columns `[userId,topicId]` on the table `Completion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Completion_userId_topicId_key" ON "Completion"("userId", "topicId");
