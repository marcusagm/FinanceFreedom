import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { CreatePersonDto } from "../dto/create-person.dto";
import { UpdatePersonDto } from "../dto/update-person.dto";

@Injectable()
export class PersonService {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: string, createPersonDto: CreatePersonDto) {
        return this.prisma.person.create({
            data: {
                ...createPersonDto,
                userId,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.person.findMany({
            where: { userId },
            orderBy: { name: "asc" },
        });
    }

    async findOne(userId: string, id: string) {
        const person = await this.prisma.person.findFirst({
            where: { id, userId },
        });
        if (!person) throw new NotFoundException(`Person ${id} not found`);
        return person;
    }

    async update(userId: string, id: string, updatePersonDto: UpdatePersonDto) {
        await this.findOne(userId, id);
        return this.prisma.person.update({
            where: { id },
            data: updatePersonDto,
        });
    }

    async remove(userId: string, id: string) {
        await this.findOne(userId, id);
        return this.prisma.person.delete({
            where: { id },
        });
    }
}
