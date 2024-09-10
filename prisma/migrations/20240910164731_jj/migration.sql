/*
  Warnings:

  - A unique constraint covering the columns `[songId]` on the table `Upvote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Upvote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Upvote_songId_key" ON "Upvote"("songId");

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_userId_key" ON "Upvote"("userId");
