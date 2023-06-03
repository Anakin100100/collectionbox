/*
  Warnings:

  - You are about to drop the column `longDescription` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "longDescription";
ALTER TABLE "Organization" DROP COLUMN "shortDescription";
ALTER TABLE "Organization" ADD COLUMN     "long_description" STRING NOT NULL DEFAULT '';
ALTER TABLE "Organization" ADD COLUMN     "short_description" STRING NOT NULL DEFAULT '';
