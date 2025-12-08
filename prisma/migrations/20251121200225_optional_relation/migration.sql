/*
  Warnings:

  - You are about to drop the column `videoId` on the `topics` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[topicId]` on the table `videos` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_topicId_fkey";

-- DropForeignKey
ALTER TABLE "topics" DROP CONSTRAINT "topics_videoId_fkey";

-- DropIndex
DROP INDEX "topics_videoId_key";

-- AlterTable
ALTER TABLE "exercises" ALTER COLUMN "topicId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "topics" DROP COLUMN "videoId";

-- AlterTable
ALTER TABLE "videos" ADD COLUMN     "topicId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "videos_topicId_key" ON "videos"("topicId");

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
