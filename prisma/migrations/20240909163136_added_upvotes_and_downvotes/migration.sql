/*
  Warnings:

  - You are about to drop the column `userId` on the `Upvote` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Upvote" DROP CONSTRAINT "Upvote_userId_fkey";

-- AlterTable
ALTER TABLE "Upvote" DROP COLUMN "userId";
