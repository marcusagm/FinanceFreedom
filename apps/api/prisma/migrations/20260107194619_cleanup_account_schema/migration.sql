/*
  Warnings:

  - You are about to drop the column `dueDateDay` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `interestRate` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `minimumPayment` on the `Account` table. All the data in the column will be lost.

*/
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
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Account" ("balance", "color", "createdAt", "id", "name", "type", "updatedAt") SELECT "balance", "color", "createdAt", "id", "name", "type", "updatedAt" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
