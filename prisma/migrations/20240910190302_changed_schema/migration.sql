-- DropForeignKey
ALTER TABLE "Upvote" DROP CONSTRAINT "Upvote_songId_fkey";

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
