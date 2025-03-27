/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `loginDate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `provider` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "User_email_provider_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "loginDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "provider",
ADD COLUMN     "provider" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Provider";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
