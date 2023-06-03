-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "longDescription" STRING NOT NULL DEFAULT '';
ALTER TABLE "Organization" ADD COLUMN     "shortDescription" STRING NOT NULL DEFAULT '';
