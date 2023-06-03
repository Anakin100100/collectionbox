/*
  Warnings:

  - You are about to drop the `Donation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_collectionBoxId_fkey";

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_userId_fkey";

-- DropTable
DROP TABLE "Donation";

-- CreateTable
CREATE TABLE "donations" (
    "id" STRING NOT NULL,
    "ammount" INT4 NOT NULL,
    "userId" STRING NOT NULL,
    "collectionBoxId" STRING NOT NULL,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_collectionBoxId_fkey" FOREIGN KEY ("collectionBoxId") REFERENCES "collection_boxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
