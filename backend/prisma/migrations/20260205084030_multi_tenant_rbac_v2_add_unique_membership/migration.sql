/*
  Warnings:

  - A unique constraint covering the columns `[userId,organisationId,roleId]` on the table `MemberShip` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MemberShip_userId_organisationId_key";

-- CreateIndex
CREATE UNIQUE INDEX "MemberShip_userId_organisationId_roleId_key" ON "MemberShip"("userId", "organisationId", "roleId");
