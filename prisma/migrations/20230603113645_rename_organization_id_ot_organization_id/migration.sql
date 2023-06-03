/*
  Warnings:

  - You are about to drop the column `organizationId` on the `collection_boxes` table. All the data in the column will be lost.
  - Added the required column `organization_id` to the `collection_boxes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "collection_boxes" DROP CONSTRAINT "collection_boxes_organizationId_fkey";

-- AlterTable
ALTER TABLE "collection_boxes" DROP COLUMN "organizationId";
ALTER TABLE "collection_boxes" ADD COLUMN     "organization_id" STRING NOT NULL;

-- AddForeignKey
ALTER TABLE "collection_boxes" ADD CONSTRAINT "collection_boxes_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
