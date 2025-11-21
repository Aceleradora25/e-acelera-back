-- DropForeignKey
ALTER TABLE "topics" DROP CONSTRAINT "topics_themeId_fkey";

-- AlterTable
ALTER TABLE "topics" ALTER COLUMN "themeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
