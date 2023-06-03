-- AlterTable
ALTER TABLE "organizations" RENAME CONSTRAINT "Organization_pkey" TO "organizations_pkey";

-- RenameForeignKey
ALTER TABLE "organizations" RENAME CONSTRAINT "Organization_adminId_fkey" TO "organizations_adminId_fkey";

-- RenameIndex
ALTER INDEX "Organization_adminId_key" RENAME TO "organizations_adminId_key";

-- RenameIndex
ALTER INDEX "Organization_stripeId_key" RENAME TO "organizations_stripeId_key";
