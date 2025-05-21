/*
  Warnings:

  - A unique constraint covering the columns `[itemId,userId]` on the table `Progress` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Progress_itemId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Progress_itemId_userId_key" ON "Progress"("itemId", "userId");
