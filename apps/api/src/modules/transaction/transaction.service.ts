import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTransactionDto: CreateTransactionDto) {
    const { accountId, amount, type, date, ...rest } = createTransactionDto;

    // Use interactive transaction to ensure atomicity
    return this.prisma.$transaction(
      async (prisma: Prisma.TransactionClient) => {
        // 1. Create the transaction
        const transaction = await prisma.transaction.create({
          data: {
            accountId,
            amount,
            type,
            date: new Date(date),
            ...rest,
          },
        });

        // 2. Update the account balance
        const account = await prisma.account.findUnique({
          where: { id: accountId },
        });

        if (!account) {
          throw new NotFoundException(`Account with ID ${accountId} not found`);
        }

        const balanceChange = type === 'INCOME' ? amount : -amount;
        const newBalance = Number(account.balance) + Number(balanceChange);

        await prisma.account.update({
          where: { id: accountId },
          data: { balance: newBalance },
        });

        return transaction;
      },
    );
  }

  findAll() {
    return this.prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      include: { account: true },
    });
  }

  findOne(id: string) {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: { account: true },
    });
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const { accountId, amount, type, date, ...rest } = updateTransactionDto;

    return this.prisma.$transaction(
      async (prisma: Prisma.TransactionClient) => {
        // 1. Get original transaction
        const oldTransaction = await prisma.transaction.findUnique({
          where: { id },
          include: { account: true },
        });

        if (!oldTransaction) {
          throw new NotFoundException(`Transaction with ID ${id} not found`);
        }

        // 2. Revert balance on original account
        const oldBalanceChange =
          oldTransaction.type === 'INCOME'
            ? Number(oldTransaction.amount)
            : -Number(oldTransaction.amount);
        const revertedBalance =
          Number(oldTransaction.account.balance) - oldBalanceChange;

        await prisma.account.update({
          where: { id: oldTransaction.accountId },
          data: { balance: revertedBalance },
        });

        // 3. Prepare new data
        // If accountId is changing, we need to handle that. For now assuming accountId might change OR stay same.
        // But we just reverted the old account. So now we act as if it's a new transaction.
        // However, if accountId DID NOT change, we updated the same account twice. Prisma handles this fine.

        const targetAccountId = accountId || oldTransaction.accountId;
        const targetAmount =
          amount !== undefined ? amount : Number(oldTransaction.amount);
        const targetType = type || oldTransaction.type;

        // 4. Update the transaction record
        const updatedTransaction = await prisma.transaction.update({
          where: { id },
          data: {
            accountId: targetAccountId,
            amount: targetAmount,
            type: targetType,
            date: date ? new Date(date) : undefined,
            ...rest,
          },
        });

        // 5. Apply new balance to target account
        // Need to fetch target account again to get fresh balance (especially if it was the same as old account)
        const targetAccount = await prisma.account.findUnique({
          where: { id: targetAccountId },
        });

        if (!targetAccount) {
          throw new NotFoundException(
            `Account with ID ${targetAccountId} not found`,
          );
        }

        const newBalanceChange =
          targetType === 'INCOME'
            ? Number(targetAmount)
            : -Number(targetAmount);
        const finalBalance = Number(targetAccount.balance) + newBalanceChange;

        await prisma.account.update({
          where: { id: targetAccountId },
          data: { balance: finalBalance },
        });

        return updatedTransaction;
      },
    );
  }

  remove(id: string) {
    return this.prisma.$transaction(
      async (prisma: Prisma.TransactionClient) => {
        // 1. Get transaction
        const transaction = await prisma.transaction.findUnique({
          where: { id },
          include: { account: true },
        });

        if (!transaction) {
          throw new NotFoundException(`Transaction with ID ${id} not found`);
        }

        // 2. Revert balance
        const balanceChange =
          transaction.type === 'INCOME'
            ? Number(transaction.amount)
            : -Number(transaction.amount);
        const newBalance = Number(transaction.account.balance) - balanceChange;

        await prisma.account.update({
          where: { id: transaction.accountId },
          data: { balance: newBalance },
        });

        // 3. Delete transaction
        return prisma.transaction.delete({
          where: { id },
        });
      },
    );
  }
}
