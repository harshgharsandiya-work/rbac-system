/*
  Warnings:

  - A unique constraint covering the columns `[email,organisationId]` on the table `OrganisationInvite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrganisationInvite_email_organisationId_key" ON "OrganisationInvite"("email", "organisationId");
