/*
  Warnings:

  - Added the required column `name` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomtype` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('public', 'private');

-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "code" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "roomtype" "RoomType" NOT NULL;
