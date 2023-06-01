/*
  Warnings:

  - A unique constraint covering the columns `[stripeId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeId` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `collection_boxes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "stripeId" STRING NOT NULL;

-- AlterTable
ALTER TABLE "collection_boxes" ADD COLUMN     "organizationId" STRING NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_stripeId_key" ON "Organization"("stripeId");

-- AddForeignKey
ALTER TABLE "collection_boxes" ADD CONSTRAINT "collection_boxes_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
