-- AlterTable
ALTER TABLE "QuizAttempt" ADD COLUMN     "studentId" INTEGER;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "enrollmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "department" TEXT,
ADD COLUMN     "institution" TEXT,
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "QuizCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "studentId" INTEGER NOT NULL,
    "mcqSetId" INTEGER NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizCode_code_key" ON "QuizCode"("code");

-- CreateIndex
CREATE INDEX "QuizCode_code_idx" ON "QuizCode"("code");

-- CreateIndex
CREATE INDEX "QuizCode_studentId_idx" ON "QuizCode"("studentId");

-- CreateIndex
CREATE INDEX "QuizCode_mcqSetId_idx" ON "QuizCode"("mcqSetId");

-- CreateIndex
CREATE INDEX "QuizCode_isUsed_idx" ON "QuizCode"("isUsed");

-- CreateIndex
CREATE INDEX "QuizAttempt_studentId_idx" ON "QuizAttempt"("studentId");

-- AddForeignKey
ALTER TABLE "QuizCode" ADD CONSTRAINT "QuizCode_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizCode" ADD CONSTRAINT "QuizCode_mcqSetId_fkey" FOREIGN KEY ("mcqSetId") REFERENCES "MCQSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
