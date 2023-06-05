/*
  Warnings:

  - You are about to drop the column `long_description` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `short_description` on the `organizations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "long_description";
ALTER TABLE "organizations" DROP COLUMN "short_description";
ALTER TABLE "organizations" ADD COLUMN     "description" STRING NOT NULL DEFAULT 'The description of the organization';
