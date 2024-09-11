/*
  Warnings:

  - A unique constraint covering the columns `[userId,songId]` on the table `Upvote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Upvote_songId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_userId_songId_key" ON "Upvote"("userId", "songId");
