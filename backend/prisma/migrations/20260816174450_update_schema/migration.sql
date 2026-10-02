-- CreateTable
CREATE TABLE "desk_assignments" (
    "id" TEXT NOT NULL,
    "desk_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "desk_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "desk_assignments_desk_id_ended_at_idx" ON "desk_assignments"("desk_id", "ended_at");

-- CreateIndex
CREATE INDEX "desk_assignments_employee_id_ended_at_idx" ON "desk_assignments"("employee_id", "ended_at");

-- AddForeignKey
ALTER TABLE "desk_assignments" ADD CONSTRAINT "desk_assignments_desk_id_fkey" FOREIGN KEY ("desk_id") REFERENCES "desks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "desk_assignments" ADD CONSTRAINT "desk_assignments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
