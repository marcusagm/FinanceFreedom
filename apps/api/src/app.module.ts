import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { AccountModule } from "./modules/account/account.module";
import { TransactionModule } from "./modules/transaction/transaction.module";
import { ImportModule } from "./modules/import/import.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";

@Module({
    imports: [
        PrismaModule,
        AccountModule,
        TransactionModule,
        ImportModule,
        DashboardModule,
        BullModule.forRoot({
            connection: {
                host: process.env.REDIS_HOST || "localhost",
                port: Number(process.env.REDIS_PORT) || 6379,
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
