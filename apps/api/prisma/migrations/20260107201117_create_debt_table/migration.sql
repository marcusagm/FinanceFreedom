-- CreateTable
CREATE TABLE "Debt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "totalAmount" DECIMAL NOT NULL DEFAULT 0.0,
    "interestRate" DECIMAL NOT NULL DEFAULT 0.0,
    "minimumPayment" DECIMAL NOT NULL DEFAULT 0.0,
    "dueDate" INTEGER NOT NULL,
    "categoryId" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
