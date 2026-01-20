import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from "@nestjs/common";
import { PersonService } from "../services/person.service";
import { CreatePersonDto } from "../dto/create-person.dto";
import { UpdatePersonDto } from "../dto/update-person.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

@Controller("people")
@UseGuards(JwtAuthGuard)
export class PersonController {
    constructor(private readonly personService: PersonService) {}

    @Post()
    create(@Request() req: any, @Body() createPersonDto: CreatePersonDto) {
        return this.personService.create(req.user.userId, createPersonDto);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.personService.findAll(req.user.userId);
    }

    @Get(":id")
    findOne(@Request() req: any, @Param("id") id: string) {
        return this.personService.findOne(req.user.userId, id);
    }

    @Patch(":id")
    update(
        @Request() req: any,
        @Param("id") id: string,
        @Body() updatePersonDto: UpdatePersonDto,
    ) {
        return this.personService.update(req.user.userId, id, updatePersonDto);
    }

    @Delete(":id")
    remove(@Request() req: any, @Param("id") id: string) {
        return this.personService.remove(req.user.userId, id);
    }
}
