-- CreateTable
CREATE TABLE "MCQSet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'generating',
    "workflowId" TEXT,
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "contentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MCQSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCQQuestion" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "mcqSetId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MCQQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MCQSet_workflowId_key" ON "MCQSet"("workflowId");

-- CreateIndex
CREATE INDEX "MCQSet_userId_idx" ON "MCQSet"("userId");

-- CreateIndex
CREATE INDEX "MCQSet_contentId_idx" ON "MCQSet"("contentId");

-- CreateIndex
CREATE INDEX "MCQQuestion_mcqSetId_idx" ON "MCQQuestion"("mcqSetId");

-- AddForeignKey
ALTER TABLE "MCQSet" ADD CONSTRAINT "MCQSet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCQSet" ADD CONSTRAINT "MCQSet_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCQQuestion" ADD CONSTRAINT "MCQQuestion_mcqSetId_fkey" FOREIGN KEY ("mcqSetId") REFERENCES "MCQSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
