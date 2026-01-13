import { Injectable } from "@nestjs/common";
import { CreateTransactionDto } from "../transaction/dto/create-transaction.dto";
import { PrismaService } from "../../prisma/prisma.service";
import * as crypto from "crypto";

@Injectable()
export class SmartMergerService {
    constructor(private readonly prisma: PrismaService) {}

    async filterDuplicates(
        userId: string,
        accountId: string,
        transactions: CreateTransactionDto[]
    ): Promise<CreateTransactionDto[]> {
        const uniqueTransactions: CreateTransactionDto[] = [];

        // Get existing transactions for this account to compare?
        // Or just check hash? Checking hash for ALL transactions might be heavy if not indexed.
        // Ideally, we check if a transaction with same amount, date, description exists.

        // Strategy: For each incoming transaction, compute hash.
        // Check if a transaction with this hash exists?
        // We don't have a hash column in DB yet.
        // So we query by (amount, date, description).

        // Optimization: Load distinct signatures from DB for this account within the date range of the import.
        if (transactions.length === 0) return [];

        const dates = transactions.map((t) => new Date(t.date));
        const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
        const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

        // Add buffer
        minDate.setDate(minDate.getDate() - 1);
        maxDate.setDate(maxDate.getDate() + 1);

        const existing = await this.prisma.transaction.findMany({
            where: {
                userId,
                accountId,
                date: {
                    gte: minDate,
                    lte: maxDate,
                },
            },
            select: {
                amount: true,
                date: true,
                description: true,
            },
        });

        const existingSignatures = new Set(
            existing.map((t) =>
                this.computeSignature(
                    t.amount.toNumber(),
                    t.date,
                    t.description
                )
            )
        );

        for (const t of transactions) {
            const signature = this.computeSignature(
                t.amount,
                new Date(t.date),
                t.description
            );
            if (!existingSignatures.has(signature)) {
                uniqueTransactions.push(t);
            }
        }

        return uniqueTransactions;
    }

    private computeSignature(
        amount: number,
        date: Date,
        description: string
    ): string {
        // Normalize
        const dateStr = date.toISOString().split("T")[0]; // Compare only Date part?
        const descNorm = description.trim().toLowerCase();
        // Amount is float, be careful. Convert to fixed 2 string.
        const amountStr = amount.toFixed(2);

        return `${dateStr}|${amountStr}|${descNorm}`;
    }
}
