/*
  Warnings:

  - You are about to drop the `Upvote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Upvote" DROP CONSTRAINT "Upvote_songId_fkey";

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "downvote" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "upvote" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Upvote";
