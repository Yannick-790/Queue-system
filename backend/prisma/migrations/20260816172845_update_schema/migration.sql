-- AlterTable
ALTER TABLE "desks" ADD COLUMN     "service_id" TEXT;

-- AddForeignKey
ALTER TABLE "desks" ADD CONSTRAINT "desks_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
