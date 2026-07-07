/*
  Warnings:

  - The primary key for the `exercises` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cardDescription` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `idExercises` on the `exercises` table. All the data in the column will be lost.
  - The primary key for the `themes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cardDescription` on the `themes` table. All the data in the column will be lost.
  - You are about to drop the column `idThemes` on the `themes` table. All the data in the column will be lost.
  - The primary key for the `topics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cardDescription` on the `topics` table. All the data in the column will be lost.
  - You are about to drop the column `idTopics` on the `topics` table. All the data in the column will be lost.
  - The primary key for the `videos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idVideos` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `topicId` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[videoId]` on the table `topics` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `exercises` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `shortDescription` to the `exercises` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `exercises` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sequence` on table `exercises` required. This step will fail if there are existing NULL values in that column.
  - Made the column `topicId` on table `exercises` required. This step will fail if there are existing NULL values in that column.
  - The required column `id` was added to the `themes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `shortDescription` to the `themes` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `themes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `themes` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `category` to the `themes` table without a default value. This is not possible if the table is not empty.
  - Made the column `sequence` on table `themes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `alt` on table `themes` required. This step will fail if there are existing NULL values in that column.
  - The required column `id` was added to the `topics` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `shortDescription` to the `topics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoId` to the `topics` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `topics` required. This step will fail if there are existing NULL values in that column.
  - Made the column `references` on table `topics` required. This step will fail if there are existing NULL values in that column.
  - Made the column `themeId` on table `topics` required. This step will fail if there are existing NULL values in that column.
  - The required column `id` was added to the `videos` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `description` on table `videos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `references` on table `videos` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ThemeCategory" AS ENUM ('Leveling', 'SelfStudy');

-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_userId_fkey";

-- DropForeignKey
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_topicId_fkey";

-- DropForeignKey
ALTER TABLE "topics" DROP CONSTRAINT "topics_themeId_fkey";

-- DropForeignKey
ALTER TABLE "videos" DROP CONSTRAINT "videos_topicId_fkey";

-- AlterTable
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_pkey",
DROP COLUMN "cardDescription",
DROP COLUMN "idExercises",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "shortDescription" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "sequence" SET NOT NULL,
ALTER COLUMN "topicId" SET NOT NULL,
ADD CONSTRAINT "exercises_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "themes" DROP CONSTRAINT "themes_pkey",
DROP COLUMN "cardDescription",
DROP COLUMN "idThemes",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "shortDescription" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "ThemeCategory" NOT NULL,
ALTER COLUMN "sequence" SET NOT NULL,
ALTER COLUMN "alt" SET NOT NULL,
ADD CONSTRAINT "themes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "topics" DROP CONSTRAINT "topics_pkey",
DROP COLUMN "cardDescription",
DROP COLUMN "idTopics",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "shortDescription" TEXT NOT NULL,
ADD COLUMN     "videoId" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "references" SET NOT NULL,
ALTER COLUMN "themeId" SET NOT NULL,
ADD CONSTRAINT "topics_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "videos" DROP CONSTRAINT "videos_pkey",
DROP COLUMN "idVideos",
DROP COLUMN "topicId",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "references" SET NOT NULL,
ADD CONSTRAINT "videos_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "loginDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "topics_videoId_key" ON "topics"("videoId");

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
