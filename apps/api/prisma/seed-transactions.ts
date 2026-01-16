import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding transactions...");
    let user = await prisma.user.findFirst();
    if (!user) {
        console.log("Creating default user...");
        user = await prisma.user.create({
            data: {
                email: "test@example.com",
                passwordHash: "hash",
                name: "Test User",
            },
        });
    }

    let account = await prisma.account.findFirst({
        where: { userId: user.id },
    });
    if (!account) {
        console.log("Creating default account...");
        account = await prisma.account.create({
            data: {
                userId: user.id,
                name: "Test Setup Account",
                type: "WALLET",
                balance: 1000,
            },
        });
    }

    console.log(`Seeding for user ${user.id}, account ${account.id}`);

    for (let i = 1; i <= 60; i++) {
        await prisma.transaction.create({
            data: {
                userId: user.id,
                accountId: account.id,
                amount: Math.floor(Math.random() * 1000) + 1,
                type: i % 2 === 0 ? "INCOME" : "EXPENSE",
                date: new Date(),
                description: `Seeded Transaction ${i}`,
            },
        });
    }

    console.log("Seeded 60 transactions");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
