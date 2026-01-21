export interface Person {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePersonDto {
    name: string;
    email?: string;
    phone?: string;
}

export interface UpdatePersonDto extends Partial<CreatePersonDto> {}
