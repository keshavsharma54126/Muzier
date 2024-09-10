/*
  Warnings:

  - You are about to drop the `Downvote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Downvote" DROP CONSTRAINT "Downvote_songId_fkey";

-- DropForeignKey
ALTER TABLE "Downvote" DROP CONSTRAINT "Downvote_userId_fkey";

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Upvote" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "downvoted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "upvoted" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Downvote";
