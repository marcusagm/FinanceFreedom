/*
  Warnings:

  - Added the required column `userId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Debt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `EmailCredential` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `IncomeSource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ProjectedIncome` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `WorkUnit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Create Default User
INSERT INTO "User" ("id", "email", "passwordHash", "name", "createdAt", "updatedAt") 
VALUES ('default-user', 'admin@financefreedom.com', '$2b$10$T/tA7h8/M.7/O.7/O.7/O.7/O.7/O.7/O.7/O', 'Admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "icon" TEXT,
    "type" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "balance" DECIMAL NOT NULL DEFAULT 0.0,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Account" ("balance", "color", "createdAt", "id", "name", "type", "updatedAt", "userId") SELECT "balance", "color", "createdAt", "id", "name", "type", "updatedAt", 'default-user' FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
CREATE TABLE "new_Debt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "totalAmount" DECIMAL NOT NULL DEFAULT 0.0,
    "interestRate" DECIMAL NOT NULL DEFAULT 0.0,
    "minimumPayment" DECIMAL NOT NULL DEFAULT 0.0,
    "dueDate" INTEGER NOT NULL,
    "categoryId" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Debt_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Debt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Debt" ("categoryId", "createdAt", "dueDate", "id", "interestRate", "minimumPayment", "name", "priority", "totalAmount", "updatedAt", "userId") SELECT NULL, "createdAt", "dueDate", "id", "interestRate", "minimumPayment", "name", "priority", "totalAmount", "updatedAt", 'default-user' FROM "Debt";
DROP TABLE "Debt";
ALTER TABLE "new_Debt" RENAME TO "Debt";
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
    "userId" TEXT NOT NULL,
    CONSTRAINT "EmailCredential_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EmailCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EmailCredential" ("accountId", "createdAt", "email", "folder", "host", "id", "password", "port", "secure", "sender", "subject", "updatedAt", "userId") SELECT "accountId", "createdAt", "email", "folder", "host", "id", "password", "port", "secure", "sender", "subject", "updatedAt", 'default-user' FROM "EmailCredential";
DROP TABLE "EmailCredential";
ALTER TABLE "new_EmailCredential" RENAME TO "EmailCredential";
CREATE TABLE "new_IncomeSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL DEFAULT 0.0,
    "payDay" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "IncomeSource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_IncomeSource" ("amount", "createdAt", "id", "name", "payDay", "updatedAt", "userId") SELECT "amount", "createdAt", "id", "name", "payDay", "updatedAt", 'default-user' FROM "IncomeSource";
DROP TABLE "IncomeSource";
ALTER TABLE "new_IncomeSource" RENAME TO "IncomeSource";
CREATE TABLE "new_ProjectedIncome" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workUnitId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "date" DATETIME NOT NULL,
    "amount" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "transactionId" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "ProjectedIncome_workUnitId_fkey" FOREIGN KEY ("workUnitId") REFERENCES "WorkUnit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjectedIncome_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProjectedIncome_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProjectedIncome" ("amount", "createdAt", "date", "id", "status", "transactionId", "updatedAt", "workUnitId", "userId") SELECT "amount", "createdAt", "date", "id", "status", "transactionId", "updatedAt", "workUnitId", 'default-user' FROM "ProjectedIncome";
DROP TABLE "ProjectedIncome";
ALTER TABLE "new_ProjectedIncome" RENAME TO "ProjectedIncome";
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" DECIMAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "categoryId" TEXT,
    "accountId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "debtId" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Transaction_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "Debt" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("accountId", "amount", "category", "createdAt", "date", "debtId", "description", "id", "type", "updatedAt", "userId") SELECT "accountId", "amount", "category", "createdAt", "date", "debtId", "description", "id", "type", "updatedAt", 'default-user' FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE TABLE "new_WorkUnit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "defaultPrice" DECIMAL NOT NULL DEFAULT 0.0,
    "estimatedTime" DECIMAL NOT NULL DEFAULT 0.0,
    "taxRate" DECIMAL NOT NULL DEFAULT 0.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "WorkUnit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WorkUnit" ("createdAt", "defaultPrice", "estimatedTime", "id", "name", "taxRate", "updatedAt", "userId") SELECT "createdAt", "defaultPrice", "estimatedTime", "id", "name", "taxRate", "updatedAt", 'default-user' FROM "WorkUnit";
DROP TABLE "WorkUnit";
ALTER TABLE "new_WorkUnit" RENAME TO "WorkUnit";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
