import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAccountDto: CreateAccountDto) {
    return this.prisma.account.create({
      data: createAccountDto,
    });
  }

  findAll() {
    return this.prisma.account.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  update(id: string, updateAccountDto: UpdateAccountDto) {
    return this.prisma.account.update({
      where: { id },
      data: updateAccountDto,
    });
  }

  remove(id: string) {
    return this.prisma.account.delete({
      where: { id },
    });
  }
}
