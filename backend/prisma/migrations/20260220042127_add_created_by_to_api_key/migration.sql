/*
  Warnings:

  - You are about to drop the column `lastUsedAt` on the `ApiKey` table. All the data in the column will be lost.
  - Added the required column `createdByUserId` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "lastUsedAt",
ADD COLUMN     "createdByUserId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ApiKey_organisationId_idx" ON "ApiKey"("organisationId");

-- CreateIndex
CREATE INDEX "ApiKey_createdByUserId_idx" ON "ApiKey"("createdByUserId");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
