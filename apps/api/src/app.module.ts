import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AccountModule } from './modules/account/account.module';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [PrismaModule, AccountModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
