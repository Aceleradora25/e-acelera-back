/*
  Warnings:

  - Added the required column `modifiedAt` to the `Progress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Progress" ADD COLUMN     "modifiedAt" TIMESTAMP(3) NOT NULL;
