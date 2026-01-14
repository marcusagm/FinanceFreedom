-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Debt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "totalAmount" DECIMAL NOT NULL DEFAULT 0.0,
    "interestRate" DECIMAL NOT NULL DEFAULT 0.0,
    "minimumPayment" DECIMAL NOT NULL DEFAULT 0.0,
    "dueDate" INTEGER NOT NULL,
    "installmentsTotal" INTEGER,
    "installmentsPaid" INTEGER NOT NULL DEFAULT 0,
    "originalAmount" DECIMAL,
    "firstInstallmentDate" DATETIME,
    "categoryId" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Debt_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Debt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Debt" ("categoryId", "createdAt", "dueDate", "id", "interestRate", "minimumPayment", "name", "priority", "totalAmount", "updatedAt", "userId") SELECT "categoryId", "createdAt", "dueDate", "id", "interestRate", "minimumPayment", "name", "priority", "totalAmount", "updatedAt", "userId" FROM "Debt";
DROP TABLE "Debt";
ALTER TABLE "new_Debt" RENAME TO "Debt";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
