/*
  Warnings:

  - A unique constraint covering the columns `[desk_id]` on the table `employees` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "desk_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "employees_desk_id_key" ON "employees"("desk_id");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_desk_id_fkey" FOREIGN KEY ("desk_id") REFERENCES "desks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
