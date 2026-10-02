-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_department_id_fkey";

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "EmployeeStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "department_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
