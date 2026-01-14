import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { BullModule } from "@nestjs/bullmq";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { AccountModule } from "./modules/account/account.module";
import { TransactionModule } from "./modules/transaction/transaction.module";
import { ImportModule } from "./modules/import/import.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { SimulatorModule } from "./modules/simulator/simulator.module";
import { DebtModule } from "./modules/debt/debt.module";
import { IncomeModule } from "./modules/income/income.module";
import { SystemConfigModule } from "./modules/system-config/system-config.module";
import { FixedExpenseModule } from "./modules/fixed-expense/fixed-expense.module";
import { CategoryModule } from "./modules/category/category.module";
import { InvestmentAccountModule } from './modules/investment-account/investment-account.module';
import { SavingsGoalModule } from './modules/savings-goal/savings-goal.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        AuthModule,
        AccountModule,
        TransactionModule,
        ImportModule,
        DashboardModule,
        SimulatorModule,
        BullModule.forRoot({
            connection: {
                host: process.env.REDIS_HOST || "localhost",
                port: Number(process.env.REDIS_PORT) || 6379,
            },
        }),
        DebtModule,
        IncomeModule,
        SystemConfigModule,
        FixedExpenseModule,
        CategoryModule,
        InvestmentAccountModule,
        SavingsGoalModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
