/*
  Warnings:

  - A unique constraint covering the columns `[userId,userAgent,ipAddress]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Session_userId_userAgent_ipAddress_key" ON "Session"("userId", "userAgent", "ipAddress");
