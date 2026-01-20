import { Module } from "@nestjs/common";
import { PersonService } from "./services/person.service";
import { PersonController } from "./controllers/person.controller";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [PersonController],
    providers: [PersonService],
    exports: [PersonService],
})
export class PersonModule {}
