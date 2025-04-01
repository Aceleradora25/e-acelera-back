/*
  Warnings:

  - A unique constraint covering the columns `[itemId]` on the table `Progress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Progress_itemId_key" ON "Progress"("itemId");
