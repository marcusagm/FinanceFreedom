-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmailCredential" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "secure" BOOLEAN NOT NULL DEFAULT true,
    "folder" TEXT NOT NULL DEFAULT 'INBOX',
    "sender" TEXT,
    "subject" TEXT,
    "accountId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmailCredential_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EmailCredential" ("accountId", "createdAt", "email", "host", "id", "password", "port", "secure", "updatedAt") SELECT "accountId", "createdAt", "email", "host", "id", "password", "port", "secure", "updatedAt" FROM "EmailCredential";
DROP TABLE "EmailCredential";
ALTER TABLE "new_EmailCredential" RENAME TO "EmailCredential";
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" DECIMAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "accountId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "debtId" TEXT,
    CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Transaction_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "Debt" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("accountId", "amount", "category", "createdAt", "date", "description", "id", "type", "updatedAt") SELECT "accountId", "amount", "category", "createdAt", "date", "description", "id", "type", "updatedAt" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE TABLE "new_WorkUnit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "defaultPrice" DECIMAL NOT NULL DEFAULT 0.0,
    "estimatedTime" DECIMAL NOT NULL DEFAULT 0.0,
    "taxRate" DECIMAL NOT NULL DEFAULT 0.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WorkUnit" ("createdAt", "defaultPrice", "estimatedTime", "id", "name", "updatedAt") SELECT "createdAt", "defaultPrice", "estimatedTime", "id", "name", "updatedAt" FROM "WorkUnit";
DROP TABLE "WorkUnit";
ALTER TABLE "new_WorkUnit" RENAME TO "WorkUnit";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
