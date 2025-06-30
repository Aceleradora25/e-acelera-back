/*
  Warnings:

  - Added the required column `themeId` to the `Progress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Progress" ADD COLUMN     "themeId" TEXT NOT NULL,
ALTER COLUMN "topicId" DROP DEFAULT;
