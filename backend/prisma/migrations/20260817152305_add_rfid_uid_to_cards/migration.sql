/*
  Warnings:

  - A unique constraint covering the columns `[rfid_uid]` on the table `cards` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "rfid_uid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "cards_rfid_uid_key" ON "cards"("rfid_uid");
