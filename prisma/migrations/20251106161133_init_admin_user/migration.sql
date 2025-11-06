/*
  Warnings:

  - You are about to drop the `Exercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Theme` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Topic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Video` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');

-- DropForeignKey
ALTER TABLE "public"."Exercise" DROP CONSTRAINT "Exercise_topicId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Topic" DROP CONSTRAINT "Topic_themeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Video" DROP CONSTRAINT "Video_topicId_fkey";

-- DropTable
DROP TABLE "public"."Exercise";

-- DropTable
DROP TABLE "public"."Theme";

-- DropTable
DROP TABLE "public"."Topic";

-- DropTable
DROP TABLE "public"."Video";

-- CreateTable
CREATE TABLE "themes" (
    "idThemes" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "cardDescription" TEXT,
    "image" TEXT,
    "category" TEXT,
    "sequence" INTEGER DEFAULT 0,
    "alt" TEXT,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("idThemes")
);

-- CreateTable
CREATE TABLE "topics" (
    "idTopics" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cardDescription" TEXT,
    "description" TEXT,
    "references" TEXT,
    "themeId" TEXT,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("idTopics")
);

-- CreateTable
CREATE TABLE "exercises" (
    "idExercises" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cardDescription" TEXT,
    "description" TEXT,
    "sequence" INTEGER DEFAULT 0,
    "topicId" TEXT,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("idExercises")
);

-- CreateTable
CREATE TABLE "videos" (
    "idVideos" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "references" TEXT,
    "link" TEXT NOT NULL,
    "topicId" TEXT,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("idVideos")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "themes_title_key" ON "themes"("title");

-- CreateIndex
CREATE UNIQUE INDEX "topics_title_key" ON "topics"("title");

-- CreateIndex
CREATE UNIQUE INDEX "exercises_title_key" ON "exercises"("title");

-- CreateIndex
CREATE UNIQUE INDEX "videos_title_key" ON "videos"("title");

-- CreateIndex
CREATE UNIQUE INDEX "videos_link_key" ON "videos"("link");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("idThemes") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("idTopics") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("idTopics") ON DELETE SET NULL ON UPDATE CASCADE;
