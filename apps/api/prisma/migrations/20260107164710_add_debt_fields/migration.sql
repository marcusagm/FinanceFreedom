-- AlterTable
ALTER TABLE "Account" ADD COLUMN "dueDateDay" INTEGER;
ALTER TABLE "Account" ADD COLUMN "interestRate" DECIMAL DEFAULT 0.0;
ALTER TABLE "Account" ADD COLUMN "minimumPayment" DECIMAL DEFAULT 0.0;

-- CreateTable
CREATE TABLE "EmailCredential" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "secure" BOOLEAN NOT NULL DEFAULT true,
    "accountId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmailCredential_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailCredential_email_key" ON "EmailCredential"("email");
