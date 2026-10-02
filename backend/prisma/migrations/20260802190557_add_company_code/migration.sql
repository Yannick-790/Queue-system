/*
  Warnings:

  - A unique constraint covering the columns `[employeeInviteCode]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employeeInviteCode` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "allowEmployeeRegistration" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "employeeInviteCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "companies_employeeInviteCode_key" ON "companies"("employeeInviteCode");
