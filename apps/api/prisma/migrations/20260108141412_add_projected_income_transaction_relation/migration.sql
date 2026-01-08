-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectedIncome" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workUnitId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "date" DATETIME NOT NULL,
    "amount" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "transactionId" TEXT,
    CONSTRAINT "ProjectedIncome_workUnitId_fkey" FOREIGN KEY ("workUnitId") REFERENCES "WorkUnit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjectedIncome_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProjectedIncome" ("amount", "createdAt", "date", "id", "status", "updatedAt", "workUnitId") SELECT "amount", "createdAt", "date", "id", "status", "updatedAt", "workUnitId" FROM "ProjectedIncome";
DROP TABLE "ProjectedIncome";
ALTER TABLE "new_ProjectedIncome" RENAME TO "ProjectedIncome";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
