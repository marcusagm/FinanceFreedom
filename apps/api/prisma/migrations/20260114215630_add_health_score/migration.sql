-- CreateTable
CREATE TABLE "DailyHealthScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "score" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "debtPenalty" INTEGER NOT NULL DEFAULT 0,
    "investmentBonus" INTEGER NOT NULL DEFAULT 0,
    "reserveBonus" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailyHealthScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SavingsGoal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "targetAmount" DECIMAL NOT NULL,
    "currentAmount" DECIMAL NOT NULL DEFAULT 0.0,
    "deadline" DATETIME,
    "description" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "SavingsGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SavingsGoal" ("createdAt", "currentAmount", "deadline", "description", "id", "name", "priority", "status", "targetAmount", "updatedAt", "userId") SELECT "createdAt", "currentAmount", "deadline", "description", "id", "name", "priority", "status", "targetAmount", "updatedAt", "userId" FROM "SavingsGoal";
DROP TABLE "SavingsGoal";
ALTER TABLE "new_SavingsGoal" RENAME TO "SavingsGoal";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
