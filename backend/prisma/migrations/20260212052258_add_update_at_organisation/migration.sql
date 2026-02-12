/*
  Warnings:

  - Added the required column `updatedAt` to the `Organisation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organisation" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
