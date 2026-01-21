import { api } from "../lib/api";
import type { CreatePersonDto, Person, UpdatePersonDto } from "../types/person";

export const personService = {
    findAll: async () => {
        const response = await api.get<Person[]>("/people");
        return response.data;
    },

    create: async (data: CreatePersonDto) => {
        const response = await api.post<Person>("/people", data);
        return response.data;
    },

    update: async (id: string, data: UpdatePersonDto) => {
        const response = await api.patch<Person>(`/people/${id}`, data);
        return response.data;
    },

    remove: async (id: string) => {
        await api.delete(`/people/${id}`);
    },
};
