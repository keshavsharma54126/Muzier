-- AlterTable
ALTER TABLE "Upvote" ADD COLUMN     "downvote" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "upvote" INTEGER NOT NULL DEFAULT 0;
