/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Stream` will be added. If there are existing duplicate values, this will fail.
  - Made the column `code` on table `Stream` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Stream" ALTER COLUMN "code" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stream_code_key" ON "Stream"("code");
