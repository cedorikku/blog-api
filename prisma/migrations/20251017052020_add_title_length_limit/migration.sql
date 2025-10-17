/*
  Warnings:

  - You are about to alter the column `title` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "public"."Post" ALTER COLUMN "title" SET DATA TYPE VARCHAR(50);
