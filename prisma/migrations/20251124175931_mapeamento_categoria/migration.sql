/*
  Warnings:

  - The values [Leveling,SelfStudy] on the enum `ThemeCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ThemeCategory_new" AS ENUM ('nivelamento', 'autoestudo');
ALTER TABLE "themes" ALTER COLUMN "category" TYPE "ThemeCategory_new" USING ("category"::text::"ThemeCategory_new");
ALTER TYPE "ThemeCategory" RENAME TO "ThemeCategory_old";
ALTER TYPE "ThemeCategory_new" RENAME TO "ThemeCategory";
DROP TYPE "public"."ThemeCategory_old";
COMMIT;
