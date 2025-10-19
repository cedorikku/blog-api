/*
  Warnings:

  - The primary key for the `TagOnPosts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `TagOnPosts` table. All the data in the column will be lost.
  - Made the column `postId` on table `TagOnPosts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tagId` on table `TagOnPosts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."TagOnPosts" DROP CONSTRAINT "TagOnPosts_pkey",
DROP COLUMN "id",
ALTER COLUMN "postId" SET NOT NULL,
ALTER COLUMN "tagId" SET NOT NULL,
ADD CONSTRAINT "TagOnPosts_pkey" PRIMARY KEY ("postId", "tagId");
