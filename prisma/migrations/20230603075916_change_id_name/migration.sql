/*
  Warnings:

  - You are about to drop the column `collectionBoxId` on the `donations` table. All the data in the column will be lost.
  - Added the required column `collection_box_id` to the `donations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "donations" DROP CONSTRAINT "donations_collectionBoxId_fkey";

-- AlterTable
ALTER TABLE "donations" DROP COLUMN "collectionBoxId";
ALTER TABLE "donations" ADD COLUMN     "collection_box_id" STRING NOT NULL;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_collection_box_id_fkey" FOREIGN KEY ("collection_box_id") REFERENCES "collection_boxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
