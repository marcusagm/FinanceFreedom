const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
    const email = "admin@financefreedom.com";
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: { passwordHash: hashedPassword },
        create: {
            email,
            passwordHash: hashedPassword,
            name: "Admin",
            id: "default-user",
        },
    });

    console.log(
        `User ${user.email} updated/created with password: ${password}`
    );
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
