-- AlterTable
ALTER TABLE "MCQSet" ALTER COLUMN "status" SET DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "MCQSet_status_idx" ON "MCQSet"("status");
