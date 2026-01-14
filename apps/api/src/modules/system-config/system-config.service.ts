import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class SystemConfigService {
    constructor(private prisma: PrismaService) {}

    async get(userId: string, key: string) {
        const config = await this.prisma.systemConfig.findUnique({
            where: {
                key_userId: {
                    key,
                    userId,
                },
            },
        });
        return config?.value || null;
    }

    async set(userId: string, key: string, value: string) {
        return this.prisma.systemConfig.upsert({
            where: {
                key_userId: {
                    key,
                    userId,
                },
            },
            update: {
                value,
            },
            create: {
                key,
                value,
                userId,
            },
        });
    }

    async getAll(userId: string) {
        const configs = await this.prisma.systemConfig.findMany({
            where: {
                userId,
            },
        });
        // Convert to object { key: value }
        return configs.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);
    }
}
