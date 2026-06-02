-- CreateTable
CREATE TABLE "DateIdeaInterest" (
    "dateIdeaId" TEXT NOT NULL,
    "interestId" TEXT NOT NULL,

    PRIMARY KEY ("dateIdeaId", "interestId"),
    CONSTRAINT "DateIdeaInterest_dateIdeaId_fkey" FOREIGN KEY ("dateIdeaId") REFERENCES "DateIdea" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DateIdeaInterest_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "DateIdeaInterest_interestId_idx" ON "DateIdeaInterest"("interestId");
