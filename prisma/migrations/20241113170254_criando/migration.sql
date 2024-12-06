/*
  Warnings:

  - The values [VIDEO,EXERCICIO] on the enum `ElementType` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `itemStatus` on the `Progress` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('NotStarted', 'InProgress', 'Completed');

-- AlterEnum
BEGIN;
CREATE TYPE "ElementType_new" AS ENUM ('Video', 'Exercise');
ALTER TABLE "Progress" ALTER COLUMN "elementType" TYPE "ElementType_new" USING ("elementType"::text::"ElementType_new");
ALTER TYPE "ElementType" RENAME TO "ElementType_old";
ALTER TYPE "ElementType_new" RENAME TO "ElementType";
DROP TYPE "ElementType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Progress" DROP COLUMN "itemStatus",
ADD COLUMN     "itemStatus" "ItemStatus" NOT NULL;
