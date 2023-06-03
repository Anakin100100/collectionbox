/*
  Warnings:

  - You are about to drop the column `published` on the `collection_boxes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "collection_boxes" DROP COLUMN "published";

-- CreateTable
CREATE TABLE "Donation" (
    "id" STRING NOT NULL,
    "ammount" INT4 NOT NULL,
    "userId" STRING NOT NULL,
    "collectionBoxId" STRING NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_collectionBoxId_fkey" FOREIGN KEY ("collectionBoxId") REFERENCES "collection_boxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
