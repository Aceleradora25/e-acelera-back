/*
  Warnings:

  - A unique constraint covering the columns `[email,provider]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_provider_key" ON "User"("email", "provider");
