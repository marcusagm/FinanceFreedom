-- CreateTable
CREATE TABLE "ProjectedIncome" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workUnitId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "date" DATETIME NOT NULL,
    "amount" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProjectedIncome_workUnitId_fkey" FOREIGN KEY ("workUnitId") REFERENCES "WorkUnit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
