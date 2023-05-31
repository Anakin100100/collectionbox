/*
  Warnings:

  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_userId_fkey";

-- DropTable
DROP TABLE "posts";

-- CreateTable
CREATE TABLE "collection_boxes" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "content" JSONB,
    "published" BOOL NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" STRING NOT NULL,

    CONSTRAINT "collection_boxes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "collection_boxes" ADD CONSTRAINT "collection_boxes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
